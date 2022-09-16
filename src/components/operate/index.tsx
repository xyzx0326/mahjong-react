import {BoardSizeType} from "@/config/board";
import React from "react";
import {Group, Rect, Text} from "react-konva";

type OperateProps = {
    text: string;
    x: number;
    boardSize: BoardSizeType;
    op?: Function;
}


const Operate: React.FC<OperateProps> = ({text, x, boardSize, op}) => {
    return <Group
        onTap={() => op}
        onClick={() => op}
        x={x}
    >
        <Rect
            width={boardSize.cardWidth * 2}
            height={boardSize.cardWidth}
            cornerRadius={boardSize.boardEdge / 20}
            fill="#000"
            opacity={0.5}
        />
        <Text
            width={boardSize.cardWidth * 2}
            height={boardSize.cardWidth}
            text={text}
            fill="#fff"
            verticalAlign="middle"
            align="center"
            fontSize={boardSize.cardWidth / 2}
        />
    </Group>
}

export default Operate;
