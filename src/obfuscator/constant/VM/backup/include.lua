local _bit  = bit or bit32 or require("bit");
local _sub  = string.sub;
local _char = string.char;
local _xor  = _bit.bxor
local _info = debug.getinfo;
local _env  = (getfenv or (function() return _ENV end))(1);
local _wrap = coroutine and coroutine.wrap;
local _hide = (function(l, deez, ...) 
    local a = {...} and {..., 1 > 2} and {..., ..., ..., ..., 1, ..., ...};
    while true do 
        while true do 
            if l then
                break;
            end;
        end;
        break;
    end;

    local c = false;
    c = c or false;
    repeat until not c;
    if c then
        ({})();
    elseif not c then
        return l or a;
    elseif c then
        while not c do 
            return l
        end
    elseif c then
    end;
    
    if false then
        ({})();
    else
        return l;
    end;
end);
local _CF = _hide(1);

--#TEMPVARS
--#GLOBALVARS