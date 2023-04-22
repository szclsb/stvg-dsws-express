import {dailyMinutes, Planning, Time} from "../models/planning";
import {Athlete} from "../models/athlete";
import {Collapse, List, ListItem, ListItemText, Stack, Tab, Tabs, TextField} from "@mui/material";
import React from "react";
import AthleteItem from "./AthleteItem";
import AthleteGroupItem from "./AthleteGroupItem";

interface TrackProperties {
    topHeaderHeight: number,
    leftHeaderWidth: number,
    itemHeight: number,
    itemWidth: number,
    separator: number,
    tracks: number;
    plannings: [Planning, Athlete[], string?][];
}

function em(value: number): string {
    return value + "em";
}

function seq(count: number): number[] {
    return new Array(count).fill(1).map((_, i) => i + 1)
}

function pad(value: number, digits: number): string {
    return String(value).padStart(digits, '0')
}

function Tracks(props: TrackProperties) {
    const startTime: Time = {hour: 10, minute: 0}
    const sepTime: Time = {hour: 0, minute: 15}
    const timesCount: number = 4;
    const timesSeq = new Array(timesCount).fill(1).map((_, i): Time => {
        return {
            hour: startTime.hour + i * sepTime.hour,
            minute: startTime.minute + i * sepTime.minute,
        }
    });
    const getTimeM = (t: Time): number => {
        const start = dailyMinutes(startTime);
        const diff = dailyMinutes(sepTime);
        const x = dailyMinutes(t);
        return (x - start) / diff;
    }
    const width = props.leftHeaderWidth + timesCount * (props.itemWidth);
    const height = props.topHeaderHeight + props.tracks * (props.itemHeight);
    return (
        <div style={{
            position: "relative",
            width: em(width),
            height: em(height + props.separator / 2)
        }}>
            {timesSeq.map((t, i) => <div style={{
                position: "absolute",
                top: em(0),
                left: em(props.leftHeaderWidth - 2 + (props.itemWidth * i)),
                height: em(props.topHeaderHeight),
                textAlign: "center",
                width: "4em"
            }}>{pad(t.hour, 2)}:{pad(t.minute, 2)}</div>)}
            {seq(props.tracks).map(i => <div style={{
                position: "absolute",
                top: em(props.topHeaderHeight + (props.itemHeight) * (i - 1)),
                left: em(0),
                height: em(props.itemHeight),
                width: em(props.leftHeaderWidth),
                lineHeight: em(props.itemHeight)
            }}>Bahn {i}</div>)}
            {seq(props.tracks + 1).map(i => <div style={{
                position: "absolute",
                top: em(props.topHeaderHeight - props.separator / 2 + (props.itemHeight) * (i - 1)),
                left: em(0),
                width: em(width),
                height: em(props.separator),
                backgroundColor: "black"
            }}/>)}
            {timesSeq.map((_, i) => <div style={{
                position: "absolute",
                top: em(props.topHeaderHeight - 0.5),
                left: em(props.leftHeaderWidth - props.separator / 2 + (props.itemWidth) * i),
                width: em(props.separator),
                height: em(height - props.topHeaderHeight + 0.5),
                backgroundColor: "black"
            }}/>)}
            {props.plannings.map(p => {
                const left = props.leftHeaderWidth + getTimeM(p[0].startTime) * props.itemWidth;
                const planningWidth = props.leftHeaderWidth + getTimeM(p[0].endTime) * props.itemWidth - left;

                console.log(getTimeM(p[0].startTime));
                console.log(getTimeM(p[0].endTime));
                return (<div style={{
                    position: "absolute",
                    top: em(props.topHeaderHeight + (props.itemHeight * (p[0].track - 1))),
                    left: em(left),
                    width: em(planningWidth - props.separator),
                    height: em(props.itemHeight - props.separator),
                    backgroundColor: "lightblue",
                    borderRadius: "1em",
                    margin: em(props.separator / 2)
                }}>{createItem(p[1], p[2])}</div>);
            })}
        </div>
    );
}

function createItem(athletes: Athlete[], groupName?: string): JSX.Element {
    return !groupName ? <AthleteItem athlete={athletes[0]}/> :
        <AthleteGroupItem groupName={groupName} athletes={athletes}/>
}

export default Tracks;
