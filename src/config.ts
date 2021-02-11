import admin from "firebase-admin";
import config from "../config.json";

const conn = admin.initializeApp({
    credential: admin.credential.cert(config.credential as any),
    databaseURL: config.databaseURL
});

export default conn;