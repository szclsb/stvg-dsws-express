import {Athlete, Sex} from "../models/athlete";
import {Stack} from "@mui/material";
import React from "react";
import {RegistrationPlanning} from "../models/dto";

function displaySex(sex: Sex): string {
    return sex === "FEMALE" ? "W" : sex === "MALE" ? "M" : undefined;
}

function AthleteItem(props: {planning: RegistrationPlanning}) {
    const participant = props.planning.participants[0];
    return !props ? undefined : (<Stack>
        <div>{participant.athlete.firstName} {participant.athlete.lastName}</div>
        <div>{displaySex(participant.athlete.sex)} / {participant.age}</div>
    </Stack>)
}

export default AthleteItem;
