import {Player} from "@/stores/game";

const rules = {
    "3": {
        title: "三人麻将",
        maxPlayer: 3,
        cardLib: 1,
    },
    "4": {
        title: "四人麻将",
        maxPlayer: 4,
        cardLib: 0,
    }
};

const rules2 = {
    win: (players: Player[], card: number)=>{
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            const cards = player.cards.map(v=>v.num);
            cards.push(card);
        }
    }
}

export const defaultRule = rules["4"]

export default rules;

export type RuleKey = keyof typeof rules;

export type Rule = typeof defaultRule
