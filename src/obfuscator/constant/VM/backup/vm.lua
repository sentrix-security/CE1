(function(Bytecode, Extra, ...) 
    if Extra then  return Extra end;
    
    local f, offset, codes, fake = "", 1, {}, "";
    local self = _info and _info(1).func;

    local function gBits8() 
        local r = _sub(Bytecode, offset, offset);
        offset = offset + 1;
        return r + 0;
    end;

    local function gInt() 
        local len = gBits8();
        local r = _sub(Bytecode, offset, offset + len - 1);
        offset = offset + len;
        return r + 0;
    end;

    for i=0, 257 do
        if i > 255 then
            codes[i - 255] = gInt();
        else
            codes[i + _CharCodeKey] = _char(i);
        end;
    end;

    local endcall = _wrap(function(f) 
        local offset = RANDOM_MATH(1);
        while offset <= RANDOM_MATH(100) do
            if not self then
                offset = RANDOM_MATH(0);
                break;
            end;
            self(0, f);
            offset = offset + 1;
        end;
        if offset < RANDOM_MATH(1) then
            return fake;
        end;
    end);

    while true do
        local Enum = gInt();
        local Code;
        local FCode;

        --[[
                    if Enum == 1 then
            Code = gInt() - KeyOP1;
        elseif Enum == 2 then
            return f;
        end;
        ]]

        --_Opcodes

        fake = fake .. (codes[FCode] or "\7");
        f = f .. codes[Code];
        fake = fake .. (codes[FCode] or codes[RANDOM_MATH(1)]);
        fake = fake .. (codes[FCode] or codes[RANDOM_MATH(2)]);

        if self then
            self(0, fake);
        end;
    end;

    return fake;
end)(_hide("_BYTECODE"))