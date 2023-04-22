import React from "react";
import AthleteItem from "./AthleteItem";
import AthleteGroupItem from "./AthleteGroupItem";
import {dailyMinutes, Time} from "../models/planning";
import {RegistrationPlanning} from "../models/dto";
import "../main.css"

interface TrackProperties {
    topHeaderHeight: number,
    leftHeaderWidth: number,
    itemHeight: number,
    itemWidth: number,
    tracks: number;
    plannings: RegistrationPlanning[];
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
        <div className="content-area" style={{
            width: em(width),
            height: `calc(${em(height)} + var(--app-separator-width) / 2)`
        }}>
            {timesSeq.map((t, i) => {
                const left = props.leftHeaderWidth + (props.itemWidth * i);
                return (<div className="planning-header-top" style={{
                    top: em(0),
                    left: `calc(${em(left)} - var(--app-planning-time-width) / 2)`,
                    height: em(props.topHeaderHeight),
                }}>{pad(t.hour, 2)}:{pad(t.minute, 2)}</div>);
            })}
            {seq(props.tracks).map(i => {
                const top = props.topHeaderHeight + (props.itemHeight) * (i - 1);
                return (<div className="planning-header-left" style={{
                    top: em(top),
                    left: em(0),
                    height: em(props.itemHeight),
                    width: em(props.leftHeaderWidth),
                    lineHeight: em(props.itemHeight)
                }}>Bahn {i}</div>);
            })}
            {seq(props.tracks + 1).map(i => {
                const top = props.topHeaderHeight + (props.itemHeight) * (i - 1);
                return (<div className="hline" style={{
                    top: `calc(${em(top)} - var(--app-separator-width) / 2)`,
                    left: em(0),
                    width: em(width),
                }}/>);
            })}
            {timesSeq.map((_, i) => {
                const left = props.leftHeaderWidth + (props.itemWidth) * i;
                const length = height - props.topHeaderHeight;
                return (<div className="vline" style={{
                    top: `calc(${em(props.topHeaderHeight)} - var(--app-planning-space))`,
                    left: `calc(${em(left)} - var(--app-separator-width) / 2)`,
                    height: `calc(${em(length)} + var(--app-planning-space))`
                }}/>);
            })}
            {props.plannings.map(p => {
                const top = props.topHeaderHeight + (props.itemHeight * (p.beginTrack - 1));
                const left = props.leftHeaderWidth + getTimeM(p.startTime) * props.itemWidth;
                const planningWidth = props.leftHeaderWidth + getTimeM(p.endTime) * props.itemWidth - left;
                const planningHeight = props.itemHeight * (p.endTrack - p.beginTrack + 1);
                return (<div className="planning-item" style={{
                    top: em(top),
                    left: em(left),
                    width: `calc(${em(planningWidth)} - var(--app-separator-width))`,
                    height: `calc(${em(planningHeight)} - var(--app-separator-width))`,
                }}>{createItem(p)}</div>);
            })}
        </div>
    );
}

function createItem(p: RegistrationPlanning): JSX.Element {
    return !p.groupName ? <AthleteItem planning={p}/> :
        <AthleteGroupItem planning={p}/>
}

export default Tracks;
