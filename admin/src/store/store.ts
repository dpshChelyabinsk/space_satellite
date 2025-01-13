import {IUser} from "../models/IUser";
import {makeAutoObservable, makeObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
import {AuthResposne} from "../models/response/AuthResposne";
import {API_URL} from "../http";

export default class Store {
	user = {} as IUser;
	isAuth = false;
	isLoading = false;

	constructor() {
		makeAutoObservable(this);
	}

	setAuth(bool: boolean) {
		this.isAuth = bool;
	}

	setUser(user: IUser) {
		this.user = user;
	}

	setLoading(bool: boolean) {
		this.isLoading = bool;
	}

	async login(login: string, password: string) {
		try {
			const response = await AuthService.login(login, password);
			localStorage.setItem('token', response.data.accessToken);
			this.setAuth(true);
			this.setUser(response.data.user)
		} catch (e: any) {
			//console.log(e.response?.data?.message);
			return e.response?.data?.message || 'Ошибка авторизации';
		}
	}

	async registration(
		login: string,
		fullName: string,
		password: string,
		email: string,
		role: string
	) {
		try {
			const response = await AuthService.registration(
				login,
				fullName,
				password,
				email,
				role
			);
			console.log(response);
			localStorage.setItem('token', response.data.accessToken);
			this.setAuth(true);
			this.setUser(response.data.user);
		} catch (e: any) {
			console.log(e.response?.data?.message);
		}
	}

	async logout() {
		try {
			const response = await AuthService.logout();
			localStorage.removeItem('token');
			this.setAuth(false);
			this.setUser({} as IUser);
		} catch (e: any) {
			console.log(e.response?.data?.message);
		}
	}

	async checkAuth() {
		this.setLoading(true);
		try {
			const response = await axios.get<AuthResposne>(
				`${API_URL}/refresh`,
				{withCredentials: true}
			);
			console.log('checkAuth user data:', response.data.user);
			localStorage.setItem('token', response.data.accessToken);
			this.setAuth(true);
			this.setUser(response.data.user);
		} catch (e: any) {
			console.log(e.response?.data?.message);
		} finally {
			this.setLoading(false);
		}
	}
}