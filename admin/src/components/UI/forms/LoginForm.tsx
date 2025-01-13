import React, {useContext, useState} from 'react';
import {Context} from "../../../App";
import {observer} from "mobx-react-lite";
import BaseButton from "../buttons/BaseButton";
import { LoginFormClasses } from "./styles"
import BaseInput from "../inputs/BaseInput";

const LoginForm = () => {
	const [login, setLogin] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [loginError, setLoginError] = useState<string>(''); // Ошибка для логина
	const [passwordError, setPasswordError] = useState<string>(''); // Ошибка для пароля
	const {store} = useContext(Context);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoginError('');
		setPasswordError('');

		const error = await store.login(login, password);
		if (error) {
			if (error.includes('Пользователь с таким логином')) {
				setLoginError(error);
			} else if (error.includes('Неправильный пароль')) {
				setPasswordError(error);
			} else {
				setLoginError('Неправильные данные');
			}
		}
	};

	return (
		<form className={LoginFormClasses.container} onSubmit={handleSubmit}>
			<h1 className={LoginFormClasses.header}>Вход в панель управления</h1>
			<div className={LoginFormClasses.inputsBox}>
				<BaseInput
					onChange={e => setLogin(e.target.value)}
					value={login}
					type="text"
					placeholder={'Логин'}
					error={loginError}
				/>
				<BaseInput
					onChange={e => setPassword(e.target.value)}
					value={password}
					type="password"
					autoComplete="false"
					placeholder={'Пароль'}
					error={passwordError}
				/>
			</div>
			<BaseButton type="submit">
				Войти
			</BaseButton>
		</form>
	);
};

export default observer(LoginForm);