
export type DataGroupType = { [name: string]: number };

export function createGroup(data: string[]) {

    let dates = data.map(d => new Date(d));
    dates.sort((a, b) => a.getTime() - b.getTime());

    return dates.map(d => d.toISOString()).reduce((groups: DataGroupType, time) => {
        const date = time.split('T')[0];
        if (!groups[date]) {
            groups[date] = 0;
        }
        groups[date]++;
        return groups;
    }, {});
}