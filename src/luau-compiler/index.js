const { randomBytes } = require("crypto");
const { writeFileSync, unlinkSync } = require("fs");
const { exec } = require("child_process");
const path = require("path");
const express = require("express");
const app = express();

app.use("/", express.static(path.join(__dirname, "/web/")));
app.use(express.json());

app.post("/api/compile", (req, res) => {
    let Path = path.join(__dirname, `/temp/${randomBytes(10).toString("hex")}`)
    writeFileSync(Path, req.body.script);

    exec(`luauu.exe --compile ${Path}`, (error, stdout) => {
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
})

app.listen(8080, () => console.log("hello"))