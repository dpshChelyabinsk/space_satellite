import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { privateRoutes, publicRoutes } from "../../router";
import Loader from "../UI/loader/Loader";
import { Context } from "../../App";

const AppRouter: React.FC = observer(() => {
	const { store } = useContext(Context);
	const location = useLocation();
	const [currentPath, setCurrentPath] = useState<string>(() => {
		return sessionStorage.getItem("currentPath") || "/home";
	});

	useEffect(() => {
		if (store.isAuth) {
			setCurrentPath(location.pathname);
			sessionStorage.setItem("currentPath", location.pathname);
		}
		// eslint-disable-next-line
	}, [location]);

	useEffect(() => {
		if (localStorage.getItem("token")) {
			store.checkAuth();
		}
		store.setLoading(false);
	}, [store]);

	if (store.isLoading) {
		return (
			<div>
				<Loader />
			</div>
		);
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
			<Route path="/*" element={<Navigate to={currentPath} replace />} />
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
