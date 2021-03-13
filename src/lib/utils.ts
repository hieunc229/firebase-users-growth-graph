import TimeSeries from "time-series-generator";

export type DataGroupType = { [name: string]: number };

export function createGroup(data: string[]) {

    let dates = data.map(d => new Date(d));
    dates.sort((a, b) => a.getTime() - b.getTime());

    let startDate = new Date(Math.min(...dates.map(d => d.getTime())));
    let endDate = new Date(Math.max(...dates.map(d => d.getTime())));

    const timeSeries = TimeSeries({ startDate, endDate, interval: "day" });
    
    let timeGroup: DataGroupType = {};
    timeSeries.forEach(t => {
        const date = t.startDate.toISOString().split('T')[0];
        timeGroup[date] = 0;
    })

    return dates.map(d => d.toISOString()).reduce((groups: DataGroupType, time) => {
        const date = time.split('T')[0];
        groups[date]++;
        return groups;
    }, timeGroup);
}