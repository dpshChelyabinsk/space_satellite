import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {Context} from "../../../App";
import {MainHeaderClasses} from "./styles"
import {observer} from "mobx-react-lite";

const MainHeader = observer(() => {
	const {store} = useContext(Context);

	return store.isAuth ? (
		<nav className={MainHeaderClasses.container}>
			<div className={MainHeaderClasses.links}>
				<Link to="/home">Главная</Link>
				<Link to="/events">События</Link>
				<Link to="/news">Новости</Link>
				<Link to="/gallery">Галерея</Link>
				<button onClick={() => store.logout()}>выйти</button>
			</div>
		</nav>
	) : (
		<nav className={MainHeaderClasses.container}>
			<div className={MainHeaderClasses.links}>
				Административная панель
			</div>
		</nav>
	);
});

export default MainHeader;