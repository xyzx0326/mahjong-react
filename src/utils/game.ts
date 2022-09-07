import {Rule} from "@/config/rules";

export interface Step {
    num: number;
    rowIndex: number;
    colIndex: number;
}

export interface AiNextStep extends Step {
    score: number;
}

export class GameUtils {



}
