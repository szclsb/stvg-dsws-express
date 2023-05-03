import React, {useEffect, useState} from "react";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider"
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment"
import {DatePicker} from "@mui/x-date-pickers/DatePicker"
import {LocalDate} from "../models/models";
import moment, {Moment} from "moment";
import "moment/locale/de-ch"

function convert(localDate?: LocalDate): Moment | undefined {
    return !localDate ? undefined : moment(new Date(localDate.year, localDate.month - 1, localDate.day));
}

function LocalDatePicker(props: {label: string, data?: LocalDate, readOnly: boolean, onChange: (date?: LocalDate) => any}) {
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
        <DatePicker label={props.label} disabled={props.readOnly} onChange={onDateChange} value={moment(date)}/>
    </LocalizationProvider>);
}

export default LocalDatePicker;
