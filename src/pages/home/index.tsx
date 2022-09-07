import {nanoid} from "@reduxjs/toolkit";

import React from 'react';
import {useNavigate} from "react-router-dom";

import './index.scss'

function Home() {
    const navigate = useNavigate();
    const roomId = nanoid();
    return (
        <div className="home">
            <h1>麻将</h1>
            <button onClick={() => navigate(`/play/remote/${roomId}`)}>
                线上与人对战
            </button>
            {/*<button onClick={() => navigate("/play/ai")} disabled>*/}
            {/*    与机器对战*/}
            {/*</button>*/}
        </div>
    );
}

export default Home;
