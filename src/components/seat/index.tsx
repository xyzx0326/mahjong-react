import {boardScale, BoardSizeType} from "@/config/board";
import {CardType, Player} from "@/stores/game";
import React, {useEffect, useMemo, useState} from "react";
import {Group, Layer, Rect, Text} from "react-konva";
import Card from "../card";

export type SeatProps = {
    player: Player
    maxPlayer: number
    lastOut?: CardType
    gameIsEnd: boolean
    contendIndex: number[]
    currentIndex: number
    selfIndex: number
    boardSize: BoardSizeType
    onCardSelect?: (card: number, seat: number) => void;
}

const seat = (board: number) => {
    return [
        {
            rotation: 0,
            xEdge: 0,
            yEdge: board,
        },
        {
            rotation: 270,
            xEdge: board,
            yEdge: board,
        },
        {
            rotation: 180,
            xEdge: board,
            yEdge: 0,
        },
        {
            rotation: 90,
            xEdge: 0,
            yEdge: 0,
        },
    ]
}


const Seat: React.FC<SeatProps> = ({
                                       player, maxPlayer,
                                       currentIndex,
                                       lastOut,
                                       gameIsEnd,
                                       contendIndex,
                                       selfIndex,
                                       boardSize,
                                       onCardSelect
                                   }) => {
    const {width, height, direction} = boardSize
    const [contend, setContend] = useState<boolean>(false)
    const board = direction === 1 ? height : width;
    const brandBoard = board / 3;
    const {cards, immovable, enter, outer} = player;
    const seatIndex = (player.index - selfIndex + maxPlayer) % maxPlayer;
    const vs = board / 14.5 / boardSize.cardWidth; // 纵向比例
    const number = 7;
    const ss = brandBoard / number / boardSize.cardWidth; // 其他比例
    const scale = seatIndex === 0 ? direction === 1 ? 1 : vs : ss
    const scaleBoard = boardScale(boardSize, scale);
    const {cardWidth, cardHeight, boardEdge} = scaleBoard;
    const immovableCard = boardScale(boardSize, ss);
    const outerCard = boardScale(boardSize, ss);
    const {xEdge, yEdge, rotation} = seat(board)[seatIndex]
    const seatInfo = ["东", "南", "西", "北"];
    let immovableOffset = useMemo(() => immovable.reduce((value: number, cards) => {
        return value + cards.reduce((value: number, card) => {
            const add = (card.direction && card.direction === 1) ? immovableCard.cardHeight : immovableCard.cardWidth
            return value + add;
        }, 0)
    }, 0), [immovable]);
    const isContend = contendIndex.length > 0 && contendIndex[0] === player.index;

    useEffect(() => {
        if (player.index !== selfIndex) {
            const timeout = setTimeout(() => {
                setContend(isContend)
            }, 10000);
            return () => {
                clearTimeout(timeout)
            }
        }
    }, [isContend])
    const finalContend = player.index === selfIndex ? isContend : contend;

    const immovableCards = immovable.map((cards, index) => {
        return <Group key={index} y={cardHeight - immovableCard.cardHeight}>
            {cards.map((card, index) => {
                const ret = <Card key={index}
                                  num={card.num}
                                  card={card.card}
                                  x={board - immovableOffset}
                                  y={-cardHeight}
                                  hide={card.direction !== undefined && (card.direction & 2) === 2}
                                  boardSize={immovableCard}
                                  seatIndex={seatIndex}
                                  direction={card.direction}
                />;
                if (card.direction && (card.direction & 1) === 1) {
                    immovableOffset -= immovableCard.cardHeight;
                } else {
                    immovableOffset -= immovableCard.cardWidth;
                }
                return ret;
            })}
        </Group>;
    });


    let outerOffset = 0;
    let cardXEdge = player.index === selfIndex && direction === 2 ? 0 : boardEdge;
    let cardYEdge = player.index === selfIndex && direction === 2 ? cardHeight * 1.4 : 0;

    let outerNew
    if (lastOut && currentIndex === player.index) {
        outerNew = [...outer, lastOut]
    } else {
        outerNew = outer
    }

    const outerCards = outerNew.map((card, index) => {
        if (index % number == 0) {
            outerOffset = 0;
        }
        const ret = <Card key={index}
                          num={card.num}
                          card={card.card}
                          x={brandBoard + outerOffset}
                          y={-brandBoard + (Math.floor(index / number)) * outerCard.cardHeight}
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


    const edgeScale = boardEdge / 15;
    return <Group x={xEdge} y={yEdge} rotation={rotation}>
        {gameIsEnd && player.isWin ?
            <Text text={"胜利"}
                  x={brandBoard + edgeScale}
                  y={-brandBoard - boardSize.cardHeight - edgeScale}
                  height={boardSize.cardHeight}
                  width={brandBoard}
                  verticalAlign={"middle"}
                  align={"center"}
                  fill="#fff"
                  fontSize={boardSize.cardHeight / 2}
            /> : null}
        <Rect
            fill="#000"
            opacity={0.5}
            x={brandBoard + edgeScale}
            y={-brandBoard - boardSize.cardHeight - edgeScale}
            height={boardSize.cardHeight}
            width={boardSize.cardHeight}
            cornerRadius={edgeScale}
        />
        <Rect
            x={brandBoard + edgeScale}
            y={-brandBoard - boardSize.cardHeight - edgeScale}
            height={boardSize.cardHeight}
            width={boardSize.cardHeight}
            stroke={finalContend ? "Red" : currentIndex === player.index ? "#7fb80e" : "#fff"}
            strokeWidth={edgeScale}
            lineJoin={"round"}
            lineCap={"round"}
            cornerRadius={edgeScale}
        />
        <Text text={seatInfo[player.index]}
              x={brandBoard + edgeScale}
              y={-brandBoard - boardSize.cardHeight - edgeScale}
              height={boardSize.cardHeight}
              width={boardSize.cardHeight}
              fill="#fff"
              verticalAlign={"middle"}
              align={"center"}
              fontSize={boardSize.cardHeight / 2}
        />
        <Group>
            {cards.map((card, index) => {
                return <Card key={index}
                             num={card.num}
                             card={card.card}
                             x={index * cardWidth + cardXEdge}
                             y={-cardHeight + cardYEdge}
                             hide={player.index !== selfIndex && !gameIsEnd}
                             boardSize={scaleBoard}
                             seatIndex={seatIndex}
                             onSelect={onSelect}
                             isSelect={card.card === player.select}
                             direction={card.direction}
                />;
            })}
            {enter ? <Card num={enter.num}
                           card={enter.card}
                           x={(cards.length + 0.5) * cardWidth + cardXEdge}
                           y={-cardHeight + cardYEdge}
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
    </Group>

}


export default Seat;
