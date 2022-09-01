import {Home, Play} from "@/pages";
import {store} from "@/stores";
import {configClient} from "game-react";
import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './index.css'

const url = "localhost:8888";
// const url = "game.congeer.com";
configClient("ws://" + url + "/game/ws", {
    maxPlayer: 2,
    baseConfig: [],
    playerConfig: [],
    configCallback: store.dispatch,
    actionCallback: store.dispatch
}, "mahjong")


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store}>
        <BrowserRouter basename="/">
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/play/:mode" element={<Play/>}/>
                <Route path="/play/:mode/:roomId" element={<Play/>}/>
            </Routes>
        </BrowserRouter>
    </Provider>
)
