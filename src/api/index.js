const { randomBytes } = require("crypto");
const { writeFileSync, unlinkSync } = require("fs");
const { exec } = require("child_process");
const path = require("path");
const express = require("express");
const ratelimiter = require("express-rate-limit");
const ce1 = require("../ce1");
const app = express();
const limiter = ratelimiter({ // too lazy to make own
    windowMs: 60000,
    max: 3,
    message: {
        error: true,
        reason: "You are being ratelimited. Please wait a minute"
    }
});

app.use("/", express.static(path.join(__dirname, "/web/")));
app.use(express.json());

function debug(context, ...any) {
    let t = new Date();
    console.log(`[${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}.${t.getMilliseconds()}]${context ? ` [${context}]`: ""}`, ...any);
}

app.post("/api/protect", limiter, async (req, res) => {
    let Body = req.body;
 
    if (req.headers["content-type"] !== "application/json") {
        res.status(400).json({ error: true, reason: "Invalid content-type! Expected application/json" });
        return;
    }

    if (!Body.auth || !Body.script) {
        res.status(400).json({ error: true, reason: "Invalid body." });
        return;
    }

    let Exists = await process.collection.findOne({ api_key: Body.auth });
    if (!Exists) {
        res.status(400).json({ error: true, reason: "Invalid key." });
        return;
    }

    if (Body.script.length > 500000) {
        res.status(400).json({ error: true, reason: "Script exceeds max length (500000)." });
        return;
    }

    debug("API", `${Exists.id} Protected a script (size: ${Body.script.length}).`);

    const Result = await ce1(Body.script, false, Exists.fingerprint)
    .catch(er => {
        res.status(500).json({ error: true, reason: er.toString() });
    });

    if (Result) {
        const RandomPath = path.join(__dirname, `/temp/CE1_${Math.floor(Math.random() * 9e9)}_.lua`);

        writeFileSync(RandomPath, Result.Output);
        res.sendFile(RandomPath, (er) => {
            if (er) {
                res.status(500).json({ error: true, reason: er.toString() });
            }
            unlinkSync(RandomPath);
        });
    }
});

app.post("/api/compile", (req, res) => {
    let Path = path.join(__dirname, `/temp/${randomBytes(10).toString("hex")}`)
    writeFileSync(Path, req.body.script);

    exec(`luau --compile ${Path}`, (error, stdout) => {
        unlinkSync(Path);
        if (error) {
            res.type("text").send(error.toString())
            return;
        }
        res.type("text").send(stdout);
    });
});

app.post("/api/decompile", (req, res) => {
    let Path = path.join(__dirname, `/temp/${randomBytes(10).toString("hex")}`)
    writeFileSync(Path, req.body.script);

    exec(`luac -s ${Path}`, (error, stdout) => {
        unlinkSync(Path);
        if (error) {
            res.type("text").send(error.toString())
            return;
        }
        
        exec(`java -jar ${path.join(__dirname, "unluac.jar")} luac.out`, (error, stdout) => {
            if (error) {
                res.type("text").send(error.toString())
                return;
            }

            res.type("text").send(stdout);
        });
    });
});

app.listen(3000, () => debug("API", "Listening to port 3000"));