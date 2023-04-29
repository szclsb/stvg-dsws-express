import {LocalTime} from "./models";
import {Athlete} from "./athlete";

export interface Run {
    disciplineName: string;
    categoryName: string | undefined;
    groupName: string | undefined;
    participants: {
        athlete: Athlete,
        startNumber: number,
        age: number
    }[];
}

export interface RunPlanning extends Run {
    startTime: LocalTime;
    endTime: LocalTime;
    beginTrack: number;
    endTrack: number;
}

export interface RunRecording extends RunPlanning {
    seconds: number
}

export interface RunRanking {
    rank: number
}
