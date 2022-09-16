import {BoardSizeType} from "@/config/board";
import {CardType, Player} from "@/stores/game";

import React from 'react';
import {Group, Layer, Stage} from "react-konva";

import Board from "../board";
import Brand from "../brand";
import Operate from "../operate";
import Seat from "../seat";

type GameProps = {
    players: Player[]
    leftCount: number
    currentIndex: number
    contendIndex: number[]
    selfIndex: number
    boardSize: BoardSizeType
    lastOut?: CardType

    onCardSelect?: (card: number, seat: number) => void;
}

const Game: React.FC<GameProps> = ({
                                       players,
                                       currentIndex,
                                       lastOut,
                                       contendIndex,
                                       selfIndex,
                                       boardSize,
                                       leftCount,
                                       onCardSelect
                                   }) => {
    const {width, height, direction, boardEdge} = boardSize
    const board = direction === 1 ? height : width;
    const opWidth = board - boardSize.boardEdge * 2;
    const self = players[selfIndex];

    const inCard = self.enter && self.enter.num;

    const lastOutCard = lastOut && lastOut.num;

    const winSelf = self.strategy.find(v => v.card === inCard && v.type === 'win');

    let opOffset = 0;

    const ops: any = []

    if (contendIndex.length > 0 && contendIndex[0] === selfIndex) {
        self.strategy.filter(v => v.card === lastOutCard).map(v => {
            if (v.type === "win") {
                ops.push({text: "和", op: ()=>{}})
            } else if (v.type === "quadruple") {
                ops.push({text: "杠", op: ()=>{}})
            } else if (v.type === "triplet") {
                ops.push({text: "碰", op: ()=>{}})
            } else if (v.type === "straight") {
                ops.push({text: "吃", op: ()=>{}})
            }
        })
    }
    if (ops.length > 0) {
        ops.push({text: "不要"})
    }

    return (
        <Stage width={board} height={board}>
            <Board boardSize={boardSize}/>
            <Brand leftCount={leftCount} boardSize={boardSize}/>
            {players.map((player, index) => {
                return <Seat currentIndex={currentIndex}
                             selfIndex={selfIndex} maxPlayer={players.length}
                             key={index} player={player} boardSize={boardSize}
                             onCardSelect={onCardSelect}/>
            })}
            <Layer>
                <Group
                    x={boardEdge}
                    y={board - boardSize.cardHeight * 2}
                    height={boardSize.cardWidth}
                    width={opWidth}
                >
                    {winSelf ? <Operate text={"自摸"} x={opOffset++} boardSize={boardSize}/> : null}
                    {ops.map((op: any) => <Operate key={op.text} text={op.text} op={op.op}
                                                   x={opOffset++ * boardSize.cardHeight * 2}
                                                   boardSize={boardSize}/>)}
                </Group>
            </Layer>
        </Stage>
    );
}

export default Game;
