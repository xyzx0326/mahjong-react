import {Board, Piece} from "@/components";
import {BoardSizeType} from "@/config/board";
import {GridData, PieceType} from "@/stores/game";

import React from 'react';
import {Layer, Stage} from "react-konva";

type GameProps = {
    pieces: PieceType[]; // 棋子数据
    selectGrid?: GridData; // 选择的棋子
    boardSize: BoardSizeType; // 棋盘规格

    onGridSelect?: (data: GridData) => void;
    onPiecePut?: (data: number) => void;
}

const Game: React.FC<GameProps> = ({
                                       pieces, selectGrid, boardSize,
                                       onGridSelect, onPiecePut
                                   }) => {
    const {width, height, boardEdge, cardHeight, direction} = boardSize

    pieces = [{num: 1}, {num: 2}, {num: 3}, {num: 4},
        {num: 5}, {num: 6}, {num: 7}, {num: 8},
        {num: 9}, {num: 10}, {num: 11}, {num: 12},
        {num: 13}, {num: 14}]
    return (
        <Stage width={width} height={height}>
            <Board boardSize={boardSize} selectGrid={selectGrid} onGridSelect={onGridSelect}/>

            <Layer x={boardEdge} y={boardEdge - direction * cardHeight}>
                {pieces.map((piece, index) => {
                    return <Piece key={piece.num}
                                  num={piece.num}
                                  index={index}
                                  boardSize={boardSize}
                    />;
                })}
            </Layer>

            <Layer x={boardEdge} y={height - boardEdge - direction * cardHeight}>
                {pieces.map((piece, index) => {
                    return <Piece key={piece.num}
                                  num={piece.num}
                                  index={index}
                                  boardSize={boardSize}
                    />;
                })}
            </Layer>
        </Stage>
    );
}

export default Game;
