import {Athlete} from "./athlete";

export interface Result {
    disciplineName: string;
    categoryName?: string;
    groupName?: string;
    time: number;
    participants: Athlete[];
}

export type Ranking = Result & {
    rank: number
}
