import {Board, Seat} from "@/components";
import {BoardSizeType} from "@/config/board";
import {GridData, Player} from "@/stores/game";

import React from 'react';
import {Stage} from "react-konva";

type GameProps = {
    players: Player[]
    selectGrid?: GridData; // 选择的棋子
    boardSize: BoardSizeType; // 棋盘规格

    onGridSelect?: (data: GridData) => void;
    onPiecePut?: (data: number) => void;
}

const Game: React.FC<GameProps> = ({
                                       players, selectGrid, boardSize,
                                       onGridSelect, onPiecePut
                                   }) => {
    const {width, height, direction} = boardSize

    const board = direction === 1 ? height : width;
    // cards = [{num: 1}, {num: 2}, {num: 3}, {num: 4},
    //     {num: 5}, {num: 6}, {num: 7}, {num: 8},
    //     {num: 9}, {num: 10}, {num: 11}, {num: 12},
    //     {num: 13}, {num: 14}]
    // let yBoard = board - cardHeight;
    return (
        <Stage width={board} height={board}>
            <Board boardSize={boardSize} selectGrid={selectGrid} onGridSelect={onGridSelect}/>
            {players.map((player, index) => {
                return <Seat key={index} board={board} player={player} boardSize={boardSize}></Seat>
            })}
        </Stage>
    );
}

export default Game;
