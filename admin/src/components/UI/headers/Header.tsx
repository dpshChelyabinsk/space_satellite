import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {Context} from "../../../App";
import "../../../styles/components/Header.css"

const Header = () => {
	const { store } = useContext(Context);

	const logout = () => {
		store.setAuth(false);
		localStorage.removeItem('auth');
	}

	return (
		<nav className="navbar">
			{/*<div>{store.user.toString()}</div>*/}

			{/*<div>{store.isLoading.toString()}</div>*/}
			<div className="navbar__links">
				<Link to="/about">О сайте</Link>
				<Link to="/posts">Посты</Link>
				<button onClick={logout}>выйти</button>
			</div>
		</nav>
	);
};

export default Header;