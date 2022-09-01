import white from '@/assets/card/s1.gif';
import {BoardSizeType} from "@/config/board";

import Konva from "konva";
import React, {useRef} from 'react';
import {Group, Image as KImage} from "react-konva";

type NavProps = {
    num: number; // 当前棋子
    index: number;
    boardSize: BoardSizeType;
}

const Piece: React.FC<NavProps> = ({
                                       num,
                                       index,
                                       boardSize,
                                   }) => {
    const nodeRef = useRef<Konva.Group>(null);
    const {cardWidth, cardHeight, direction} = boardSize;

    const x = (direction === 1 ? index : index % 7) * cardWidth;
    const y = direction === 1 || index < 7 ? cardHeight : (cardHeight * 2);

    const image = new Image();
    image.src = white;


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
                shadowColor="#000"
                shadowBlur={10}
                rotation={index === 13 ? 270 : 0}
                shadowOffset={{x: 4, y: 6}}
                shadowOpacity={0.5}
            />
        </Group>
    );
}

export default Piece;
