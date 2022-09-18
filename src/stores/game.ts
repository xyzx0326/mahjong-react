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
    pairs?: number[];
    extra?: string
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
        updateColl(state) {
            state.players[1].cards = [{num: 1, card: 1}, {num: 9, card: 2},
                {num: 11, card: 3}, {num: 19, card: 4},
                {num: 21, card: 5}, {num: 29, card: 6},
                {num: 31, card: 7}, {num: 33, card: 8},
                {num: 35, card: 10}, {num: 37, card: 9},
                {num: 39, card: 12}, {num: 41, card: 13}, {num: 43, card: 14}]
        },
        // 更新策略
        updateStrategy(state) {
            for (let i = 0; i < state.players.length; i++) {
                let player = JSON.parse(JSON.stringify(state.players[i])) as Player;
                let len = player.cards.length + 2
                if (player.enter) {
                    len = len + 1;
                }
                if (player.select) {
                    len = len - 1;
                }
                // 可以算牌的情况
                if (len % 3 === 0) {
                    if (player.enter) {
                        player.cards.push(player.enter);
                    }
                    if (player.select) {
                        player.cards = player.cards.filter(v => v.card !== player.select)
                    }
                }
                player.cards.sort((a, b) => a.num - b.num)
                let strategy: Strategy[] = []
                for (let key in winRules) {
                    strategy = [...strategy, ...winRules[key as keyof typeof winRules](player)]
                }
                state.players[i].strategy = strategy
            }
            // console.log(JSON.parse(JSON.stringify(state.players)))
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
                if (pi.strategy.find(v => v.type === 'quadruple' && !v.extra && v.card === state.lastOut?.num)) {
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
                const has = player.cards.filter(v => v.num === player.enter!.num);
                player.cards = player.cards.filter(v => v.num !== player.enter!.num);
                player.immovable.push([state.lastOut!, ...has])
                player.enter = undefined;
            } else if (type === 'other') {
                const has = player.cards.filter(v => v.num === state.lastOut!.num);
                player.cards = player.cards.filter(v => v.num !== state.lastOut!.num);
                player.immovable.push([state.lastOut!, ...has])
                state.lastOut = undefined
            } else if (type === "add") {
                let find = player.immovable.find(v => v[0].num === player.enter!.num);
                find!.push(player.enter!)
                player.enter = undefined;
            }
            state.contendIndex = []
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
            const has = [];
            for (let i = 0; i < pairs.length; i++) {
                let item = player.cards.find(v => pairs[i] === v.num);
                if (item) {
                    has.push(item);
                    player.cards = player.cards.filter(v => v.card !== item!.card);
                }
            }
            const newVar = [state.lastOut!, ...has].sort((a, b) => a.num - b.num);
            player.immovable.push(newVar)
            state.lastOut = undefined
            state.contendIndex = []
            state.currentIndex = index
        },
        updateNoContend(state, {payload}) {
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
                player.cards.push(player.enter!)
                player.enter = undefined;
            } else {
                player.cards.push(state.lastOut!)
                state.lastOut = undefined
            }
            player.cards.sort((a, b) => a.card - b.card)
        },

        updateSelectCard(state, {payload}) {
            const {card, seat} = payload;
            const self = state.players[seat]
            if (self.select === card) {
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
    updateSelectCard,
    updateQuadruple,
    handleTriplet,
    handleStraight,
    updateNoContend,
    handleWin,
    updateColl
} = gameSlice.actions

export default gameSlice.reducer

export const startRound = (cards: number[]) => (d: Dispatch) => {
    d(updateCards(cards))
    for (let i = 0; i < 53; i++) {
        d(touchCard(true))
    }
    d(updateColl())
    d(updateStrategy())
}

export const handleOutCard = (card: number) => (d: Dispatch) => {
    d(updateOutCard(card))
    d(updateContend())
    d(touchCard(true))
    d(updateStrategy())
}

export const handleNoContend = (info: any) => (d: Dispatch) => {
    d(updateNoContend(info))
    d(touchCard(true))
    d(updateStrategy())
}

export const handleQuadruple = (info: any) => (d: Dispatch) => {
    d(updateQuadruple(info))
    d(touchCard(false))
    d(updateStrategy())
}

export const handleSelectCard = (info: any) => (d: Dispatch) => {
    d(updateSelectCard(info))
    d(updateStrategy())
}