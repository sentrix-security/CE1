const { readFileSync, writeFileSync, existsSync } = require("fs");
const { Database, Type } = require("../config.json"); 
const ce1 = require("./ce1.js");
const Command = process.argv[2];

function debug(context, ...any) {
    let t = new Date();
    console.log(`[${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}.${t.getMilliseconds()}]${context ? ` [${context}]`: ""}`, ...any);
}

if (!Command && Type !== "--p") {
    console.log("CE1 usage: node . [input] [options]\n");
    process.exit(1);
}

if (Type == "--p") {
    debug("ALERT", "You have the config type to --p (production), make the type empty to run a normal version")
}

if (Command == "--p" || Type == "--p") {
    const mongo = require("mongodb");
    const client = new mongo.MongoClient(Database, {
        useUnifiedTopology: true
    });
    
    client.connect((er, client) => {
        if (er) {
            return debug("DATABASE", `Error connecting to database : ${er.toString()}`)
        }

        process.collection = client.db().collection("Users");
        debug("DATABASE", "Connected to database.");
        require("./bot");
        //require("./api");
    });
} else {
    if (!existsSync(Command)) {
        console.log("File doesn't exist");
        process.exit(1);
    }
    
    ce1(readFileSync(Command, "utf-8"), true)
    .catch(er => console.log(er.toString()))
    .then(a => {
        if (a) {
            writeFileSync("out.lua", a.Output);
        }
    });
}