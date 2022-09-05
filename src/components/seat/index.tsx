import {Card} from "@/components";
import {boardScale, BoardSizeType} from "@/config/board";
import {Player} from "@/stores/game";
import React from "react";
import {Group, Layer} from "react-konva";

export type SeatProps = {
    player: Player
    board: number
    boardSize: BoardSizeType
}

const seat = (board: number, boardSize: BoardSizeType) => {
    const {boardEdge, cardHeight} = boardSize;
    let edge1 = board - cardHeight;
    let edge2 = board - boardEdge;
    let edge3 = cardHeight;
    return [
        {
            rotation: 0,
            xEdge: boardEdge,
            yEdge: edge1,
        },
        {
            rotation: 270,
            xEdge: edge1,
            yEdge: edge2,
        },
        {
            rotation: 180,
            xEdge: edge2,
            yEdge: edge3,
        },
        {
            rotation: 90,
            xEdge: edge3,
            yEdge: boardEdge,
        },
    ]
}


const Seat: React.FC<SeatProps> = ({player, board, boardSize}) => {
    const {cards, immovable} = player;
    const seatIndex = player.index;
    const scale = seatIndex === 0 ? 1 : 0.8
    const scaleBoard = boardScale(scale);
    const {cardWidth, cardHeight, boardEdge} = scaleBoard;
    const immovableBoard = boardScale(0.8);
    const immovableCard = immovableBoard;
    const {xEdge, yEdge, rotation} = seat(board, scaleBoard)[seatIndex]

    let immovableWeight = immovable.reduce((value: number, cards) => {
        return value + cards.reduce((value: number, card) => {
            const add = (card.direction === 1) ? immovableCard.cardHeight : immovableCard.cardWidth
            return value + add;
        }, 0)
    }, 0);

    const immovableCards = immovable.map((cards, index) => {
        return <Group y={cardHeight - immovableCard.cardHeight}>
            {cards.map((card, index) => {
                const ret = <Card key={index}
                                  num={card.num}
                                  x={board - immovableWeight - boardEdge}
                                  y={0}
                                  boardSize={immovableBoard}
                                  seatIndex={seatIndex}
                                  direction={card.direction}
                />;
                if (card.direction === 1) {
                    immovableWeight -= immovableCard.cardHeight
                } else {
                    immovableWeight -= immovableCard.cardWidth
                }
                return ret;
            })}
        </Group>;
    });
    return <Layer x={xEdge} y={yEdge} rotation={rotation}>
        <Group>
            {cards.map((card, index) => {
                return <Card key={index}
                             num={card.num}
                             x={index * cardWidth}
                             y={0}
                             boardSize={scaleBoard}
                             seatIndex={0}
                             direction={card.direction}
                />;
            })}
        </Group>
        <Group>
            {immovableCards}
        </Group>
    </Layer>
}


export default Seat;
