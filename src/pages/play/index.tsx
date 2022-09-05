import {Game} from "@/components";
import {boardSize} from "@/config/board";
import modes from '@/config/modes'
import {useGo, useRemoteGo, useStore} from "@/hooks";
import {handleRestart} from "@/stores/game";
import {addRoom, leaveRoom, resetAction, useOnline} from 'game-react';
import React from 'react';
import {useParams} from "react-router-dom";
import {useMount} from "react-use";

import './index.scss'


const Play = () => {
    const game = useStore(state => state.game);
    const online = useOnline();
    const go = useGo();
    const params = useParams();
    const mode = params.mode as (keyof typeof modes) || 'ai';
    const remoteGo = useRemoteGo(mode);

    useMount(() => {
        go(handleRestart())
        if (mode === 'remote') {
            const roomParam = params.roomId!;
            addRoom(roomParam)
        }
    })

    const onBack = () => {
        if (mode === 'remote') {
            leaveRoom()
        }
    };

    const restartGame = () => {
        if (mode === "remote" && !online.isPlayer) {
            return;
        }
        go(handleRestart());
        if (mode === "remote") {
            resetAction()
        }
    }

    return (
        <div className="main" style={{width: `${boardSize.width}px`}}>
            <div className="board-body"
                 style={{height: `${boardSize.height}px`}}>
                <Game
                    selectGrid={game.selectGrid}
                    boardSize={boardSize}
                    players={game.players}
                />
            </div>
        </div>
    );
}

export default Play;
