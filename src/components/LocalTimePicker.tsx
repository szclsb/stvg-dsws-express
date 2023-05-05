import {LocalTime} from "../models/models";
import moment, {Moment} from "moment";
import React, {useEffect, useState} from "react";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import "moment/locale/de-ch"


function convert(localTime?: LocalTime): Moment | undefined {
    return !localTime ? undefined : moment(new Date(2023, 0, 1, localTime.hour, localTime.minute, 0));
}

function LocalTimePicker(props: {
    label: string,
    readOnly: boolean,
    value?: LocalTime,
    onChange: (date?: LocalTime) => any
}) {
    const [time, setTime] = useState<Moment | null>(convert(props.value));

    useEffect(() => {
        setTime(convert(props.value));
    }, [props.value]);

    const onTimeChange = (value: Moment | null) => {
        // setTime(date);
        if (value) {
            props.onChange({
                hour: value.hour(),
                minute: value.minute(),
            })
        }
    }

    return (<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={'de-ch'}>
        <TimePicker label={props.label}  disabled={props.readOnly} onChange={onTimeChange} value={time} />
    </LocalizationProvider>);
}

export default LocalTimePicker;
