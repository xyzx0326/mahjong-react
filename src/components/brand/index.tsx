import {BoardSizeType} from "@/config/board";
import React from 'react';

import {Layer, Line, Rect} from "react-konva";

type BrandProps = {
    boardSize: BoardSizeType;
}


const Brand: React.FC<BrandProps> = ({boardSize}) => {
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
                fill="#444"/>
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
