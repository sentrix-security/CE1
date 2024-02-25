module.exports = function() { return `
local _str = INTERNAL_ARG_HIDE("__fingerprint");
${`
local _concat = INTERNAL_ARG_HIDE(table)[INTERNAL_ARG_HIDE("concat")];
local _create = INTERNAL_ARG_HIDE(table)[INTERNAL_ARG_HIDE("create")];
local _charb = _str[INTERNAL_ARG_HIDE("char")];
local _byteb = _str[INTERNAL_ARG_HIDE("byte")];
local _subb = _str[INTERNAL_ARG_HIDE("sub")];
local _env  = INTERNAL_ARG_HIDE(getfenv)(0);
`.split(";").sort(() => Math.random() - 0.5).join("")}

local _ARG_DECRYPT = (function(str) 
    local String = _create(#str);
    local ExtraKey;

    for i=1, #str do
        for i=1, 10 do
          if i >= 10 then
            i = 1;
          end;
        end;
        if i == 1 then
          ExtraKey = _subb(str, i, i);
          i = i + 1 or FAKE_ARG();
        end;
        String[i - 1] = _charb(_byteb(str, i, i) - _ARGKEY - (ExtraKey + 0));
    end;
    return _concat(String);
end);

${`
local _xor  = (_env[INTERNAL_ARG_HIDE("HIDE:bit32")])[INTERNAL_ARG_HIDE("HIDE:bxor")];
local _rshift = (_env[INTERNAL_ARG_HIDE("HIDE:bit32")])[INTERNAL_ARG_HIDE("HIDE:rshift")];
local _sub  = INTERNAL_ARG_HIDE("__fingerprint")[INTERNAL_ARG_HIDE("sub")];
local _char = INTERNAL_ARG_HIDE("__fingerprint")[INTERNAL_ARG_HIDE("char")];
local gc;
local hookfunction;
local hidden_funcs = {};
`.split(";").sort(() => Math.random() - 0.5).join("")}
local _CF = function(d, gc, hookfunction, ...)
  return 1, gc, hookfunction;
end;
_CF, gc, hookfunction = _CF(INTERNAL_ARG_HIDE("HIDE:balls"), _env[INTERNAL_ARG_HIDE("getgc")], _env[INTERNAL_ARG_HIDE("hookfunction")], FAKE_ARG, FAKE_ARG, FAKE_ARG, FAKE_ARG, FAKE_ARG, FAKE_ARG);

if hookfunction then
  local b;
  b = hookfunction(gc, function() 
    local t = b();
    for i=1, #t do
      local found = hidden_funcs[t[i]];
      if found then
        t[i] = nil;
      end;
    end;
    return t;
  end);
end;

local function LS_HIDEFROMGC(b) 
  hidden_funcs[#hidden_funcs+1] = b;
  return b;
end

--[[
local _TrolledFederal = "";
local _Deez = 1 + #_TrolledFederal;
]]

--#TEMPVARS
` }