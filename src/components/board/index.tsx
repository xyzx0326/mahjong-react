import {BoardSizeType} from "@/config/board";
import {GridData} from "@/stores/game";
import React, {useEffect} from 'react';
import {Group, Layer, Rect} from "react-konva";

type BoardProps = {
    boardSize: BoardSizeType;
    selectGrid: GridData | undefined;
    onGridSelect?: (data: GridData) => void;
}


const Board: React.FC<BoardProps> = ({boardSize, selectGrid, onGridSelect}) => {
    const {width, height, direction} = boardSize;

    // 棋盘线格
    useEffect(() => {
    }, [])

    const onClick = (data: GridData) => {
        onGridSelect && onGridSelect(data)
    }

    return (
        <Layer>
            <Rect
                width={width}
                height={height}
                fill='#22426c'
            />
            <Group x={width} y={height}>
            </Group>
        </Layer>
    );
}

export default Board;
