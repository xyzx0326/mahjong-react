import pai from '@/assets/card/pai.gif';
import {BoardSizeType} from "@/config/board";
import cards from "@/config/card";

import Konva from "konva";
import React, {useRef} from 'react';
import {Group, Image as KImage} from "react-konva";

type CardProps = {
    num: number; // 当前棋子
    x: number;
    y: number;
    boardSize: BoardSizeType;
    seatIndex: number;
    direction?: number
}

const Card: React.FC<CardProps> = ({
                                       num,
                                       x, y,
                                       boardSize,
                                       seatIndex,
                                       direction = 0
                                   }) => {
    const nodeRef = useRef<Konva.Group>(null);
    const {cardWidth, cardHeight} = boardSize;


    const image = new Image();
    image.src = seatIndex !== 0 || (direction & 2) === 2 ? pai : cards[num];


    const xOffset = (Math.floor(seatIndex / 2) - 0.5) * 2;
    const yOffset = seatIndex === 0 || seatIndex === 3 ? -1 : 1;

    return (
        <Group
            ref={nodeRef}
            x={x}
            y={y}
        >
            <KImage
                image={image}
                width={cardWidth}
                height={cardHeight}
                rotation={direction === 1 ? 270 : 0}
                offsetX={direction === 1 ? cardHeight : 0}
                shadowColor="#000"
                shadowBlur={10}
                shadowOffset={{x: 10 * -1 * xOffset, y: 10 * -1 * yOffset}}
                shadowOpacity={0.5}
            />
        </Group>
    );
}

export default Card;
