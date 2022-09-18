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
    ops?: any[]
    gameIsEnd: boolean

    onCardSelect?: (card: number, seat: number) => void;
}

const Game: React.FC<GameProps> = ({
                                       players,
                                       currentIndex,
                                       contendIndex,
                                       selfIndex,
                                       boardSize,
                                       gameIsEnd,
                                       leftCount,
                                       onCardSelect,
                                       lastOut,
                                       ops
                                   }) => {
    const {width, height, direction, boardEdge} = boardSize
    const board = direction === 1 ? height : width;
    const opWidth = board - boardSize.boardEdge * 2;

    let opOffset = 0;

    return (
        <Stage width={width} height={height}>
            <Layer>
                <Board boardSize={boardSize}/>
                <Brand leftCount={leftCount} boardSize={boardSize} gameIsEnd={gameIsEnd}/>
                <Group>
                    {players.map((player, index) => {
                        return <Seat currentIndex={currentIndex}
                                     gameIsEnd={gameIsEnd}
                                     contendIndex={contendIndex} lastOut={lastOut}
                                     selfIndex={selfIndex} maxPlayer={players.length}
                                     key={index} player={player} boardSize={boardSize}
                                     onCardSelect={onCardSelect}/>
                    })}
                </Group>
                <Group
                    x={boardEdge}
                    y={board - boardSize.cardHeight * 2}
                    height={boardSize.cardWidth}
                    width={opWidth}
                >
                    {ops?.map((op: any, index) => <Operate key={index} text={op.text} op={op.op}
                                                           pairs={op.pairs}
                                                           x={opOffset++ * boardSize.cardHeight * 2}
                                                           boardSize={boardSize}/>)}
                </Group>
            </Layer>
        </Stage>
    );
}

export default Game;
