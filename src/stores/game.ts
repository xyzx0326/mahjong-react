import {defaultRule, Rule, RuleKey} from "@/config/rules";
import {CACHE_RULE_KEY, CacheUtils, GameUtils} from "@/utils";
import {createSlice} from '@reduxjs/toolkit'

export type PieceType = {
    rowIndex: number;
    colIndex: number;
    num: number;
};

export type GridData = { rowIndex: number; colIndex: number };

export type GameFrameData = {
    steps: number; // 步数
    board: number[]; // 棋盘
    selfIsWhite?: boolean; // 自己是白方
    stepIsWhite?: boolean;// 轮到白方走棋
    onlyShow: boolean,
    onlyOnePieceStep?: number;// 某方只剩一个棋子，大于0表示白方，小于0表示黑方，绝对值表示步数
    gameIsEnd?: boolean;// 游戏是否结束
    selectGrid: GridData | undefined,
    rule: Rule
};

const cacheRule = CacheUtils.getItem(CACHE_RULE_KEY, defaultRule);

const initialState = {
    steps: 0,
    // board: new Array(225),
    board: [],
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
            state.board = []
        },

        changeSelfColor(state) {
            state.selfIsWhite = !state.selfIsWhite;
        },

        updateSelfColor(state, {payload}) {
            state.selfIsWhite = payload;
        },

        handleSelectGrid(state, {payload}) {
            const rowIndex = payload.rowIndex;
            const colIndex = payload.colIndex;
            const index = rowIndex * 15 + colIndex;
            // 如果此格没有棋子，则可以选择
            if (!state.board[index]) {
                if (state.selectGrid && state.selectGrid.rowIndex === payload.rowIndex && state.selectGrid.colIndex === payload.colIndex) {
                    state.steps++;
                    state.board[index] = state.stepIsWhite ? state.steps : -state.steps;
                    const isEnd = GameUtils.checkGameOver(state.board, index);
                    // const isEnd = false;
                    console.log(isEnd)
                    if (isEnd) {
                        state.gameIsEnd = true;
                    } else {
                        state.stepIsWhite = !state.stepIsWhite;
                    }
                    state.selectGrid = undefined;
                } else {
                    state.selectGrid = payload;
                }
            }
        },

        updateRule(state, {payload}) {
            state.rule = payload
            CacheUtils.setItem(CACHE_RULE_KEY, state.rule)
        },

        updateShow(state, {payload}) {
            state.onlyShow = payload;
        }

    },
})

export const {
    handleRestart,
    changeSelfColor,
    handleSelectGrid,
    updateRule,
    updateSelfColor,
} = gameSlice.actions

export default gameSlice.reducer
