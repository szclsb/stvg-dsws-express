import {validate, validateInteger, required, validateText} from "../validation/validation-utils";

export interface EventConfig {
    eventName: string;
    tracks: number;
}

export async function validateEventConfig(body: any): Promise<EventConfig> {
    return await validate<EventConfig>({
        eventName: validateText(body.eventName).then(required),
        tracks: validateInteger(body.tracks, 0).then(required)
    });
}
