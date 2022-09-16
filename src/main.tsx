import {defaultRule} from "@/config/rules";
import {Home, Play} from "@/pages";
import {store} from "@/stores";
import {handleRestart, startRound, updateRule, updateSelfIndex} from "@/stores/game";
import {CACHE_RULE_KEY, CacheUtils} from "@/utils";
import {configClient, SeedData} from "game-react";
import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './index.css'

// const url = "10.21.102.209:8888";
const url = "game.congeer.com";
const dispatch = store.dispatch;
configClient("ws://" + url + "/game/ws", {
    maxPlayer: 4,
    baseConfig: [
        updateRule(CacheUtils.getItem(CACHE_RULE_KEY, defaultRule))
    ],
    playerConfig: [
        [updateSelfIndex(0)],
        [updateSelfIndex(1)],
        [updateSelfIndex(2)],
        [updateSelfIndex(3)]
    ],
    onConfig: dispatch,
    onAction: dispatch,
    onReset: () => dispatch(handleRestart()),
    onSeed: (data: SeedData) => {
        if (data.code === "main") {
            dispatch(startRound(data.data!))
        }
    }
}, "mahjong")

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store}>
        <BrowserRouter basename="/mahjong">
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/play/:mode" element={<Play/>}/>
                <Route path="/play/:mode/:roomId" element={<Play/>}/>
            </Routes>
        </BrowserRouter>
    </Provider>
)
