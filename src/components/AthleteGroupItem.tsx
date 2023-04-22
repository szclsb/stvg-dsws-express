import {Athlete} from "../models/athlete";
import {Stack} from "@mui/material";
import React from "react";
import {RegistrationPlanning} from "../models/dto";

function AthleteGroupItem(props: {planning: RegistrationPlanning}) {
    // todo show athletes as overlay
    return !props ? undefined : (<Stack>
        <div>{props.planning.groupName}</div>
    </Stack>)
}

export default AthleteGroupItem;
