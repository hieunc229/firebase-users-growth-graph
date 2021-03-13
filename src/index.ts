import { listUsers } from "./lib/MemberGraph";
import { createGroup, DataGroupType } from "./lib/utils";
import fs from "fs";
import path from "path";

import express from "express";
const app = express();

const dataPath = path.join(__dirname, '../exportedData.json');

app.use(express.static(path.join(__dirname, '../static')));

app.get("/data", async (req, res) => {

    function handleUsers(data: string[]) {
        let groups = createGroup(data);
        fs.writeFileSync(dataPath, JSON.stringify(groups));
        handleJSONData(groups);
    }

    function handleJSONData(data: DataGroupType) {
        res.json(data).end();
    }
    try {
        if (req.query.refresh === "true" || !fs.existsSync(dataPath)) {
            listUsers({ fn: handleUsers })
        } else {
            let data = fs.readFileSync(dataPath, { encoding: "utf8" });
            handleJSONData(JSON.parse(data) as any);
        }
    } catch (err) {
        res.status(400).json({ error: err.toString() });
    }
})

const PORT = 8080;
const HOST = `localhost`;

app.listen(PORT, HOST, () => {
    console.log(`Check server at ${HOST}:${PORT}`);
})