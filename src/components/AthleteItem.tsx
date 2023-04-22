import {Athlete, Sex} from "../models/athlete";
import {Stack} from "@mui/material";
import React from "react";

function displaySex(sex: Sex): string {
    return sex === "FEMALE" ? "W" : sex === "MALE" ? "M" : undefined;
}

function AthleteItem(props: {athlete: Athlete, age: number}) {
    return !props ? undefined : (<Stack>
        <div>{props.athlete.firstName} {props.athlete.lastName}</div>
        <div>{displaySex(props.athlete.sex)} / {props.age}</div>
    </Stack>)
}

export default AthleteItem;
