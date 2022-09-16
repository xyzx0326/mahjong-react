import {BoardSizeType} from "@/config/board";
import React from 'react';

import {Group, Layer, Rect, Text} from "react-konva";

type BrandProps = {
    leftCount: number
    gameIsEnd: boolean
    boardSize: BoardSizeType;
}


const Brand: React.FC<BrandProps> = ({leftCount, gameIsEnd, boardSize}) => {
    const {width, height, direction} = boardSize;

    const board = direction === 1 ? height : width;
    const brandBoard = board / 3;

    const text = gameIsEnd ? '结束' : `余 ${leftCount}`;
    return (
        <Layer>
            <Rect
                x={brandBoard}
                y={brandBoard}
                width={brandBoard}
                height={brandBoard}
                fill="#000"
                opacity={0.2}
                cornerRadius={boardSize.boardEdge / 10}
            />
            <Group
                x={brandBoard * 4 / 3}
                y={brandBoard * 4 / 3}
                width={brandBoard / 3}
                height={brandBoard / 3}
            >
                <Rect
                    width={brandBoard / 3}
                    height={brandBoard / 3}
                    fill="#000"
                    opacity={0.2}
                    cornerRadius={boardSize.boardEdge / 20}
                />
                <Text
                    y={brandBoard / 20}
                    width={brandBoard / 3}
                    height={brandBoard / 3}
                    text={`东一局`}
                    fontSize={brandBoard * 0.09}
                    verticalAlign={"top"}
                    align={"center"}
                    fill="#fff"
                />
                <Text
                    y={-brandBoard / 30}
                    width={brandBoard / 3}
                    height={brandBoard / 3}
                    text={text}
                    fontSize={brandBoard * 0.09}
                    verticalAlign={"bottom"}
                    align={"center"}
                    fill="#fff"
                />
            </Group>
        </Layer>
    );
}

export default Brand;
