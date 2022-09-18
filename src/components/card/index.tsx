import {BoardSizeType} from "@/config/board";
import cards from "@/config/card";

import Konva from "konva";
import React, {useRef} from 'react';
import {Group, Image as KImage} from "react-konva";

type CardProps = {
    num: number;
    card: number;
    x: number;
    y: number;
    hide?: boolean;
    boardSize: BoardSizeType;
    seatIndex?: number;
    direction?: number;
    isSelect?: boolean;
    onSelect?: (num: number) => void;
}

const Card: React.FC<CardProps> = ({
                                       num,
                                       card,
                                       x, y,
                                       boardSize,
                                       seatIndex = 0,
                                       hide,
                                       direction = 0,
                                       isSelect,
                                       onSelect
                                   }) => {
    const nodeRef = useRef<Konva.Group>(null);
    const {cardWidth, cardHeight} = boardSize;

    const xOffset = (Math.floor(seatIndex / 2) - 0.5) * 2;
    const yOffset = seatIndex === 0 || seatIndex === 3 ? -1 : 1;

    return (
        <Group
            ref={nodeRef}
            x={x}
            y={isSelect ? (y - 0.4 * cardWidth) : y}
            onClick={() => onSelect && onSelect(card)}
            onTap={() => onSelect && onSelect(card)}
        >
            <KImage
                image={cards[hide ? 44 : num]}
                width={cardWidth}
                height={cardHeight}
                rotation={direction === 1 ? 270 : 0}
                offsetX={direction === 1 ? cardHeight : 0}
                shadowColor="#000"
                shadowBlur={10}
                shadowOffset={{x: cardWidth / 5 * -1 * xOffset, y: cardWidth / 5 * -1 * yOffset}}
                shadowOpacity={0.5}
            />
        </Group>
    );
}

export default Card;
