module.exports = function() {
    return `
(function(Bytecode) 
    ${`
    local f = "";
    local offset = 1;
    local codes = table.create(257);
    local fake = "";
    `.split(";").sort(() => Math.random() - 0.5).join("")}

    local gBits8 = (function() 
        local r = _sub(Bytecode, offset, offset);
        offset = offset + 1;
        return r + 0;        
    end);

    local gInt = (function() 
        local len = gBits8();
        local r = _sub(Bytecode, offset, offset + len - 1);
        offset = offset + len;
        return r + 0;
    end);

    for i=OBFUSCATE_INT(0), OBFUSCATE_INT(257) do
        if i > OBFUSCATE_INT(255) then
            codes[i - OBFUSCATE_INT(255)] = gInt();
        else
            codes[i + _CharCodeKey] = _char(i);
        end;
    end;

    while true do
        local Enum = gInt();
        ${`
        local Code;
        local FCode;
        `.split(";").sort(() => Math.random() - 0.5).join("")}

        --[[
                    if Enum == 1 then
            Code = gInt() - KeyOP1;
        elseif Enum == 2 then
            return f;
        end;
        ]]

        --_Opcodes

        ${`
        fake = fake .. (codes[FCode] or INTERNAL_ARG_HIDE("\\7"));
        f = f .. codes[Code];
        fake = fake .. (codes[FCode] or "\\7");
        `.split(";").sort(() => Math.random() - 0.5).join("")}
    end;

    return fake;
end)((function() local b = "_BYTECODE"; local c = 1 + #b; return (function() return b; end) end)()())
    `
}