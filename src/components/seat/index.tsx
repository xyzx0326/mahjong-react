import {boardScale, BoardSizeType} from "@/config/board";
import {Player} from "@/stores/game";
import React, {useMemo} from "react";
import {Group, Layer, Rect, Text} from "react-konva";
import Card from "../card";

export type SeatProps = {
    player: Player
    maxPlayer: number
    currentIndex: number
    selfIndex: number
    boardSize: BoardSizeType
    onCardSelect?: (card: number, seat: number) => void;
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


const Seat: React.FC<SeatProps> = ({player, maxPlayer, currentIndex, selfIndex, boardSize, onCardSelect}) => {
    const {width, height, direction} = boardSize
    const board = direction === 1 ? height : width;
    const brandBoard = board / 3;
    const {cards, immovable, enter, outer} = player;
    const seatIndex = (player.index - selfIndex + maxPlayer) % maxPlayer;
    const scale = seatIndex === 0 ? 1 : 0.8
    const scaleBoard = boardScale(boardSize, scale);
    const {cardWidth, cardHeight, boardEdge} = scaleBoard;
    const immovableCard = boardScale(boardSize, 0.8);
    const outerCard = boardScale(boardSize, 0.9);
    const {xEdge, yEdge, rotation} = seat(board, scaleBoard)[seatIndex]
    const seatInfo = ["东", "南", "西", "北"];
    let immovableOffset = useMemo(() => immovable.reduce((value: number, cards) => {
        return value + cards.reduce((value: number, card) => {
            const add = (card.direction === 1) ? immovableCard.cardHeight : immovableCard.cardWidth
            return value + add;
        }, 0)
    }, 0), [immovable]);

    const immovableCards = immovable.map((cards) => {
        return <Group y={cardHeight - immovableCard.cardHeight}>
            {cards.map((card, index) => {
                const ret = <Card key={index}
                                  num={card.num}
                                  card={card.card}
                                  x={board - immovableOffset - boardEdge}
                                  y={0}
                                  hide={card.direction !== undefined && (card.direction & 2) === 2}
                                  boardSize={immovableCard}
                                  seatIndex={seatIndex}
                                  direction={card.direction}
                />;
                if (card.direction && (card.direction & 1) === 1) {
                    immovableOffset -= immovableCard.cardHeight
                } else {
                    immovableOffset -= immovableCard.cardWidth
                }
                return ret;
            })}
        </Group>;
    });

    let outerOffset = 0;

    const outerCards = outer.map((card, index) => {
        if (index % 6 == 0) {
            outerOffset = 0;
        }
        const ret = <Card key={index}
                          num={card.num}
                          card={card.card}
                          x={brandBoard - boardEdge + outerOffset}
                          y={-brandBoard + cardHeight + (Math.floor(index / 6)) * outerCard.cardHeight}
                          boardSize={outerCard}
                          seatIndex={seatIndex}
                          direction={card.direction}
        />;
        if (card.direction && (card.direction & 1) === 1) {
            outerOffset += outerCard.cardHeight;
        } else {
            outerOffset += outerCard.cardWidth;
        }
        return ret;
    });

    const onSelect = (card: number) => {
        onCardSelect && onCardSelect(card, player.index);
    }

    return <Layer x={xEdge} y={yEdge} rotation={rotation}>
        <Rect
            fill="#000"
            opacity={0.5}
            x={brandBoard - boardEdge + boardEdge / 40}
            y={-brandBoard + cardHeight - boardSize.cardHeight * 9 / 10 - boardEdge / 40}
            height={boardSize.cardHeight * 9 / 10}
            width={boardSize.cardHeight * 9 / 10}
            cornerRadius={boardEdge / 20}
        />
        <Rect
            x={brandBoard - boardEdge + boardEdge / 40}
            y={-brandBoard + cardHeight - boardSize.cardHeight * 9 / 10 - boardEdge / 40}
            height={boardSize.cardHeight * 9 / 10}
            width={boardSize.cardHeight * 9 / 10}
            stroke={currentIndex === player.index ? "lightgreen" : "#fff"}
            strokeWidth={boardEdge / 40}
            cornerRadius={boardEdge / 20}
        />
        <Text text={seatInfo[player.index]}
              x={brandBoard - boardEdge + boardSize.cardHeight / 5 + boardEdge / 40}
              y={-brandBoard + cardHeight - boardSize.cardHeight / 2 - boardSize.cardHeight / 6 - boardEdge / 40}
              fill="#fff"
              fontSize={boardSize.cardHeight / 2}
        />
        <Group>
            {cards.map((card, index) => {
                return <Card key={index}
                             num={card.num}
                             card={card.card}
                             x={index * cardWidth}
                             y={0}
                             hide={player.index !== selfIndex}
                             boardSize={scaleBoard}
                             seatIndex={seatIndex}
                             onSelect={onSelect}
                             isSelect={card.card === player.select}
                             direction={card.direction}
                />;
            })}
            {enter ? <Card num={enter.num}
                           card={enter.card}
                           x={(cards.length + 0.5) * cardWidth}
                           y={0}
                           hide={player.index !== selfIndex}
                           boardSize={scaleBoard}
                           seatIndex={seatIndex}
                           onSelect={onSelect}
                           isSelect={enter.card === player.select}
                           direction={enter.direction}
            /> : null}
        </Group>
        <Group>
            {immovableCards}
        </Group>
        <Group>
            {outerCards}
        </Group>
    </Layer>

}


export default Seat;
