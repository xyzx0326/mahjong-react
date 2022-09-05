import {Board, Seat} from "@/components";
import {BoardSizeType} from "@/config/board";
import {GridData, Player} from "@/stores/game";

import React from 'react';
import {Stage} from "react-konva";

type GameProps = {
    players: Player[]
    selectGrid?: GridData; // 选择的棋子
    boardSize: BoardSizeType; // 棋盘规格

    onCardSelect?: (index: number) => void;
}

const Game: React.FC<GameProps> = ({
                                       players, selectGrid,
                                       boardSize, onCardSelect
                                   }) => {
    const {width, height, direction} = boardSize

    const board = direction === 1 ? height : width;
    return (
        <Stage width={board} height={board}>
            <Board boardSize={boardSize} selectGrid={selectGrid}/>
            {players.map((player, index) => {
                return <Seat key={index} player={player} board={board}
                             boardSize={boardSize} onCardSelect={onCardSelect}/>
            })}
        </Stage>
    );
}

export default Game;
