import express from "express";
import crypto from "crypto";
import client from "./client.js";

const QUEUE = "test";

const beanstalkd = client(QUEUE);

const app = express();
const port = 8085;

app.get('/push', async (req, res) => {
    const value = generateRandomString(25); 
    beanstalkd.put(0, 0, 60, value, (err, jobId) => {
        if (err) {
            res.json({ status: 0, error: err });
        } else {
            res.json({ status: 1, jobId });
        }
    });
});

function test_push() {
    const time_start = Date.now();
    for (let index = 0; index < 100000; index++) {
        const value = generateRandomString(25); 
        beanstalkd.put(0, 0, 60, value, (err, jobId) => {
            if (index == 99999) {
                const time_end = Date.now();
                console.log("Push exec time: " + ((time_end - time_start) / 1000).toFixed(2) + "s");
            }
        });
    }
}

test_push()

app.get('/pop', async (req, res) => {
    beanstalkd.peek_ready((err, jobId, value) => {
        if (err) {
            return res.json({ status: 0, error: err });
        }
            
        beanstalkd.destroy(jobId, (err) => {
            if (err) {
                return res.json({ status: 0, error: err });
            }

            return res.json({ status: 1, value: value.toString() });
        });
    });
});

function test_pop() {
    const time_start = Date.now();
    for (let index = 0; index < 100000; index++) {
        beanstalkd.peek_ready((err, jobId, value) => {
            beanstalkd.destroy(jobId, (err) => {
                if (index == 99999) {
                    const time_end = Date.now();
                    console.log("Pop exec time: " + ((time_end - time_start) / 1000).toFixed(2) + "s");
                }
            });
        });
    }
}

test_pop();

app.listen(port, () => {
    console.log(`App is listening on port: ${port}`);
});

function generateRandomString(length) {
    const bytes = crypto.randomBytes(Math.ceil(length / 2));
    return bytes.toString('hex').slice(0, length);
};