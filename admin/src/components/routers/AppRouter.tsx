import React, {useContext, useEffect} from "react";
import { observer } from "mobx-react-lite";
import { Navigate, Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "../../router";
import Loader from "../UI/loader/Loader";
import { Context } from "../../App";

const AppRouter: React.FC = observer(() => {
	const { store } = useContext(Context);

	useEffect(() => {
		if (localStorage.getItem('token')) {
			store.checkAuth();
		}
		store.setLoading(false);
	}, [store]);

	if(store.isLoading) {
		return <div><Loader /></div>
	}

	return store.isAuth ? (
		<Routes>
			{privateRoutes.map((route) => (
				<Route
					key={route.id}
					path={route.path}
					element={route.element}
				/>
			))}
			<Route path="/*" element={<Navigate to="/home" replace />} />
		</Routes>
	) : (
		<Routes>
			{publicRoutes.map((route) => (
				<Route
					key={route.id}
					path={route.path}
					element={route.element}
				/>
			))}
			<Route path="/*" element={<Navigate to="/login" replace />} />
		</Routes>
	);
});

export default AppRouter;
