const { readFileSync, writeFileSync, existsSync, write } = require("fs");
const { randomBytes, createHash, randomUUID } = require("crypto");
//const puppeteer = require('puppeteer');
//const go = require("gojs");
const str = require("./obfuscator/constant");
const amg = require("./obfuscator/amg");
const include = require("./obfuscator/constant/VM/include");
const random = require("random");
const { performance } = require("perf_hooks");

const luamin = require("./luamin.js");
const luaparse = require("./luaparse");
const path = require("path");
//let browser

function sha512(data) { return createHash("sha256").update(data).digest("hex").slice(0, 30) };
function escapeRegExp(string) {
    // totally not skidded :uhh:
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
}


function debug(context, ...any) {
    let t = new Date();
    console.log(`[${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}]${context ? ` [${context}]`: ""}`, ...any);
}

// jesus kill me
function ParseTable(t) {
    let serialized = {};
    for (let [i,v] of Object.entries(t)) {
        if (v.type == "TableConstructorExpression") {
            serialized = ParseTable(v.fields);
        } else if (v.type == "TableKeyString" || v.type == "TableKey") {
            let key = v.type == "TableKeyString" ? v.key.name : v.key.raw;
            if (v.key.type == "Identifier" && v.value.type == "TableConstructorExpression") {
                serialized[key] = ParseTable(v.value.fields);
            } else {
                serialized[key] = v.value.value;
            }
        }
    }
    return serialized;
}

// jesus kill me x2
function ParseObjectToLua(t, fingerprint, h) {
    serialized = "";
    h = h ? h + 1 : 1;
    for (let [i,v] of Object.entries(t)) {
        serialized += `[${i}]=${typeof(v) !== "object" ? `${typeof(v) == "string" ? `${str(v, true, fingerprint)}` : v}` : ParseObjectToLua(v, fingerprint, h)},\n`;
    }
    if (h < 2) {
        return `{\n${serialized.substr(0, serialized.length - 2)}\n}`;   
    } else {
        return `{\n${serialized.substr(0, serialized.length - 2)}\n${"  ".repeat(h - 1)}}`;
    }
}

