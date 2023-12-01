import express from 'express';
import crypto from 'crypto';
import client from "./client.js";

const redis = new client();

const app = express();
const port = 8084;

const QUEUE = "test";

app.get('/push', async (req, res) => {
    const value = generateRandomString(25);
    await redis.lpush(QUEUE, value);
    res.json({ status: 1, value });
});

async function test_push() {
    const time_start = Date.now();
    for (let index = 0; index < 100000; index++) {
        const value = generateRandomString(25);
        await redis.lpush(QUEUE, value);
    }
    const time_end = Date.now();
    console.log("Push exec time: " + ((time_end - time_start) / 1000).toFixed(2) + "s");
};

await test_push();

app.get('/pop', async (req, res) => {
    const value = await redis.rpop(QUEUE);
    res.json({ status: 1, value });
});

async function test_pop() {
    const time_start = Date.now();
    for (let index = 0; index < 100000; index++) {
        await redis.rpop(QUEUE);
    }
    const time_end = Date.now();
    console.log("Pop exec time: " + ((time_end - time_start) / 1000).toFixed(2) + "s");
};

await test_pop();

app.listen(port, () => {
    console.log(`App is listening on port: ${port}`);
});

function generateRandomString(length) {
    const bytes = crypto.randomBytes(Math.ceil(length / 2));
    return bytes.toString('hex').slice(0, length);
};