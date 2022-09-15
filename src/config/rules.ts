import {cardSinge} from "@/config/card";
import {Player, Strategy} from "@/stores/game";

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

function getCardMap(player: Player) {
    const cards = player.cards.map(v => v.num);
    const cardMap: any = {}
    for (let i = 0; i < cards.length; i++) {
        if (!cardMap[cards[i]]) {
            cardMap[cards[i]] = 0;
        }
        cardMap[cards[i]]++
    }
    return cardMap;
}

export const winRules = {
    // 杠
    quadruple: (player: Player): Strategy[] => {
        const cardMap = getCardMap(player);
        const ret = []
        for (let key in cardMap) {
            if (cardMap[key] === 3) {
                ret.push({type:'quadruple', card: parseInt(key)})
            }
        }
        return ret;
    },
    // 刻子
    triplet: (player: Player): Strategy[] => {
        const cardMap = getCardMap(player);
        const ret = []
        for (let key in cardMap) {
            if (cardMap[key] == 2) {
                ret.push({type:'triplet', card: parseInt(key)})
            }
        }
        return ret;
    },
    // 顺子
    straight: (player: Player): Strategy[] => {
        const cards = player.cards.map(v => v.num);
        const cardList = []
        for (let i = 0; i < cards.length; i++) {
            if (cardList.indexOf(cards[i]) === -1) {
                cardList.push(cards[i])
            }
        }
        cardList.sort((a, b) => a - b)
        const ret = []
        const set: any = {}
        for (let i = 1; i < cardList.length; i++) {
            if (cardList[i - 1] + 1 === cardList[i]) {
                const number1 = cardList[i - 1] - 1;
                if (!set[number1]) {
                    set[number1] = 1
                    ret.push({card: number1, type: 'straight'})
                }
                const number2 = cardList[i] + 1;
                if (!set[number2]) {
                    set[number2] = 1
                    ret.push({card: number2, type: 'straight'})
                }
            }
            for (let j = 1; j < 5; j++) {
                if (i - j >= 0 && cardList[i - j] + 2 === cardList[i]) {
                    const number = cardList[i] - 1;
                    if (!set[number]) {
                        set[number] = 1
                        ret.push({card: number, type: 'straight'})
                    }
                }
            }
        }
        return ret.filter(v => cardSinge.indexOf(v.card) != -1)
    },
    // 基础赢法
    win: (player: Player): Strategy[] => {
        const immovable = player.immovable.length;
        const cards = player.cards.map(v => v.num);

        const cardList = []
        for (let i = 0; i < cards.length; i++) {
            if (cardList.indexOf(cards[i]) === -1) {
                cardList.push(cards[i])
            }
        }
        let bbb = 0;
        const win = []
        for (let i = 0; i < cardList.length; i++) {
            const singe = cardList[i];
            const cards1 = [singe, ...cards];
            const a = maxGroupNumber(cards1);
            bbb++;
            if (a === 4 - immovable) {
                for (let j = 0; j < cardSinge.length; j++) {
                    const winCard = cardSinge[j];
                    const cards2 = [...cards1, winCard];
                    if (cards2.filter(v => v === winCard).length > 4) {
                        continue;
                    }
                    if (singe !== winCard && cards2.filter(v => v === singe).length < 3) {
                        continue;
                    }
                    const number = maxGroupNumber(cards2);
                    bbb++;
                    if (number === 5 - immovable) {
                        let i = 3
                        const cards3 = cards2.filter(v => v !== singe || (i-- <= 0));
                        if (maxGroupNumber(cards3) !== 4 - immovable) {
                            bbb++;
                            continue;
                        }
                        win.push({type: 'win', card: winCard})
                    }
                }
            }
        }
        return win
    }
}

const maxGroupNumber = (cards: number[]) => {
    const cardMap = {} as any
    const cardList = []
    for (let i = 0; i < cards.length; i++) {
        if (!cardMap[cards[i]]) {
            cardList.push(cards[i])
            cardMap[cards[i]] = 0;
        }
        cardMap[cards[i]]++
    }
    cardList.sort((a, b) => a - b)

    const dp: number[][][] = []

    for (let i = 0; i <= cardList.length; i++) {
        dp[i] = []
        for (let j = 0; j < 5; j++) {
            dp[i][j] = []
            for (let k = 0; k < 5; k++) {
                dp[i][j][k] = -1
            }
        }
    }

    dp[0][0][0] = 0

    for (let i = 1; i <= cardList.length; i++) {
        const card = cardList[i - 1]
        let preCard = 0
        if (i > 1) {
            preCard = cardList[i - 2]
        }
        if (i > 1 && card !== preCard + 1) {
            const t = dp[i - 1][0][0]
            for (let m = 0; m < 5; m++) {
                for (let n = 0; n < 5; n++) {
                    dp[i - 1][m][n] = -1
                }
            }
            dp[i - 1][0][0] = t
        }

        for (let a = 0; a < 5; a++) {
            for (let b = 0; b < 5; b++) {
                if (dp[i - 1][a][b] === -1) {
                    continue
                }
                const cardCount = cardMap[card];
                for (let nStr = 0; nStr <= Math.min(a, b, cardCount); nStr++) {
                    const na = b - nStr
                    for (let nb = 0; nb <= Math.min(4, cardCount - nStr); nb++) {
                        dp[i][na][nb] = Math.max(dp[i][na][nb], dp[i - 1][a][b] + nStr + Math.floor((cardCount - nb - nStr) / 3))
                    }

                }
            }
        }
    }

    let res = -1
    for (let a = 0; a < 5; a++) {
        for (let b = 0; b < 5; b++) {
            res = Math.max(res, dp[cardList.length][a][b])
        }
    }
    return res;
}

export const defaultRule = rules["4"]

export default rules;

export type RuleKey = keyof typeof rules;

export type Rule = typeof defaultRule
