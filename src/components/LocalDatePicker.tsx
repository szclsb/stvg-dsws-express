import {useEffect, useState} from "react";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider"
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment"
import {DatePicker} from "@mui/x-date-pickers/DatePicker"
import React from "react";
import moment, {Moment} from "moment";
import "moment/locale/de-ch"
import {LocalDate} from "../models/models";

function convert(localDate?: LocalDate): Moment | undefined {
    return !localDate ? undefined : moment(new Date(localDate.year, localDate.month - 1, localDate.day));
}

function LocalDatePicker(props: { data?: LocalDate, readOnly: boolean, onChange: (date?: LocalDate) => any}) {
    const [date, setDate] = useState<Moment | null>(convert(props.data));

    useEffect(() => {
        setDate(convert(props.data));
    }, [props.data]);

    const onDateChange = (value: Moment | null) => {
        // setDate(date);
        if (value) {
            props.onChange({
                year: value.year(),
                month: value.month() + 1,
                day: value.date()
            })
        }
    }

    return (<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={'de-ch'}>
        <DatePicker readOnly={props.readOnly} onChange={onDateChange} value={moment(date)}/>
    </LocalizationProvider>);
}

export default LocalDatePicker;
