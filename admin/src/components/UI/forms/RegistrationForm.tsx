import React, {FC, useContext, useState} from 'react';
import {Context} from "../../../App";
import {observer} from "mobx-react-lite";
import {RegistrationFormClasses} from "./styles"

const RegistrationForm = () => {
	const [login, setLogin] = useState<string>('');
	const [fullName, setFullName] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [role, setRole] = useState<string>('');
	const {store} = useContext(Context);

	return (
		<div className={RegistrationFormClasses.container}>
			<input
				onChange={e => setLogin(e.target.value)}
				value={login}
				type="text"
				placeholder={'login'}
			/>
			<input
				onChange={e => setFullName(e.target.value)}
				value={fullName}
				type="text"
				placeholder={'Full name'}
			/>
			<input
				onChange={e => setPassword(e.target.value)}
				value={password}
				type="password"
				placeholder={'password'}
			/>

			<input
				onChange={e => setEmail(e.target.value)}
				value={email}
				type="text"
				placeholder={'email'}
			/>
			<input
				onChange={e => setRole(e.target.value)}
				value={role}
				type="text"
				placeholder={'role'}
			/>
			<button>Login</button>
			<button onClick={() => store.registration(login, fullName, password, email, role)}>
				Registration
			</button>
		</div>
	);
};

export default observer(RegistrationForm);