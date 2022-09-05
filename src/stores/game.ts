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
    steps: number; // 步数
    players: Player[]
    currentIndex: number,
    gameIsEnd?: boolean;// 游戏是否结束
    rule: Rule
};

const cacheRule = CacheUtils.getItem(CACHE_RULE_KEY, defaultRule);

const initialState = {
    steps: 0,
    currentIndex: 0,
    players: [{
        index: 0,
        cards: [],
        outer: [
            {num: 1, card: 0},
            {num: 1, card: 1},
            {num: 1, card: 2},
            {num: 1, card: 3},
            {num: 2, card: 4},
            {num: 2, card: 5}
        ],
        immovable: [],
        isWin: false,
        select: 1,
        isRound: true,
        score: 25000,
    }, {
        index: 1,
        cards: [],
        outer: [],
        immovable: [],
        isWin: false,
        isRound: true,
        score: 25000,
    }, {
        index: 2,
        cards: [],
        outer: [],
        immovable: [],
        isWin: false,
        isRound: true,
        score: 25000,
    }, {
        index: 3,
        cards: [],
        outer: [],
        immovable: [],
        isWin: false,
        isRound: true,
        score: 25000,
    }],
    selfIsWhite: false,
    stepIsWhite: false,
    gameIsEnd: false,

    rule: cacheRule, //规则
} as GameFrameData


export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        /**
         * 重开游戏
         */
        handleRestart(state) {
            state.gameIsEnd = false;
            state.steps = 0;
        },

        updateRule(state, {payload}) {
            state.rule = payload
            CacheUtils.setItem(CACHE_RULE_KEY, state.rule)
        },

    },
})

export const {
    handleRestart,
    updateRule,
} = gameSlice.actions

export default gameSlice.reducer
