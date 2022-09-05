import {BoardSizeType} from "@/config/board";
import {Player} from "@/stores/game";

import React from 'react';
import {Stage} from "react-konva";

import Board from "../board";
import Brand from "../brand";
import Seat from "../seat";

type GameProps = {
    players: Player[]
    boardSize: BoardSizeType;

    onCardSelect?: (index: number) => void;
}

const Game: React.FC<GameProps> = ({
                                       players,
                                       boardSize,
                                       onCardSelect
                                   }) => {
    const {width, height, direction} = boardSize

    const board = direction === 1 ? height : width;
    return (
        <Stage width={board} height={board}>
            <Board boardSize={boardSize}/>
            <Brand boardSize={boardSize}/>
            {players.map((player, index) => {
                return <Seat key={index} player={player} boardSize={boardSize} onCardSelect={onCardSelect}/>
            })}
        </Stage>
    );
}

export default Game;
