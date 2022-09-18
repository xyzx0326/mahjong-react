import white from "@/assets/test2.gif";
import {BoardSizeType} from "@/config/board";
import "gifler";
import React, {useEffect} from 'react';

import {Group, Rect} from "react-konva";

type BoardProps = {
    boardSize: BoardSizeType;
}


const Board: React.FC<BoardProps> = ({boardSize}) => {
    const {width, height, direction} = boardSize;
    // const imageRef = React.useRef<Konva.Image>(null);
    // const canvas = React.useMemo(() => {
    //     const node = document.createElement("canvas");
    //     return node;
    // }, []);
    const image = new Image();
    image.src = white;

    // React.useEffect(() => {
    //     // save animation instance to stop it on unmount
    //     let anim: any;
    //     window.gifler(white).get((a: any) => {
    //         anim = a;
    //         anim.animateInCanvas(canvas);
    //         anim.onDrawFrame = (ctx: any, frame: any) => {
    //             ctx.drawImage(frame.buffer, frame.x, frame.y);
    //             imageRef.current?.getLayer()?.draw();
    //         };
    //     });
    //     return () => anim.stop();
    // }, [white, canvas]);

    const board = direction === 1 ? height : width;

    // 棋盘线格
    useEffect(() => {
    }, [])

    return (
        <Group>
            <Rect
                width={board}
                height={board}
                fill='#4e72b8'
                cornerRadius={boardSize.boardEdge / 10}
            />
            {direction === 1 ?
                <Rect
                    x={board + 1}
                    width={width - height - 1}
                    height={height}
                    fill={"#faa755"}
                    cornerRadius={boardSize.boardEdge / 10}
                /> :
                <Rect
                    y={board + 1}
                    width={width}
                    height={height - width - 1}
                    fill={"#faa755"}
                    cornerRadius={boardSize.boardEdge / 10}
                />}
            {/*<KImage ref={imageRef}*/}
            {/*        image={canvas}*/}
            {/*        y={width / 6}*/}
            {/*        width={board}*/}
            {/*        height={width / 3 * 2}/>*/}
            <Group x={board} y={board}>
            </Group>
        </Group>
    );
}

export default Board;
