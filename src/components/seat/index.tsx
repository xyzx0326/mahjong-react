import {boardScale, BoardSizeType} from "@/config/board";
import {Player} from "@/stores/game";
import React, {useMemo} from "react";
import {Group, Layer} from "react-konva";
import Card from "../card";

export type SeatProps = {
    player: Player
    boardSize: BoardSizeType
    onCardSelect?: (index: number) => void;
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


const Seat: React.FC<SeatProps> = ({player, boardSize, onCardSelect}) => {
    const {width, height, direction} = boardSize
    const board = direction === 1 ? height : width;
    const {cards, immovable, enter} = player;
    const seatIndex = player.index;
    const scale = seatIndex === 0 ? 1 : 0.8
    const scaleBoard = boardScale(boardSize, scale);
    const {cardWidth, cardHeight, boardEdge} = scaleBoard;
    const immovableBoard = boardScale(boardSize, 0.8);
    const immovableCard = immovableBoard;
    const {xEdge, yEdge, rotation} = seat(board, scaleBoard)[seatIndex]

    let immovableWeight = useMemo(() => immovable.reduce((value: number, cards) => {
        return value + cards.reduce((value: number, card) => {
            const add = (card.direction === 1) ? immovableCard.cardHeight : immovableCard.cardWidth
            return value + add;
        }, 0)
    }, 0), [immovable]);

    const immovableCards = immovable.map((cards, index) => {
        return <Group y={cardHeight - immovableCard.cardHeight}>
            {cards.map((card, index) => {
                const ret = <Card key={index}
                                  num={card.num}
                                  card={card.card}
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
                             card={card.card}
                             x={index * cardWidth}
                             y={0}
                             boardSize={scaleBoard}
                             seatIndex={seatIndex}
                             onSelect={onCardSelect}
                             isSelect={index === player.select}
                             direction={card.direction}
                />;
            })}
            {
                enter ? <Card num={enter.num}
                              card={enter.card}
                              x={(cards.length + 0.5) * cardWidth}
                              y={0}
                              boardSize={scaleBoard}
                              seatIndex={seatIndex}
                              onSelect={onCardSelect}
                              isSelect={cards.length === player.select}
                              direction={enter.direction}
                /> : null
            }
        </Group>
        <Group>
            {immovableCards}
        </Group>
    </Layer>
}


export default Seat;
