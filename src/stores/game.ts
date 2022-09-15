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
}

export type GameFrameData = {
    lastOut: CardType | undefined
    cards: number[]
    cardIndex: number
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
        // 摸一张
        touchCard(state) {
            if (!state.lastOut && state.contendIndex.length === 0) {
                const currentLib = cardLib[state.rule.cardLib];
                state.currentIndex = (state.currentIndex + 1) % state.rule.maxPlayer
                const current = state.players[(state.rule.maxPlayer + state.currentIndex - 1) % state.rule.maxPlayer]
                const player = state.players[state.currentIndex];
                if (current.enter) {
                    current.cards.push(current.enter)
                    current.enter = undefined
                }
                const cardIndex = state.cards[state.cardIndex];
                player.enter = {
                    num: currentLib[cardIndex],
                    card: cardIndex
                }
                state.cardIndex++
            }
        },
        // 重开游戏
        handleRestart(state) {
            state.gameIsEnd = false;
            state.cardIndex = 0;
            state.currentIndex = -1;
            state.contendIndex = []
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

        dealCard(state, {payload}) {
            const current = state.players[state.currentIndex]
            const player = state.players[payload.seat];
            if (current.enter) {
                current.cards.push(current.enter)
                current.cards.sort((a, b) => {
                    return a.num - b.num
                })
                current.enter = undefined
            }
            player.enter = {
                num: cardLib[state.rule.cardLib][payload.index],
                card: payload.index
            }
            state.currentIndex = payload.seat
        },

        // 出牌
        updateOutCard(state, {payload}) {
            const card = payload;
            const player = state.players[state.currentIndex]
            if (player.enter && player.enter?.card === card) {
                player.outer.push(player.enter)
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
            let t = -1
            for (let i = 0; i < state.players.length; i++) {
                if (i === state.currentIndex) {
                    continue;
                }
                const pi = state.players[i];
                if (pi.strategy.find(v => v.type === 'quadruple' && v.card === state.lastOut?.num)) {
                    state.contendIndex.push(i)
                    break;
                }
                if (pi.strategy.find(v => v.type === 'triplet' && v.card === state.lastOut?.num)) {
                    t = i;
                    break;
                }
            }
            if (t != -1) {
                state.contendIndex.push(t)
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
    dealCard,
    updateSelfIndex,
    updateOutCard,
    updateContend,
    handleSelectCard,
} = gameSlice.actions

export default gameSlice.reducer

export const startRound = (cards: number[]) => (d: Dispatch) => {
    d(updateCards(cards))
    for (let i = 0; i < 53; i++) {
        d(touchCard())
    }
    d(updateStrategy())
}

export const handleOutCard = (card: number) => (d: Dispatch) => {
    d(updateOutCard(card))
    d(updateContend())
    d(touchCard())
}
