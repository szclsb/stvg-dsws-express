import {
    validate,
    validateInteger,
    required,
} from "../validation/validation-utils";
import {LocalTime, validateLocalTime} from "./models";

export interface Planning {
    planningNumber: number,
    plannedStartTime: LocalTime;
    plannedEndTime: LocalTime;
}

export async function validatePlanning(body: any): Promise<Planning> {
    return await validate<Planning>({
        planningNumber: validateInteger(body.planningNumber, 0).then(required),
        plannedStartTime: validateLocalTime(body.plannedStartTime).then(required),
        plannedEndTime: validateLocalTime(body.plannedEndTime).then(required),
    });
}
