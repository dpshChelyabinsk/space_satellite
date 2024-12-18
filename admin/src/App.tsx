import React, { createContext } from 'react';
import {observer} from "mobx-react-lite";
import AppRouter from "./components/AppRouter";
import {BrowserRouter} from "react-router-dom";
import Store from "./store/store";
import Header from "./components/Header";

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
                <Header/>
                <AppRouter/>
            </BrowserRouter>
        </Context.Provider>
    )
}

export default observer(App);
