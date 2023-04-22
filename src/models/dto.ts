import {Time} from "./planning";
import {Athlete} from "./athlete";

export interface RegistrationPlanning {
    disciplineName: string,
    categoryName: string | undefined,
    startTime: Time,
    endTime: Time,
    beginTrack: number,
    endTrack: number,
    groupName: string | undefined,
    participants: {
        athlete: Athlete,
        age: number
    }[]
}
