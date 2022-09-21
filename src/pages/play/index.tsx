import {Game, Header} from "@/components";
import {boardSize} from "@/config/board";
import modes from '@/config/modes'
import {useGo, useRemoteGo, useStore} from "@/hooks";
import {
    handleNoContend,
    handleOutCard,
    handleQuadruple,
    handleRestart,
    handleSelectCard,
    handleStraight,
    handleTriplet,
    handleWin,
    Player
} from "@/stores/game";
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
    const self: Player = game.players[game.selfIndex];

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
        if (self.select === card && game.currentIndex === game.selfIndex && game.contendIndex.length === 0) {
            remoteGo(handleOutCard(card))
        } else {
            go(handleSelectCard({card, seat}))
        }
    }

    const inCard = self.enter && self.enter.num;

    const winSelf = self.strategy.find(v => v.card === inCard && v.type === 'win');
    const quadrupleSelf = self.strategy.filter(v => v.card === inCard && v.type === 'quadruple');

    const lastOutCard = game.lastOut && game.lastOut.num;
    let ops: any = []

    if (online.isPlayer) {
        if (game.contendIndex.length > 0 && game.contendIndex[0] === game.selfIndex) {
            self.strategy.filter(v => v.card === lastOutCard).map(v => {
                if (v.type === "win") {
                    ops.push({
                        text: "和", op: () => {
                            remoteGo(handleWin({index: game.selfIndex, type: "other"}))
                        }
                    })
                } else if (v.type === "quadruple") {
                    ops.push({
                        text: "杠", op: () => {
                            remoteGo(handleQuadruple({index: game.selfIndex}))
                        }
                    })
                } else if (v.type === "triplet") {
                    ops.push({
                        text: "碰", op: () => {
                            remoteGo(handleTriplet({index: game.selfIndex}))
                        }
                    })
                } else if (v.type === "straight" && (game.currentIndex + 1) % game.rule.maxPlayer === game.selfIndex) {
                    ops.push({
                        text: "吃", pairs: v.pairs, op: () => {
                            remoteGo(handleStraight({index: game.selfIndex, pairs: v.pairs}))
                        }
                    })
                }
            })
        }
        if (quadrupleSelf.length > 0 && !self.select) {
            quadrupleSelf.forEach(q => {
                if (q.extra) {
                    ops.push({
                        text: "杠", op: () => {
                            remoteGo(handleQuadruple({index: game.selfIndex, type: q.extra}))
                        }
                    })
                } else {
                    ops.push({
                        text: "杠", op: () => {
                            remoteGo(handleQuadruple({index: game.selfIndex, type: 'self'}))
                        }
                    })
                }
            })
        }
        if (ops.length > 0) {
            ops.push({
                text: "不要", op: () => {
                    remoteGo(handleNoContend({index: game.selfIndex}))
                }
            })
        }
        if (winSelf && !self.select) {
            ops = [{
                text: "自摸", op: () => {
                    remoteGo(handleWin({index: game.selfIndex, type: "self"}))
                }
            }, ...ops]
        }
    }

    return (
        <div className="main" style={{width: `${boardSize.width}px`}}>
            <Header mode={mode} online={online}
                    channelId={params.roomId ? params.roomId!.substring(0, 4) : ''}/>
            <div className="board">
                <div className="board-header">
                    <div>
                        <button style={{marginRight: '10px'}} onClick={restartGame}>重开
                        </button>
                    </div>
                </div>
                <div className="board-body" style={{height: `${boardSize.height}px`}}>
                    <Game
                        lastOut={game.lastOut}
                        selfIndex={game.selfIndex}
                        gameIsEnd={game.gameIsEnd}
                        currentIndex={game.currentIndex}
                        contendIndex={game.contendIndex}
                        leftCount={game.cardEndIndex - game.cardIndex + 1}
                        boardSize={boardSize}
                        players={game.players}
                        onCardSelect={handleCard}
                        ops={ops}
                    />
                </div>
            </div>
        </div>
    );
}

export default Play;
