import {LocalDate} from "../../models/models";
import {useEffect, useState} from "react";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {DatePicker} from "@mui/x-date-pickers/DatePicker"
import React from "react";
import dayjs, {Dayjs} from "dayjs";
import 'dayjs/locale/de';

function convert(localDate?: LocalDate): Dayjs | undefined {
    return !localDate ? undefined : dayjs(new Date(localDate.year, localDate.month - 1, localDate.day));
}

function LocalDatePicker(props: { data?: LocalDate, readOnly: boolean, onChange: (date?: LocalDate) => any}) {
    const [date, setDate] = useState<Dayjs | null>(convert(props.data));

    useEffect(() => {
        setDate(convert(props.data));
    }, [props.data]);

    const onDateChange = (value: Dayjs | null) => {
        // setDate(date);
        if (value) {
            props.onChange({
                year: value.year(),
                month: value.month() + 1,
                day: value.date()
            })
        }
    }

    return (<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'de'}>
        <DatePicker readOnly={props.readOnly} onChange={onDateChange} value={dayjs(date)}/>
    </LocalizationProvider>);
}

export default LocalDatePicker;
