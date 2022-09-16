import {Game} from "@/components";
import {boardSize} from "@/config/board";
import modes from '@/config/modes'
import {useGo, useRemoteGo, useStore} from "@/hooks";
import {handleOutCard, handleRestart, handleSelectCard} from "@/stores/game";
import {addRoom, leaveRoom, resetRoom, seedCreate, useOnline} from 'game-react';
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
        if (mode === "remote") {
            resetRoom()
            seedCreate({count: 136, start: 0})
        } else {
            go(handleRestart());
        }
    }

    const handleCard = (card: number, seat: number) => {
        if (mode === "remote" && !online.isPlayer) {
            return;
        }
        if (game.gameIsEnd) {
            return
        }
        if (seat !== game.selfIndex) {
            return
        }
        const player = game.players[game.selfIndex];
        if (player.select && game.currentIndex === game.selfIndex) {
            remoteGo(handleOutCard(card))
        } else {
            go(handleSelectCard({card, seat}))
        }
    }
    return (
        <div className="main" style={{width: `${boardSize.width}px`}}>
            <div className="board">
                <div className="board-header">
                    <div>
                        <button style={{marginRight: '10px'}} onClick={restartGame}>重开
                        </button>
                    </div>
                </div>
                <div className="board-body" style={{height: `${boardSize.width}px`}}>
                    <Game
                        contendIndex={game.contendIndex}
                        lastOut={game.lastOut}
                        selfIndex={game.selfIndex}
                        currentIndex={game.currentIndex}
                        leftCount={game.cards.length - game.cardIndex}
                        boardSize={boardSize}
                        players={game.players}
                        onCardSelect={handleCard}
                    />
                </div>
            </div>
        </div>
    );
}

export default Play;
