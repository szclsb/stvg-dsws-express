import {LocalTime} from "./models";
import {Athlete} from "./athlete";

export interface Group {
    groupName: string;
    members: Athlete[];
}

export interface Run {
    disciplineName: string;
    categoryName?: string;
    groupName?: string;
    participants: {
        athlete: Athlete,
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
