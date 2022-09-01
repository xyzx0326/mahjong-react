import {PieceType} from "@/stores/game";

export const usePieces = (board?: number[]) => {
    return board ? board.reduce((result: PieceType[], piece: number, index: number) => {
        if (piece === 0) {
            return result;
        }
        const rowIndex = Math.floor(index / 15);
        const colIndex = index % 15;
        result.push({
            rowIndex: rowIndex,
            colIndex: colIndex,
            num: piece,
        });
        return result;
    }, [] as PieceType[]) : [] as PieceType[];
}
