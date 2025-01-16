import React, {useContext, useState} from 'react';
import {Context} from "../../../App";
import {observer} from "mobx-react-lite";
import BaseButton from "../buttons/BaseButton";
import { LoginFormClasses } from "./styles"
import BaseInput from "../inputs/BaseInput";
import classes from "../inputs/styles/BaseInput.module.css";

const LoginForm = () => {
	const [login, setLogin] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [loginPassError, setLoginPassError] = useState<string>('');
	const {store} = useContext(Context);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoginPassError('');

		const error = await store.login(login, password);
		if (error) {
			if (error.includes('Имя пользователя или пароль являются не правильными')) {
				setLoginPassError(error);
			}
		}
	};

	return (
		<form className={LoginFormClasses.container} onSubmit={handleSubmit}>
			<h1 className={LoginFormClasses.header}>Вход в панель управления</h1>
			<div className={LoginFormClasses.inputsBox}>
				{loginPassError ? <div className={classes.error}>{loginPassError}</div> : <div className={classes.error}><br/></div>}
				<BaseInput
					onChange={e => setLogin(e.target.value)}
					value={login}
					type="text"
					placeholder={'Логин'}
					error={loginPassError}
				/>
				<BaseInput
					onChange={e => setPassword(e.target.value)}
					value={password}
					type="password"
					autoComplete="false"
					placeholder={'Пароль'}
					error={loginPassError}
				/>
			</div>
			<BaseButton type="submit">
				Войти
			</BaseButton>
		</form>
	);
};

export default observer(LoginForm);