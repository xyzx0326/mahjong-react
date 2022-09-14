import {cardLib} from "@/config/card";
import {defaultRule, Rule, winRules} from "@/config/rules";
import {CACHE_RULE_KEY, CacheUtils} from "@/utils";
import {createSlice, Dispatch} from '@reduxjs/toolkit'

export type CardType = { num: number; card: number, direction?: number; };

export type Player = {
    index: number;
    score: number;
    cards: CardType[];
    win: WinStrategy[];
    quadruple: QuadrupleStrategy[];
    triplet: TripletStrategy[];
    straight: StraightStrategy[];

    outer: CardType[];
    immovable: CardType[][];
    select?: number;
    isWin?: boolean;
    isRound?: boolean;
    enter?: CardType;
}

export type WinStrategy = {
    win: number;
    pairs: number;
}

export type QuadrupleStrategy = {
    quadruple: number;
}

export type TripletStrategy = {
    triplet: number;
}

export type StraightStrategy = {
    straight: number;
}

export type GameFrameData = {
    steps: number // 步数
    cards: number[]
    cardIndex: number
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

        win: [],
        quadruple: [],
        triplet: [],
        straight: [],
    }
}

const cacheRule = CacheUtils.getItem(CACHE_RULE_KEY, defaultRule);

const initialState = {
    steps: 0,
    currentIndex: -1,
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
        updateCards(state, {payload}) {
            state.cards = payload;
        },
        updateStrategy(state) {
            for (let i = 0; i < state.players.length; i++) {
                const player = state.players[i];
                player.cards.sort((a, b) => a.num - b.num)
                player.win = [...winRules.win(player)]
                player.quadruple = winRules.quadruple(player)
                player.triplet = winRules.triplet(player)
                player.straight = winRules.straight(player)
                console.log({...player})
            }
        },
        touchCard(state) {
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
        },
        /**
         * 重开游戏
         */
        handleRestart(state) {
            state.gameIsEnd = false;
            state.steps = 0;
            state.currentIndex = -1;
            state.players = [basePlayer(0), basePlayer(1), basePlayer(2), basePlayer(3)];
        },

        updateSelfIndex(state, {payload}) {
            state.selfIndex = payload;
        },

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

        handleOutCard(state, {payload}) {
            const {card, seat} = payload;
            const player = state.players[seat]
            // 是当前操作人
            if (seat === state.currentIndex) {
                let select: CardType;
                if (player.enter && player.enter?.card === card) {
                    player.outer.push(player.enter)
                    select = player.enter
                    player.enter = undefined;
                } else {
                    select = player.cards.filter(v => v.card === card)[0];
                    player.outer.push(select)
                    player.cards = player.cards.filter(v => v.card !== card);
                    if (player.enter) {
                        player.cards.push(player.enter);
                        player.enter = undefined;
                    }
                    player.cards.sort((a, b) => a.num - b.num)
                }
                let q = -1
                let t = -1
                let s = -1
                for (let i = 0; i < state.players.length; i++) {
                    if (i === seat) {
                        continue;
                    }
                    const pi = state.players[i];
                    if (pi.quadruple.find(v => v.quadruple === select.num)) {
                        q = i;
                        break;
                    }
                    if (pi.triplet.find(v => v.triplet === select.num)) {
                        t = i;
                    }
                }
                if (q != -1) {

                }
                const next = state.players[(seat + 1) % 4];
                if (next.straight.find(v => v.straight === select.num)) {
                    s = (seat + 1) % state.rule.maxPlayer;
                }
            }
            player.select = undefined;
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
    handleOutCard,
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
