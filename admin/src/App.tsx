import React, { createContext } from 'react';
import {observer} from "mobx-react-lite";
import AppRouter from "./components/routers/AppRouter";
import {BrowserRouter} from "react-router-dom";
import Store from "./store/store";
import MainHeader from "./components/UI/headers/MainHeader";

interface StoreState {
    store: Store,
}

const store = new Store();

export const Context = createContext<StoreState>({
    store,
});

function App() {
    return (
        <Context.Provider value={
            {store}
        }>
            <BrowserRouter>
                <MainHeader/>
                <AppRouter/>
            </BrowserRouter>
        </Context.Provider>
    )
}

export default observer(App);
