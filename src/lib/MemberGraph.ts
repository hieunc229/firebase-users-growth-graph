import conn from "../config";

const MAX_USERS = 1000;

export function listUsers(opts: { pageToken?: string, accumateRecords?: string[], fn: (time: string[]) => void }) {
    conn.auth().listUsers(MAX_USERS, opts.pageToken)
        .then(rs => {

            let data = rs.users.map(r => r.metadata.creationTime)
                .concat(opts.accumateRecords || []);

            if (rs.users.length < MAX_USERS) {
                opts.fn(data);
            } else {
                listUsers({ pageToken: rs.pageToken, fn: opts.fn, accumateRecords: data })
            }
        })
}