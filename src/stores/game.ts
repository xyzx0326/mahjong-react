import {cardLib} from "@/config/card";
import {defaultRule, Rule, winRules} from "@/config/rules";
import {CACHE_RULE_KEY, CacheUtils} from "@/utils";
import {createSlice, Dispatch} from '@reduxjs/toolkit'

export type CardType = { num: number; card: number, direction?: number; };

export type Player = {
    index: number;
    score: number;
    cards: CardType[];
    strategy: Strategy[];

    outer: CardType[];
    immovable: CardType[][];
    select?: number;
    isWin?: boolean;
    isRound?: boolean;
    enter?: CardType;
}

export type Strategy = {
    card: number;
    type: string;
    pairs?: number[]
}

export type GameFrameData = {
    lastOut: CardType | undefined
    cards: number[]
    cardIndex: number
    cardEndIndex: number
    contendIndex: number[]
    players: Player[]
    currentIndex: number
    selfIndex: number
    gameIsEnd?: boolean// 游戏是否结束
    rule: Rule
};

const basePlayer = (index: number) => {
    return {
        index: index,
        cards: [],
        outer: [],
        immovable: [],

        isWin: false,
        score: 25000,

        strategy: [],
    }
}

const cacheRule = CacheUtils.getItem(CACHE_RULE_KEY, defaultRule);

const initialState = {
    currentIndex: -1,
    contendIndex: [],

    lastOut: undefined,
    cards: [],
    cardIndex: 0,
    cardEndIndex: 135,
    selfIndex: 1,
    players: [basePlayer(0), basePlayer(1), basePlayer(2), basePlayer(3)],
    gameIsEnd: false,

    rule: cacheRule, //规则
} as GameFrameData


