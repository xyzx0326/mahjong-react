const rules = {
    "3": {
        title: "三人麻将",
        maxPlayer: 3,
        cards: [],
    },
    "4": {
        title: "四人麻将",
        maxPlayer: 4,
        cards: [],
    }
};

export const defaultRule = rules["4"]

export default rules;

export type RuleKey = keyof typeof rules;

export type Rule = typeof defaultRule
