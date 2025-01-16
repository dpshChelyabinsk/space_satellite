import React from "react";
import Auth from "../pages/Auth";
import Home from "../pages/Home";
import Events from "../pages/Events";
import News from "../pages/News";
import Gallery from "../pages/Gallery";

interface RouteType {
	id: number;
	path: string;
	element: React.ReactNode;
	exact?: boolean;
}

// Private routes
export const privateRoutes: RouteType[] = [
	{ id: 2, path: "/home", element: <Home />, exact: true },
	{ id: 3, path: "/events", element: <Events />, exact: true },
	{ id: 4, path: "/news", element: <News />, exact: true },
	{ id: 5, path: "/gallery", element: <Gallery />, exact: true },
];

// Public routes
export const publicRoutes: RouteType[] = [
	{ id: 1, path: "/login", element: <Auth />, exact: true },
];