export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        // 更新牌山
        updateCards(state, {payload}) {
            state.cards = payload;
        },
        // 更新策略
        updateStrategy(state) {
            const start = new Date().getTime();
            for (let i = 0; i < state.players.length; i++) {
                const player = state.players[i];
                player.cards.sort((a, b) => a.num - b.num)
                player.strategy = [...winRules.win(player), ...winRules.quadruple(player), ...winRules.triplet(player), ...winRules.straight(player)]
            }
            const end = new Date().getTime();
            console.log("time" + (end - start), end)
        },
        // 摸一张 true从头 false从尾
        touchCard(state, {payload}) {
            // 没牌了, 游戏结束
            if (state.cardIndex === state.cardEndIndex) {
                state.gameIsEnd = true
                return
            }
            if (!state.lastOut && state.contendIndex.length === 0) {
                const currentLib = cardLib[state.rule.cardLib];
                state.currentIndex = (state.currentIndex + 1) % state.rule.maxPlayer
                const current = state.players[(state.rule.maxPlayer + state.currentIndex - 1) % state.rule.maxPlayer]
                const player = state.players[state.currentIndex];
                if (current.enter) {
                    current.cards.push(current.enter)
                    current.enter = undefined
                }
                if (payload) {
                    const cardIndex = state.cards[state.cardIndex];
                    player.enter = {
                        num: currentLib[cardIndex],
                        card: cardIndex
                    }
                    state.cardIndex++
                } else {
                    const cardEndIndex = state.cards[state.cardEndIndex];
                    player.enter = {
                        num: currentLib[cardEndIndex],
                        card: cardEndIndex
                    }
                    state.cardEndIndex--
                }
            }
        },
        // 重开游戏
        handleRestart(state) {
            state.gameIsEnd = false;
            state.cardIndex = 0;
            state.cardEndIndex = 135;
            state.currentIndex = -1;
            state.contendIndex = [];
            state.lastOut = undefined;
            state.players = [basePlayer(0), basePlayer(1), basePlayer(2), basePlayer(3)];
        },
        // 更新位置
        updateSelfIndex(state, {payload}) {
            state.selfIndex = payload;
        },
        // 更新规则
        updateRule(state, {payload}) {
            state.rule = payload
            CacheUtils.setItem(CACHE_RULE_KEY, state.rule)
        },

        // 出牌
        updateOutCard(state, {payload}) {
            const card = payload;
            const player = state.players[state.currentIndex]
            if (player.enter && player.enter?.card === card) {
                state.lastOut = player.enter
                player.enter = undefined;
            } else {
                state.lastOut = player.cards.filter(v => v.card === card)[0];
                player.cards = player.cards.filter(v => v.card !== card);
                if (player.enter) {
                    player.cards.push(player.enter);
                    player.enter = undefined;
                }
                player.cards.sort((a, b) => a.num - b.num)
            }
            player.select = undefined;
        },

        updateContend(state) {
            for (let i = 0; i < state.players.length; i++) {
                if (i === state.currentIndex) {
                    continue;
                }
                const pi = state.players[i];
                if (pi.strategy.find(v => v.type === 'win' && v.card === state.lastOut?.num)) {
                    state.contendIndex.push(i)
                    break;
                }
            }
            for (let i = 0; i < state.players.length; i++) {
                if (i === state.currentIndex) {
                    continue;
                }
                const pi = state.players[i];
                if (pi.strategy.find(v => v.type === 'quadruple' && v.card === state.lastOut?.num)) {
                    state.contendIndex.push(i)
                    break;
                }
            }
            for (let i = 0; i < state.players.length; i++) {
                if (i === state.currentIndex) {
                    continue;
                }
                const pi = state.players[i];
                if (pi.strategy.find(v => v.type === 'triplet' && v.card === state.lastOut?.num)) {
                    state.contendIndex.push(i)
                    break;
                }
            }
            const next = state.players[(state.currentIndex + 1) % 4];
            if (next.strategy.find(v => v.type === 'straight' && v.card === state.lastOut?.num)) {
                state.contendIndex.push((state.currentIndex + 1) % state.rule.maxPlayer);
            }
            if (state.contendIndex.length === 0 && state.lastOut) {
                state.players[state.currentIndex].outer.push(state.lastOut);
                state.lastOut = undefined
            }
        },

        updateQuadruple(state, {payload}) {
            const index = payload.index;
            const type = payload.type;
            const player = state.players[index];
            if (type === 'self') {

            } else {
                const has = player.cards.filter(v => v.num === state.lastOut!.num);
                player.cards = player.cards.filter(v => v.num !== state.lastOut!.num);
                player.immovable.push([state.lastOut!, ...has])
                state.lastOut = undefined
                state.contendIndex = []
            }
            state.currentIndex = index - 1
        },

        handleTriplet(state, {payload}) {
            const index = payload.index;
            const player = state.players[index];
            const has = player.cards.filter(v => v.num === state.lastOut!.num);
            player.cards = player.cards.filter(v => v.num !== state.lastOut!.num);
            const newVar = [state.lastOut!];
            let i = 0
            for (; i < 2; i++) {
                newVar.push(has[i])
            }
            for (; i < has.length; i++) {
                player.cards.push(has[i])
            }
            player.cards.sort((a, b) => a.card - b.card)
            player.immovable.push(newVar)
            state.contendIndex = []
            state.lastOut = undefined
            state.currentIndex = index
        },

        handleStraight(state, {payload}) {
            const index = payload.index;
            const player = state.players[index];
            const pairs = payload.pairs;

            const has = player.cards.filter(v => pairs.indexOf(v.num) !== -1);
            player.cards = player.cards.filter(v => pairs.indexOf(v.num) === -1);
            const newVar = [state.lastOut!, ...has].sort((a, b) => a.num - b.num);
            player.immovable.push(newVar)
            state.lastOut = undefined
            state.contendIndex = []
            state.currentIndex = index
        },
        updateNoContend(state, {payload}) {
            // const index = payload.index;
            // const player = state.players[index];
            state.contendIndex.splice(0, 1)
            if (state.contendIndex.length === 0) {
                state.players[state.currentIndex].outer.push(state.lastOut!)
                state.lastOut = undefined
            }
        },

        handleWin(state, {payload}) {
            state.gameIsEnd = true
            const index = payload.index;
            const type = payload.type;
            const player = state.players[index];
            player.isWin = true
            if (type === "self") {
                console.log("自摸了")
                player.cards.push(player.enter!)
                player.enter = undefined;
            } else {
                console.log("和了")
                player.cards.push(state.lastOut!)
                state.lastOut = undefined
            }
            player.cards.sort((a, b) => a.card - b.card)
        },

        handleSelectCard(state, {payload}) {
            const {card, seat} = payload;
            const self = state.players[seat]
            if (self.select) {
                self.select = undefined;
            } else {
                self.select = card
            }
        }
    },
})

export const {
    updateCards,
    updateStrategy,
    touchCard,
    handleRestart,
    updateRule,
    updateSelfIndex,
    updateOutCard,
    updateContend,
    handleSelectCard,
    updateQuadruple,
    handleTriplet,
    handleStraight,
    updateNoContend,
    handleWin
} = gameSlice.actions

export default gameSlice.reducer

export const startRound = (cards: number[]) => (d: Dispatch) => {
    d(updateCards(cards))
    for (let i = 0; i < 53; i++) {
        d(touchCard(true))
    }
    d(updateStrategy())
}

export const handleOutCard = (card: number) => (d: Dispatch) => {
    d(updateOutCard(card))
    d(updateContend())
    d(touchCard(true))
}

export const handleNoContend = (info: any) => (d: Dispatch) => {
    d(updateNoContend(info))
    d(touchCard(true))
}

export const handleQuadruple = (info: any) => (d: Dispatch) => {
    d(updateQuadruple(info))
    d(touchCard(false))
}
