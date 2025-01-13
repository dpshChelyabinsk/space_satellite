import React, {useContext, useState} from "react";
import UserService from "../services/UserService";
import {Context} from "../App";
import {GetUsers} from "../models/GetUsers";

const Home: React.FC = () => {
	const {store} = useContext(Context);
	const [users, setUsers] = useState<GetUsers[]>([]);

	async function getUsers() {
		try {
			const response = await UserService.fetchUsers();
			console.log(`Логирование ${response}`);
			setUsers(response.data);
		} catch (e: any) {
			console.log(e);
		}
	}

	return (
		<div>
			<h1>{store.isAuth ? `User is authorized ${store.user.email}` : 'You need authorization'}</h1>
			<div>{store.isAuth.toString()}</div>
			<h2>{store.user.isActivated ? 'Is activated' : 'Not activated'}</h2>
			<button onClick={() => store.logout()}>Exit</button>
			<div>
				<button onClick={getUsers}>Get users</button>
			</div>
			{users.map((user, index) =>
				<div key={user.id}>
					{user.id}
					<br/>
					{user.email}
					<br/>
					{user.isActivated ? 'Activated' : 'Not activated'}
					<br/>
					<br/>
				</div>
			)}
		</div>
	);
};

export default Home;
