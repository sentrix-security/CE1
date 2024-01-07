const { readFileSync, readdirSync } = require("fs");
const path = require("path");
const random = require("random");
const luamin = require("luamin");
const genvm = require("./VM/vm");

let Opcodes = readdirSync(path.join(__dirname, "/VM/op"));

function debug(context, ...any) {
    let t = new Date();
    console.log(`[${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}]${context ? ` [${context}]`: ""}`, ...any);
}

function GenerateBytecode(str, keys, shuffled, fingerprint) {
    let stream = [];

    let gBits8 = (v) => stream.push(v);
    let gInt = (v) => stream.push(v.toString().length, v);

    gInt(fingerprint ? parseInt(fingerprint.slice(0, fingerprint.length / 2)) : 0);
    gInt(fingerprint ? parseInt(fingerprint.slice(fingerprint.length / 2)) : 0);

    str.split("").forEach(c => {
        let CharCode = c.charCodeAt() + keys._CharCodeKey;
        let Type = random.int(1, 6);

        //console.log(shuffled[Type], Type);
        gInt(shuffled[Type].New);

        switch (Type) {
            case 1:
                gInt(CharCode + keys._KeyOP1);
                break;
            case 2:
                gInt(CharCode + keys._KeyOP2);
                break;
            case 3:
                gInt(CharCode + keys._KeyOP3);
                break;
            case 4: {
                let [A, B, Key] = [random.int(1, 9), random.int(1,9)]
                Key = (A < B) ? B : A;
                gBits8(A);
                gBits8(B);
                gInt(CharCode + keys._KeyOP4 + Key);
                gInt(random.int(1, 255) + keys._CharCodeKey);
                break;
            }
            case 5: {
                let psuedo = random.int(0, 1);
                let key = psuedo !== 0 ? keys._KeyOP5 : keys._KeyOP5_1;
                gBits8(psuedo);
                gInt(CharCode + key);
                break;
            }
            case 6: {
                let [A, B] = [random.int(1, 9), random.int(1, 9)];
                gBits8(A);
                gBits8(B);
                gInt(CharCode + Math.pow(A, B));
                break;
            }

        }
    });

    gInt(0);
    return stream.join("");
}

let Total = 0;

function Encrypt(str, isdebug, fingerprint) {

    let VM = genvm();
    let RawOpcodes = {};
    let keys = {
        _CharCodeKey: random.int(1, 999),
        _KeyOP1: random.int(1, 999),
        _KeyOP2: random.int(1, 999),
        _KeyOP3: random.int(1, 999),
        _KeyOP4: random.int(1, 999),
        _KeyOP5: random.int(1, 999),
        _KeyOP5_1: random.int(1, 999)
    }

    if (keys._KeyOP3_1 % 2 < 1) {
        keys._KeyOP3_1 -= 1;
    } 
    
    for (let i=1; i <= Opcodes.length; i++) {
        RawOpcodes[i] = { Old: i, New: random.int(1, 999) }
    }

    let Bytecode = GenerateBytecode(str, keys, RawOpcodes, fingerprint);
    Total += Bytecode.length;
    if (isdebug) {
        debug("MAIN", `Encrypting "${str}" (${Total / 1000}kb)`);
    }
    
    let Raw = Object.values(RawOpcodes).sort((a, b) => a.New - b.New);
    let VMShit = `if Enum <= OBFUSCATE_INT(${Raw[0].New - random.int(1, Raw[0].New - 1)}) then\nwhile offset ~= OBFUSCATE_INT(${Bytecode.length + 1}) do end\nreturn f\n`;

    Raw.forEach((v, i) => {
        let Content = readFileSync(path.join(__dirname, `/VM/op/OP${v.Old}.lua`), "utf-8");
        if (random.int(0, 1) == 1) {
            let ExtraShit = `if Enum <= OBFUSCATE_INT(${v.New + random.int(1, 999)}) then\n_content\nend`;
            for (let i=1; i <= random.int(2, 4); i++) {
                let Type = random.int(0, 1);
                let c = `if Enum ${Type == 0 ? ">=" : "<="} OBFUSCATE_INT(${Type == 0 ? v.New - random.int(1, v.New) : v.New + random.int(1, v.New)}) then\n_content`;
                ExtraShit = ExtraShit.replace("_content", c + " end");
            }
            Content = ExtraShit.replace("_content", Content);
        }
        VMShit += `elseif Enum <= OBFUSCATE_INT(${v.New}) then\n${Content} ${i === Raw.length - 1 ? "end" : ""}`;
    });

    VM = VM.replace("_BYTECODE", Bytecode)
    .replace("--_Opcodes", VMShit)

    for (let [i, v] of Object.entries(keys)) {
        VM = VM.replace(i, `OBFUSCATE_INT(${v})`);
    }

    return luamin.minify(VM);
}

module.exports = Encrypt;