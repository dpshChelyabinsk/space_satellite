import React, { createContext } from 'react';
import {observer} from "mobx-react-lite";
import AppRouter from "./components/routers/AppRouter";
import {BrowserRouter} from "react-router-dom";
import Store from "./store/store";
import MainHeader from "./components/UI/headers/MainHeader";
import EventStore from "./store/EventStore";

interface StoreState {
    store: Store,
    eventStore: EventStore,
}

const store = new Store();
const eventStore = new EventStore();

export const Context = createContext<StoreState>({
    store,
    eventStore,
});

function App() {
    return (
        <Context.Provider value={{ store, eventStore }}>
            <BrowserRouter>
                <MainHeader/>
                <AppRouter/>
            </BrowserRouter>
        </Context.Provider>
    )
}

export default observer(App);
