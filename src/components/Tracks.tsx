import {Planning, Time} from "../../server/src/models/planning";
import {Athlete} from "../../server/src/models/athlete";
import {Collapse, List, ListItem, ListItemText, Stack, Tab, Tabs, TextField} from "@mui/material";
import React from "react";

interface TrackProperties {
    topHeaderHeight: number,
    leftHeaderWidth: number,
    itemHeight: number,
    itemWidth: number,
    separator: number,
    tracks: number;
    plannings: [Planning, Athlete[], string?][];
}

function em(value: number) {
    return value + "em";
}

function seq(count: number) {
    return new Array(count).fill(1).map((_, i) => i + 1)
}

function Tracks(props: TrackProperties) {
    const startTime: Time = {hour: 10, minute: 0}
    const sepTime: Time = {hour: 0, minute: 15}
    const timesCount = 4;
    const timesSeq = new Array(timesCount).fill(1).map((_, i): Time => {
        return {
            hour: startTime.hour + i * sepTime.hour,
            minute: startTime.minute + i * sepTime.minute,
        }
    })
    const width = props.leftHeaderWidth + timesCount * (props.separator + props.itemWidth);
    const height = props.topHeaderHeight + props.separator + timesCount * (props.separator + props.itemHeight);
    return (
        <div style={{
            position: "relative",
            width: em(width),
            height: em(height)
        }}>
            {timesSeq.map((t, i) => <div style={{
                position: "absolute",
                top: em(0),
                left: em(props.leftHeaderWidth + (props.separator + props.itemWidth) * i),
                height: em(props.topHeaderHeight),
                width: em(props.itemWidth)
            }}>{t.hour}:{t.minute}</div>)}
            {seq(props.tracks).map(i => <div style={{
                position: "absolute",
                top: em(props.topHeaderHeight + (props.separator + props.itemHeight) * (i - 1)),
                left: em(0),
                height: em(props.itemHeight),
                width: em(props.leftHeaderWidth),
                lineHeight: em(props.itemHeight)
            }}>Bahn {i}</div>)}
            {seq(props.tracks + 1).map(i => <div style={{
                position: "absolute",
                top: em(props.topHeaderHeight + (props.separator + props.itemHeight) * (i - 1)),
                left: em(0),
                width: em(width),
                height: em(props.separator),
                backgroundColor: "black"
            }}/>)}
        </div>
    );
}

export default Tracks;
