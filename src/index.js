const { readFileSync, writeFileSync, existsSync } = require("fs");
const { exec } = require("child_process");
const ce1 = require("./ce1.js");
const path = require("path");
const Command = process.argv[2];

function debug(context, ...any) {
    let t = new Date();
    console.log(`[${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}.${t.getMilliseconds()}]${context ? ` [${context}]`: ""}`, ...any);
}

if (!Command) {
    console.log("CE1 usage: node . [input] [options]\n");
    process.exit(1);
}

if (!existsSync(Command)) {
    console.log("File doesn't exist");
    process.exit(1);
}

let source = readFileSync(Command, "utf-8");
writeFileSync(path.join(__dirname, "convert/input.lua"), source);
exec("converter.exe", { cwd: path.join(__dirname, "convert/") }, (error, stdout) => {
    if (error) {
        console.log("Failed to obfuscate:", error);
        return;
    }

    ce1(readFileSync(path.join(__dirname, "convert/out.lua"), "utf-8"), true)
    .catch(er => console.log(er.toString()))
    .then(a => {
        if (a) {
            writeFileSync("out.lua", a.Output);
        }
    });
})

