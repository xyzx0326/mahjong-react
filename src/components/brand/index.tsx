import {BoardSizeType} from "@/config/board";
import {Player} from "@/stores/game";
import React from 'react';

import {Layer, Line, Rect} from "react-konva";

type BrandProps = {
    players: Player[]
    boardSize: BoardSizeType;
}


const Brand: React.FC<BrandProps> = ({players, boardSize}) => {
    const {width, height, direction} = boardSize;

    const board = direction === 1 ? height : width;
    const brandBoard = board / 3;

    return (
        <Layer>
            <Rect
                x={brandBoard}
                y={brandBoard}
                width={brandBoard}
                height={brandBoard}
                fill="#000"
                opacity={0.2}
            />
            <Line
                points={[
                    brandBoard, brandBoard,
                    2 * brandBoard, 2 * brandBoard,
                ]}
                stroke="#fff"
            />
            <Line
                points={[
                    brandBoard, 2 * brandBoard,
                    2 * brandBoard, brandBoard,
                ]}
                stroke="#fff"
            />
        </Layer>
    );
}

export default Brand;
