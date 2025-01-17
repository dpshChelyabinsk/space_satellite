import $api from "../http";
import {AxiosResponse} from 'axios';
import {GetUsers} from "../models/GetUsers";

export default class UserService {
	static fetchUsers(): Promise<AxiosResponse<GetUsers[]>> {
		return $api.get<GetUsers[]>('/users');
	}
}