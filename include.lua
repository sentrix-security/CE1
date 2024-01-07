local function OBFUSCATE_GLOBAL(x) return x; end;
local function OBFUSCATE_STR(x) return x; end;
local function OBFUSCATE_INT(x) return x; end;
local function CMP_EXPR(i, v) getfenv(0)[i] = v; end;
local function OPCODE_SPAM() end;
local function JUNK_CODE() end;
local function SECURE_REQUEST(x) return syn.request(x) end;