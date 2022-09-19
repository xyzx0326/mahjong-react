import {boardScale, BoardSizeType} from "@/config/board";
import {CardType, Player} from "@/stores/game";

import React, {useMemo} from 'react';
import {Group, Layer, Rect, Stage, Text} from "react-konva";

import Board from "../board";
import Brand from "../brand";
import Operate from "../operate";
import Seat from "../seat";
import Card from "../card";

type GameProps = {
    players: Player[]
    leftCount: number
    currentIndex: number
    contendIndex: number[]
    selfIndex: number
    boardSize: BoardSizeType
    lastOut?: CardType
    ops?: any[]
    gameIsEnd: boolean

    onCardSelect?: (card: number, seat: number) => void;
}

const Game: React.FC<GameProps> = ({
                                       players,
                                       currentIndex,
                                       contendIndex,
                                       selfIndex,
                                       boardSize,
                                       gameIsEnd,
                                       leftCount,
                                       onCardSelect,
                                       lastOut,
                                       ops
                                   }) => {
    const {width, height, direction, boardEdge} = boardSize
    const board = direction === 1 ? height : width;
    const opWidth = board - boardSize.boardEdge * 2;
    const brandBoard = board / 3;
    const number = 7.5;
    const ss = brandBoard / number / boardSize.cardWidth; // 其他比例
    const scaleCard = boardScale(boardSize, ss);

    let opOffset = 0;

    const player = players[selfIndex]

    function getOuterMap() {
        let outers: CardType[] = [...player.cards]
        for (let i = 0; i < players.length; i++) {
            outers = [...outers, ...players[i].outer]
        }
        if (player.enter) {
            outers.push(player.enter)
        }
        for (let i = 0; i < player.immovable.length; i++) {
            outers = [...outers, ...player.immovable[i]]
        }

        const cards = outers.map(v => v.num);
        const outerMap: any = {}
        for (let i = 0; i < cards.length; i++) {
            if (!outerMap[cards[i]]) {
                outerMap[cards[i]] = 0;
            }
            outerMap[cards[i]]++
        }
        return outerMap;
    }

    const outerMap = useMemo(() => getOuterMap(), [players]);

    const winStrategy = player.strategy.filter(v => v.type === 'win');
    const select = player.select && winStrategy.length > 0;

    let showWidth = scaleCard.cardHeight * 0.2 + scaleCard.cardHeight * winStrategy.length;

    return (
        <Stage width={width} height={height}>
            <Layer>
                <Board boardSize={boardSize}/>
                <Brand leftCount={leftCount} boardSize={boardSize} gameIsEnd={gameIsEnd}/>
                <Group>
                    {players.map((player, index) => {
                        return <Seat currentIndex={currentIndex}
                                     gameIsEnd={gameIsEnd}
                                     contendIndex={contendIndex} lastOut={lastOut}
                                     selfIndex={selfIndex} maxPlayer={players.length}
                                     key={index} player={player} boardSize={boardSize}
                                     onCardSelect={onCardSelect}/>
                    })}
                </Group>
                <Group
                    x={boardEdge}
                    y={board - boardSize.cardHeight * 2}
                    height={boardSize.cardWidth}
                    width={opWidth}
                >
                    {select ?
                        <Group
                            height={boardSize.cardHeight}
                            y={-boardSize.cardHeight}
                            width={opWidth}
                            fill={"#fff"}
                        >
                            <Rect width={showWidth} height={scaleCard.cardHeight * 1.8} fill={"#000"}
                                  opacity={0.5}
                                  cornerRadius={board / 100}
                                  shadowColor="#000"
                                  shadowBlur={10}
                                  shadowOffset={{x: boardSize.cardWidth / 10, y: boardSize.cardWidth / 10}}
                                  shadowOpacity={0.5}
                            />
                            {winStrategy.map((v, index) => {
                                    showWidth = showWidth + scaleCard.cardWidth
                                    return <Group key={index} y={scaleCard.cardHeight * 0.2}
                                                  x={scaleCard.cardWidth * 0.3 + scaleCard.cardHeight * index}>
                                        <Card num={v.card} card={0} x={0} y={0}
                                              boardSize={scaleCard}/>
                                        <Text y={scaleCard.cardHeight * 1.2}
                                              height={scaleCard.cardHeight * 0.2}
                                              verticalAlign={"middle"}
                                              fill={"#fff"} width={scaleCard.cardWidth}
                                              align={"center"}
                                              fontSize={scaleCard.cardHeight * 0.3}
                                              text={`余${4 - (outerMap[v.card] ? outerMap[v.card] : 0)}`}/>
                                    </Group>
                                }
                            )}
                        </Group> : null
                    }
                    {ops?.map((op: any, index) => <Operate key={index} text={op.text} op={op.op}
                                                           pairs={op.pairs}
                                                           x={opOffset++ * boardSize.cardHeight * 2}
                                                           boardSize={boardSize}/>)}
                </Group>
            </Layer>
        </Stage>
    );
}

export default Game;
