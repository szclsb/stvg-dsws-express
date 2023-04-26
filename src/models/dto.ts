import {Time} from "./planning";
import {Athlete} from "./athlete";

export interface Run {
    disciplineName: string;
    categoryName: string | undefined;
    groupName: string | undefined;
    participants: {
        athlete: Athlete,
        age: number
    }[];
}

export interface RunPlanning extends Run {
    startTime: Time;
    endTime: Time;
    beginTrack: number;
    endTrack: number;
}

export interface RunRecording extends RunPlanning {
    seconds: number
}

export interface RunRanking {
    rank: number
}