module.exports = async function(Script, isdebug, fingerprint) {
    return new Promise(async (resolve, reject) => {
        function MacroArgCheck(node, index, type, required) {
            required = required || true;
            
            let Argument = node.arguments[index];
            if (!Argument && required) {
                return;
            }

            if (Argument.type !== type) {
                reject(`JSEC:${node.loc.start.line}: invalid argument #${index + 1} to '${node.base.name}' (expected ${type} got ${Argument.type})`);
                return true;
            }
        }

        function AceError(node, error) {
            if (!node) {
                return reject(`JSEC:?: ${error}`);
            }
            reject(`JSEC:${node.loc.start.line}: ${error}`);
        }

        let Now = performance.now();
        let Varcount = 0;
        let Protected = [];
        let AlreadyProtected = new Map();
        let AlreadyProtectedGlobals = new Map();
        let CompilerExpr = {};
        let Info = {
            JMP: 0,
            ENC: 0,
            MATH: 0,
            GLB: 0
        };

        try {
            luaparse.parse(Script, {
                locations: true,
                luaVersion: "5.1",
                encodingMode: "pseudo-latin1",
                ranges: true
            });
        } catch (er) {
            return reject(er.toString());
        }
        
        let BackupScript = Script;
        let ScriptVariableCount = 0;
        let MacroCount = 0;
        luaparse.parse(Script, { 
            locations: true,
            luaVersion: "5.1",
            encodingMode: "pseudo-latin1",
            ranges: true,
            onCreateNode: (node) => {
                switch (node.type) {
                    case "LocalStatement":
                        ScriptVariableCount++;
                        break;
                    case "CallExpression":
                        if (!node.base || !node.arguments) break;

                        if (node.base.name === "JSEC_FireServer") {
                            MacroCount++;
                            if (MacroArgCheck(node, 0, "Identifier")) return;
                            break;
                        }

                        if (node.base.name === "PROTECT_TABLE") {
                            MacroCount++;
                            if (MacroArgCheck(node, 0, "TableConstructorExpression")) return;
                            break;
                        }

                        if (node.base.name === "LS_ENCSTR") {
                            MacroCount++;
                            let ToEncrypt = node.arguments[0];
                            let InLine = node.arguments[1];

                            if (MacroArgCheck(node, 0, "StringLiteral") || MacroArgCheck(node, 1, "BooleanLiteral", false)) return;
                            
                            if (AlreadyProtected.has(ToEncrypt.value)) {
                                Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), AlreadyProtected.get(ToEncrypt.value));
                                break;
                            }

                            let VM = str(ToEncrypt.value, isdebug, fingerprint);
                            if ((!InLine || !InLine.value) && ScriptVariableCount < 150) {
                                Protected.push(`local ACE_STR_${Varcount} = ${VM}`);
                                Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), `ACE_STR_${Varcount}`);
                            } else {
                                Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), `${VM}`);
                            }

                            AlreadyProtected.set(ToEncrypt.value, (!InLine || !InLine.value) && ScriptVariableCount < 150 ? `ACE_STR_${Varcount}` : VM);
                            Varcount++;
                            break;
                        }

                        if (node.base.name === "LS_HIDEGLOBAL") {
                            MacroCount++;
                            let ToEncrypt = node.arguments[0];

                            if (MacroArgCheck(node, 0, "Identifier")) return;

                            if (AlreadyProtectedGlobals.has(ToEncrypt.name)) {
                                Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), AlreadyProtectedGlobals.get(ToEncrypt.name));
                                break;
                            }

                            let VM = str(ToEncrypt.name, isdebug, fingerprint);

                            Protected.push(`local ACE_GLOBAL_${Varcount} = _env[${VM}]`);
                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), `ACE_GLOBAL_${Varcount}`);
                            AlreadyProtectedGlobals.set(ToEncrypt.name,  `ACE_GLOBAL_${Varcount}`);
                            Varcount++;
                            break;
                        }



                        if (node.base.name === "JUNK_CODE") {
                            MacroCount++;
                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), `${str(randomUUID().slice(0, 4), isdebug, fingerprint)}`);
                            break;
                        } 

                        /*
                        if (node.base.name === "OPCODE_SPAM") {
                            let Name = node.arguments[0];
                            let Count = node.arguments[1];

                            if (MacroArgCheck(node, 0, "StringLiteral") || MacroArgCheck(node, 1, "NumericLiteral")) return;

                            if (Name.value.match(/[\W\d]+/)) {
                                return AceError(node, "attempt to escape path");
                            }

                            if (Name.value.match(/(?:PRN|AUX|CLOCK\$|NUL|CON|COM\d|LPT\d)/)) {
                                return AceError(node, "invalid path (includes windows reserved file name)");
                            }

                            if (!existsSync(path.join(__dirname, `obfuscator/opflush/${Name.value.toUpperCase()}.js`))) {
                                return AceError(node, `unsupported opcode (${Name.value})`);
                            }

                            let OPInfo = require(`./obfuscator/opflush/${Name.value.toUpperCase()}`);
                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), `for i=1, ${Count.raw} do ${OPInfo()} end`);
                            break;
                        }
                        */

                       
                        if (node.base.name === "LS_SECUREREQUEST") {
                            let Table = node.arguments[0];

                            if (MacroArgCheck(node, 0, "TableConstructorExpression")) return;

                            let Generated = "if getfenv(0) ~= _env then return end;\n";
                            let Inter = 0;
                            for (let [i,v] of Object.entries(ParseTable({Table}))) {
                                let Value = typeof(v) !== "object" ? `${typeof(v) == "string" ? `${str(v, isdebug, fingerprint)}`: v}` : ParseObjectToLua(v, fingerprint);
                                Generated += `${Inter == 0 ? "if" : "elseif"} idx == ${str(i, isdebug, fingerprint)} then\nreturn ${Value}\n`;
                                Inter++;
                            }
                            Generated += "\nend";
                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), `_env[INTERNAL_ARG_HIDE("HIDE:request")](_env[INTERNAL_ARG_HIDE("HIDE:setmetatable")]({}, { [INTERNAL_ARG_HIDE("HIDE:__index")] = function(self, idx)\n${Generated}\nend }))`)
                            break;
                        }
                        

                        if (node.base.name === "CMP_EXPR") {
                            MacroCount++
                            let Name = node.arguments[0];
                            let Value = node.arguments[1];

                            if (MacroArgCheck(node, 0, "StringLiteral") || MacroArgCheck(node, 1, "StringLiteral")) return;

                            CompilerExpr[Name.value] = Value.value;
                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), "");
                            break;
                        }

                        break;
                    case "Identifier":
                        if (CompilerExpr[node.name]) {
                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), `"${CompilerExpr[node.name]}"`)
                        }
                        break;
                    default: 
                        break;
                }
            },
        });

        //debug(`Every encrypted string makes up ${BytestringSize / 1000}kb`)
        BackupScript = Script;
        
        luaparse.parse(Script, {
            locations: true,
            luaVersion: "5.1",
            encodingMode: "pseudo-latin1",
            ranges: true,
            onCreateNode: (node) => {
                switch (node.type) {
                    case "FunctionDeclaration": {
                        if (!node.identifier || !node.identifier.name) break;

                        let Body = "";
                        node.body.forEach(ment => {
                            Body = Body + BackupScript.slice(ment.range[0], ment.range[1]) + "\n"
                        });
    
                        let Params = [];
                        node.parameters.forEach(par => {
                            Params.push(par.type == "Identifier" ? par.name : par.raw)
                        })
                        Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), `${node.isLocal ? "local ": ""}${node.identifier.name} = JSEC_ProtectFunction(function(${Params.join(",")})\n${Body}\nend)`);    
                    }
                }
            }
        });

        Script = include() + "\n\n" + Script;
        Script = Script.replace(/ACEINTEGRITY/g, randomUUID().replace(/[^A-z]/g, ""))
        BackupScript = Script;

        /*
        luaparse.parse(Script, { 
            locations: true,
            luaVersion: "5.1",
            encodingMode: "pseudo-latin1",
            ranges: true,
            onCreateNode: (node) => {
                switch (node.type) {
                    case "FunctionDeclaration": 
                    case "Chunk":
                        function ControlFlow(node, recursion) {
                            let Chunks = [];
                            let CurrentChunk;
                            let Start;
    
                            for (let statement of node.body) {
                                if (statement.type == "CallStatement" && statement.expression.base.name == "CF_START") {
                                    Start = statement.loc.start.line;
                                    CurrentChunk = [];
                                    Script = Script.replace(BackupScript.slice(statement.range[0], statement.range[1]), "");
                                    continue
                                } else if (statement.type == "CallStatement" && statement.expression.base.name == "CF_END" && CurrentChunk) {
                                    MacroCount++;
                                    Chunks.push(CurrentChunk);
                                    Script = Script.replace(BackupScript.slice(statement.range[0], statement.range[1]), "");
                                    debug("MAIN", `detected cf chunk (${node.identifier ? `name: '${node.identifier.name}' @ ` : ""}${Start}:${statement.loc.start.line}) (statements: ${CurrentChunk.length})`);
                                    CurrentChunk = null;
                                    continue
                                } else if (CurrentChunk && !CurrentChunk.length && statement == node.body[node.body.length - 1]) {
                                    return AceError(node, "cf chunk must end with 'CF_END'")
                                }
    
                                if (CurrentChunk) {
                                    CurrentChunk.push(statement);
                                }
                            }
    
                            for (let Body of Chunks) {
                                if (!Body) {
                                    return AceError(node, "incorrect macro usage")
                                }
    
                                let Index = 0;
                                let Statements = [];
                                let LocalStatements = [];
                                for (let statement of Body) {
                                    if (statement.type == "LocalStatement" || statement.type == "FunctionDeclaration") {
                                        LocalStatements.push(BackupScript.slice(statement.range[0], statement.range[1]));
                                        continue;
                                    } else if (statement.type == "ForNumericStatement") {
                                        let name = statement.variable.name;
                                        let start = statement.start.value;
                                        let end = statement.end.value || statement.end.name;
                                        let body = "";
                                        
                                        statement.body.forEach(ment => {
                                            body = body + BackupScript.slice(ment.range[0], ment.range[1]);
                                        });
    
                                        let newstatement = `local ${name} = OBFUSCATE_INT(${start}); repeat ${body} ${name} = ${name} + OBFUSCATE_INT(${statement.step ? statement.step : 1}) until ${name} == ${end} and _ENUM >= OBFUSCATE_INT(${random.int(1, 10)})`
                                        Statements.push({ statement: newstatement, Old: Index, New: random.int(1, 999999) });
                                        Index++;
                                        continue;
                                    } else if (statement.type == "FunctionDeclaration") {
                                        console.log("Recursive control flow detected!!!")
                                        Statements.push({ statement: ControlFlow(statement, true), Old: Index, New: random.int(1, 999999) });
                                        continue;
                                    }
    
                                    Statements.push({ statement: BackupScript.slice(statement.range[0], statement.range[1]), Old: Index, New: random.int(1, 999999) });
                                    Index++;
                                }

                                Statements.push({ statement: `if _CF ~= OBFUSCATE_INT(1) then _ENUM = OBFUSCATE_INT(${random.int(1, 9999999)}); continue end;`, Old: Index, New: random.int(1, 999999) });
                                Index++

                                for (let i=1; i <= random.int(1, 3); i++) {
                                    Statements.push({ statement: "", Old: Index, New: random.int(1, 999999) });
                                    Index++
                                }
        
                                let EntireRange = [Body[0].range[0], Body[Body.length - 1].range[1]];
        
                                let Loop = readFileSync(path.join(__dirname, "/obfuscator/cf/include.lua"), "utf-8");
                                let Raw = Object.values(Statements).sort((a, b) => a.New - b.New);
                                let End = Raw[0].New - random.int(1, Raw[0].New - 1);
                                let VMShit = "if _ENUM <= 0 then\nreturn;\n";
                                let PC = random.int(1, 9999999);
                                Raw.forEach((v, i) => {
                                    let Next = Raw.find(a => a.Old == v.Old + 1); 
                                    let OhGod = "";
                                    let Amount = random.int(1, 3);
                                    for (let i=1; i <= Amount; i++) {
                                        let Bigger = random.int(0, 1) == 1;
                                        OhGod += `if _ENUM ${Bigger ? "<=" : ">="} OBFUSCATE_INT(${v.New + (Bigger ? random.int(1, 100) : -random.int(1, 100)) + PC}, _PC) then\n`;
                                    }
                                    VMShit += `elseif _ENUM <= OBFUSCATE_INT(${v.New + PC}, _PC) then\n${OhGod} ${v.statement.trim()} _ENUM = OBFUSCATE_INT(${(Next?.New || End)}); ${"end\n".repeat(Amount)}\n\n${i === Raw.length - 1 ? "end" : ""}`;
                                });
    
                                Loop = Loop.replace("--Opcodes", VMShit)
                                    .replace("--Variables", LocalStatements.join("\n"))
                                    .replace("_START", Statements[0].New)
                                    .replace("_END", End)
                                    .replace("PC_START", PC)
                                    .replace(/_PC/g, `P_${random.int(1, 9999)}_`)
                                    .replace(/_ENUM/g, `E_${random.int(1, 9999)}_`);
                                
                                if (recursion) {
                                    return Loop;
                                }

                                Script = Script.replace(BackupScript.slice(EntireRange[0], EntireRange[1] + 1), Loop);
                            }
                        }

                        ControlFlow(node)

                        //console.log(JSON.stringify(Body, null, 4));
                        break;
                    default: 
                        break;
                }
            },
        });
        */

        function ApplyCF(body) {
            //console.log(body);

            let Index = 0;
            let Statements = [];
            let LocalStatements = [];

            for (let node of body) {
                if (node.type == "LocalStatement" || node.type == "FunctionDeclaration") {
                    LocalStatements.push(BackupScript.slice(node.range[0], node.range[1]));
                    Index++;
                    continue;
                } else if (node.type === "CallStatement" && node.expression.type == "CallExpression" && node.expression.base.name === "LS_CFINNER") {
                    let Function = node.expression.arguments[0];
                    if (MacroArgCheck(node.expression, 0, "FunctionDeclaration")) return;

                    Statements.push({ statement: ApplyCF(Function.body), Old: Index, New: random.int(1, 999999) });
                    Index++;
                    continue;
                }

                Statements.push({ statement: BackupScript.slice(node.range[0], node.range[1]), Old: Index, New: random.int(1, 999999) });
                Index++;
            }

            let Loop = readFileSync(path.join(__dirname, "/obfuscator/cf/include.lua"), "utf-8");
            let Raw = Object.values(Statements).sort((a, b) => a.New - b.New);
            let End = Raw[0].New - random.int(1, Raw[0].New - 1);
            let VMShit = "if _ENUM <= 0 then\nreturn;\n";
            let PC = random.int(1, 9999999);
            Raw.forEach((v, i) => {
                let Next = Raw.find(a => a.Old == v.Old + 1); 
                let OhGod = "";
                let Amount = random.int(1, 3);
                for (let i=1; i <= Amount; i++) {
                    let Bigger = random.int(0, 1) == 1;
                    OhGod += `if _ENUM ${Bigger ? "<=" : ">="} OBFUSCATE_INT(${v.New + (Bigger ? random.int(1, 100) : -random.int(1, 100)) + PC}, _PC) then\n`;
                }
                VMShit += `elseif _ENUM <= OBFUSCATE_INT(${v.New + PC}, _PC) then\n${OhGod} ${v.statement.trim()} _ENUM = OBFUSCATE_INT(${(Next?.New || End)}); ${"end\n".repeat(Amount)}\n\n${i === Raw.length - 1 ? "end" : ""}`;
            });

            Loop = Loop.replace("--Opcodes", VMShit)
                .replace("--Variables", LocalStatements.join("\n"))
                .replace("_START", Statements[0].New)
                .replace("_END", End)
                .replace("PC_START", PC)
                .replace(/_PC/g, `P_${random.int(1, 9999)}_`)
                .replace(/_ENUM/g, `E_${random.int(1, 9999)}_`);
        
            return Loop;
        }

        console.log(Script)

        luaparse.parse(Script, { 
            locations: true,
            luaVersion: "5.1",
            encodingMode: "pseudo-latin1",
            ranges: true,
            onCreateNode: (node) => {
                switch (node.type) {
                    case "CallExpression": {
                        if (node.base.name === "LS_CF") {
                            console.log(node)
                            MacroCount++

                            let Function = node.arguments[0];
                            if (MacroArgCheck(node, 0, "FunctionDeclaration")) return;

                            Script = Script.replace(BackupScript.slice(node.range[0], node.range[1]), ApplyCF(Function.body));
                            break;
                        }
                    }
                }
            },
        });

    

        Script = Script.replace("--#TEMPVARS", Protected.sort(() => Math.random() - 0.5).join("\n"));
        Protected = [];
        Varcount = 0;
        AlreadyProtected = new Set()

        let _ARGKEY = random.int(1, 3);
        function ArgEncrypt(str) {
            let ExtraKey = random.int(0, 1);
            
            return `"${ExtraKey}${str.split("").map(a => String.fromCharCode(a.charCodeAt() + _ARGKEY + ExtraKey)).join("")}"`;
        } 

        AlreadyProtected.clear();

        Script = Script.replace(/IS_ACE/g, "true");
        Script = Script.replace("_ARGKEY", _ARGKEY);
        for (let match of Script.matchAll(/OBFUSCATE_INT\((\d+)\)/g)) {
            Script = Script.replace(match[0], await amg(parseInt(match[1])));
        }

        for (let match of Script.matchAll(/OBFUSCATE_INT\((\d+), ([_\w\d]+)\)/g)) {
            Script = Script.replace(match[0], await amg(parseInt(match[1]), false, match[2]));
        }

        Script = Script.replace(/__fingerprint/g, `Cz4a=${Buffer.from(fingerprint || "hi", "utf-8").toString("base64")}`); // Just incase they don't encrypt a string.

        let HideArgs = [];
        Varcount = 0;
        AlreadyProtected.clear();
        for (let match of Script.matchAll(/INTERNAL_ARG_HIDE\((.*?)\)/g)) {
            if (AlreadyProtected.has(match[0])) continue;
            let ArgName = `p${Varcount}`;
            let Value = match[1];

            if (Value.match(/("|'|\[\[)(?<str>.*)("|'|\]\])/)) {
                let M = Value.match(/("|'|\[\[)(?<str>.*)("|'|\]\])/);
                if (M.groups.str.startsWith("HIDE:")) {
                    Value = ArgEncrypt(M.groups.str.slice(5));
                    ArgName = `_ARG_DECRYPT(p${Varcount})`
                }
            }

            HideArgs.push({ arg: Value, index: `p${Varcount}`});
            Script = Script.replace(new RegExp(escapeRegExp(match[0]), "g"), ArgName);
            AlreadyProtected.add(match[0]);
            Varcount++;
        }

        //let FakeArgShit = ["getcaller", "debug.getprotos", "islclosure", "utf8", random.int(1, 99999), `"${randomBytes(20).toString("hex")}"`, "byte", "0x90", "__index", "setmetatable", "getconstants", "table.concat"].sort(() => Math.random() - 0.5);
        let FakeArgShit = ["dfs", "getmetatable", "debug", "setmetatable", "table", "table.concat", "islclosure", "getprotos", "string", "getcall", "deobfuscate_proto"]
        for (let string of FakeArgShit) {
            let ArgName = `p${Varcount}`;
            HideArgs.push({ arg: string, index: ArgName });
            Varcount++;
        }

        for (let match of Script.matchAll(/FAKE_ARG/g)) {
            Script = Script.replace(match[0], HideArgs[random.int(1, HideArgs.length - 1)].index)
        }

        let [arguments, calling] = [[], []];
        for (let data of HideArgs.sort(() => Math.random() - 0.5)) {
            arguments.push(data.index);
            calling.push(data.arg);
        }

        Script = `return (function(${arguments.join(", ")}, ...)\n${Script}\nend)(${calling.join(", ")}, ...)`;

        Info.Time = performance.now() - Now;

        try {
            Script = luamin.Minify(Script, {
                RenameVariables: true,
                RenameGlobals: false,
                SolveMath: false
            });
        } catch (er) {
            return reject("Luamin error (prob incorrect macro usage): " + er.toString());
        }

        Script = `${Script}`;
        debug("MAIN", `Finished (output size: ${Script.length / 1000})`);
        
        resolve({
            Output: Script,
            Info: Info
        });
    });
}

/*


console.log(parser.parse(Script, {
    locations: true,
    comments: false
}).body[0].expression.arguments)
*/