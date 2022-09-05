import {defaultRule, Rule} from "@/config/rules";
import {CACHE_RULE_KEY, CacheUtils} from "@/utils";
import {createSlice} from '@reduxjs/toolkit'

export type CardType = {
    num: number;
    direction?: number;
};

export type GridData = { rowIndex: number; colIndex: number };

export type Player = {
    index: number;
    enter?: CardType;
    cards: CardType[];
    immovable: CardType[][];
    select?: number;
    isWin?: boolean;
    isRound?: boolean;
}

export type GameFrameData = {
    steps: number; // 步数
    players: Player[]
    selfIsWhite?: boolean; // 自己是白方
    stepIsWhite?: boolean;// 轮到白方走棋
    onlyOnePieceStep?: number;// 某方只剩一个棋子，大于0表示白方，小于0表示黑方，绝对值表示步数
    gameIsEnd?: boolean;// 游戏是否结束
    selectGrid: GridData | undefined,
    rule: Rule
};

const cacheRule = CacheUtils.getItem(CACHE_RULE_KEY, defaultRule);

const initialState = {
    steps: 0,
    players: [{
        index: 0,
        enter: {num: 29},
        cards: [{num: 1}, {num: 1}, {num: 1}, {num: 9}, {num: 9}, {num: 9}, {num: 29}],
        immovable: [[{num: 19}, {num: 19, direction: 1}, {num: 19}], [{
            num: 11,
            direction: 2
        }, {num: 11}, {num: 11}, {num: 11, direction: 2}]],
        isWin: false,
        select: 1,
        isRound: true
    }, {
        index: 1,
        cards: [{num: 1}, {num: 1}, {num: 1}, {num: 9}, {num: 9}, {num: 9}, {num: 29}, {num: 29}],
        immovable: [[{num: 19}, {num: 19, direction: 1}, {num: 19}], [{num: 11, direction: 1}, {num: 11}, {num: 11}]],
        isWin: false,
        isRound: true
    }, {
        index: 2,
        cards: [{num: 1}, {num: 1}, {num: 1}, {num: 9}, {num: 9}, {num: 9}, {num: 29}, {num: 29}],
        immovable: [[{num: 19}, {num: 19, direction: 1}, {num: 19}], [{num: 11, direction: 1}, {num: 11}, {num: 11}]],
        isWin: false,
        isRound: true
    }, {
        index: 3,
        cards: [{num: 1}, {num: 1}, {num: 1}, {num: 9}, {num: 9}, {num: 9}, {num: 29}, {num: 29}],
        immovable: [[{num: 19}, {num: 19, direction: 1}, {num: 19}], [{num: 11, direction: 1}, {num: 11}, {num: 11}]],
        isWin: false,
        isRound: true
    }],
    selfIsWhite: false,
    stepIsWhite: false,
    gameIsEnd: false,
    onlyShow: false,

    otherSideOnline: false,
    selectGrid: undefined,
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
            state.stepIsWhite = false;
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
