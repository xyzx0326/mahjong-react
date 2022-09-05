const width = Math.min(Math.max(window.innerWidth, window.innerHeight), 1280);
const height = Math.min(Math.min(window.innerWidth, window.innerHeight), 720);

const direction = window.innerWidth > window.innerHeight ? 1 : 2; // 1横 2纵
const endHeight = Math.min(height, width / 4 * 3)
const endWidth = Math.min(width, height / 3 * 4)

// const cardScale = direction === 1 ? 0.05 : 0.075
const cardScale = 0.05

const cardSourceWidth = 80;
const cardSourceHeight = 112;

const cardWidth = endHeight * cardScale;
const cardHeight = endHeight * cardScale / cardSourceWidth * cardSourceHeight;

// const boardEdge = (direction === 1 ? (endHeight - 14 * cardWidth) : (endHeight - 7 * cardWidth)) / 2
const boardEdge = (endHeight - 14 * cardWidth) / 2

console.log(endWidth, endHeight, cardWidth, boardEdge)
export const boardSize = {
    width: direction === 1 ? endWidth : endHeight,
    height: direction === 1 ? endHeight : endWidth,
    boardEdge,
    cardWidth,
    cardHeight,
    direction
}

export const boardScale = (scale = 1) => {
    return {
        width: endWidth * scale,
        height: endHeight * scale,
        boardEdge: boardEdge,
        cardWidth: cardWidth * scale,
        cardHeight: cardHeight * scale,
        direction: direction
    }
}

export type BoardSizeType = typeof boardSize
