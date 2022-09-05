import pai from '@/assets/card/pai.gif';
import {BoardSizeType} from "@/config/board";
import cards, {cardLib} from "@/config/card";

import Konva from "konva";
import React, {useRef} from 'react';
import {Group, Image as KImage} from "react-konva";

type CardProps = {
    num: number;
    card: number;
    x: number;
    y: number;
    boardSize: BoardSizeType;
    seatIndex: number;
    direction?: number;
    isSelect?: boolean;
    onSelect?: (num: number) => void;
}

const Card: React.FC<CardProps> = ({
                                       num,
                                       card,
                                       x, y,
                                       boardSize,
                                       seatIndex,
                                       direction = 0,
                                       isSelect,
                                       onSelect
                                   }) => {
    const nodeRef = useRef<Konva.Group>(null);
    const {cardWidth, cardHeight} = boardSize;


    const image = new Image();
    image.src = seatIndex !== 0 || (direction & 2) === 2 ? pai : cards[card];


    const xOffset = (Math.floor(seatIndex / 2) - 0.5) * 2;
    const yOffset = seatIndex === 0 || seatIndex === 3 ? -1 : 1;

    return (
        <Group
            ref={nodeRef}
            x={x}
            y={isSelect ? (y - 0.4 * cardWidth) : y}
            onClick={() => onSelect && onSelect(num)}
            onTap={() => onSelect && onSelect(num)}
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
