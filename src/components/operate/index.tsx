import {BoardSizeType} from "@/config/board";
import React from "react";
import {Group, Rect, Text} from "react-konva";
import Card from "../card";

type OperateProps = {
    text: string;
    x: number;
    boardSize: BoardSizeType;
    op: Function;
    pairs?: number[]
}


const Operate: React.FC<OperateProps> = ({text, x, boardSize, op, pairs = []}) => {
    return <Group x={x}
                  onTap={() => op()}
                  onClick={() => op()}>
        {pairs.map((v, index) =>
            <Card
                key={index}
                num={v}
                card={0}
                x={boardSize.cardWidth * index}
                y={-boardSize.cardHeight}
                boardSize={boardSize}
            />)
        }
        <Rect
            width={boardSize.cardWidth * 2}
            height={boardSize.cardWidth}
            cornerRadius={boardSize.boardEdge / 20}
            fill="#000"
            opacity={0.5}
            shadowColor="#000"
            shadowBlur={10}
            shadowOffset={{x: boardSize.cardWidth / 10, y: boardSize.cardWidth / 10}}
            shadowOpacity={0.5}
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
