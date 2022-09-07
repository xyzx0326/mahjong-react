import {cardLib} from "@/config/card";
import {defaultRule, Rule} from "@/config/rules";
import {CACHE_RULE_KEY, CacheUtils} from "@/utils";
import {createSlice} from '@reduxjs/toolkit'

export type CardType = { num: number; card: number, direction?: number; };

export type Player = {
    index: number;
    score: number;
    cards: CardType[];

    outer: CardType[];
    immovable: CardType[][];
    select?: number;
    isWin?: boolean;
    isRound?: boolean;
    enter?: CardType;
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
    }
}

const cacheRule = CacheUtils.getItem(CACHE_RULE_KEY, defaultRule);

const initialState = {
    steps: 0,
    currentIndex: 0,
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
        startRound(state, {payload}) {
            console.log(payload)
            state.cards = payload;
            let seat = 0;
            for (state.cardIndex = 0; state.cardIndex < 53; state.cardIndex++) {
                const current = state.players[state.currentIndex]
                const player = state.players[seat];
                if (current.enter) {
                    current.cards.push(current.enter)
                    current.cards.sort((a, b) => {
                        return a.num - b.num
                    })
                    current.enter = undefined
                }
                player.enter = {
                    num: cardLib[state.rule.cardLib][payload[state.cardIndex]],
                    card: payload[state.cardIndex]
                }
                state.currentIndex = seat
                seat = (seat + 1) % state.rule.maxPlayer
            }
        },
        /**
         * 重开游戏
         */
        handleRestart(state) {
            state.gameIsEnd = false;
            state.steps = 0;
            state.currentIndex = 0;
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
                if (player.enter && player.enter?.card === card) {
                    player.outer.push(player.enter)
                    player.enter = undefined;
                } else {
                    const select = player.cards.filter(v => v.card === card)[0];
                    player.outer.push(select)
                    player.cards = player.cards.filter(v => v.card !== card);
                    if (player.enter) {
                        player.cards.push(player.enter);
                        player.enter = undefined;
                    }
                    player.cards.sort((a, b) => {
                        return a.num - b.num
                    })
                }
                // TODO: 判断
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
    startRound,
    handleRestart,
    updateRule,
    dealCard,
    updateSelfIndex,
    handleOutCard,
    handleSelectCard,
} = gameSlice.actions

export default gameSlice.reducer
