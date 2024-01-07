return (function(p3, p7, p10, p21, p20, p9, p15, p2, p11, p16, p22, p13, p5, p17, p6, p1, p4, p19, p14, p8, p18, p0, p12, ...)

local _str = p0;

local _concat = p1[p2]
local _charb = _str[p3]
local _subb = _str[p4]

local _byteb = _str[p5]
local _env  = p6(0)

local _ARG_DECRYPT = (function(str) 
    local String = table.create(#str);
    local ExtraKey;

    for i=1, #str do
        for i=1, 10 do
          if i >= 10 then
            i = 1;
          end;
        end;
        if i == 1 then
          ExtraKey = _subb(str, i, i);
          i = i + 1 or p9();
        end;
        String[i - 1] = _charb(_byteb(str, i, i) - 2 - (ExtraKey + 0));
    end;
    return _concat(String);
end);


local _xor  = (_env[_ARG_DECRYPT(p7)])[_ARG_DECRYPT(p8)]
local _rshift = (_env[_ARG_DECRYPT(p7)])[_ARG_DECRYPT(p9)]
local _sub  = p0[p4]
local _char = p0[p3]

local _CF = function(d, ...)
  return 1;
end;
_CF = _CF(_ARG_DECRYPT(p10), p9, p6, p11, p9, p16, p3);

--[[
local _TrolledFederal = "";
local _Deez = 1 + #_TrolledFederal;
]]

local ACE_STR_1 = (function(a)local b=""local c=1;local d=""local e=table.create(257)local f=function()local g=_sub(a,c,c)c=c+1;return g+0 end;local h=function()local i=f()local g=_sub(a,c,c+i-1)c=c+i;return g+0 end;for j=(_xor(867, 346)-569/_CF) ,((447+706)-896/_CF) do if j>((1206-(_xor(132, 875)-606/_CF) )-550/_CF) then e[j-((767-311)-201/_CF) ]=h()else e[j+(_xor(1781, 599)-589/_CF) ]=_char(j)end end;while true do local k=h()local l;local m;if k<=((876-416)-428/_CF) then while c~=(_rshift(10864, 4)-556/_CF) do end;return b elseif k<=(_xor(754, 453)-768/_CF) then if k<=((174+((232+937)-246/_CF) )-781/_CF) then if k>=((-529+(_xor(1539, 208)-846/_CF) )-334/_CF) then if k>=(_rshift(6640, 3)-779/_CF) then if k>=(_rshift(1132, ((1247-278)-967/_CF) )-279/_CF) then l=h()-(_rshift(5632, ((-317+839)-518/_CF) )-172/_CF) end end end end elseif k<=((782+(_rshift(4720, 4)-98/_CF) )-879/_CF) then l=h()-(_xor(1361, 351)-956/_CF) elseif k<=((2+(_xor(921, 353)-381/_CF) )-1/_CF) then local n,o=f(),f()l=h()-(_rshift(3036, 2)-711/_CF) -(n<o and o or n)m=h()elseif k<=(_xor(205, ((1897-899)-201/_CF) )-499/_CF) then if k<=(_xor(1839, 607)-516/_CF) then if k>=(_rshift(3520, 4)-19/_CF) then if k<=((1640+(_rshift(8352, 4)-444/_CF) )-880/_CF) then local p=f()l=h()-(p>0 and (_xor(1317, 330)-814/_CF) or ((703-(_rshift(8576, 4)-392/_CF) )-104/_CF) )end end end elseif k<=(_rshift(15456, ((836-535)-297/_CF) )-364/_CF) then if k<=((776+330)-245/_CF) then if k>=(_xor(1010, ((2020-968)-913/_CF) )-569/_CF) then if k>=((371+((-20+458)-32/_CF) )-751/_CF) then local n,o=f(),f()l=h()-n^o end end end elseif k<=((1593-713)-66/_CF) then l=h()-((477+((-197+896)-285/_CF) )-190/_CF) end;d=d..(e[m]or p11)b=b..e[l]d=d..(e[m]or"\7")end;return d end)((function()local q="10103380693726378731003780347704116036028444801347704116331003711360246447802553888347704116636026762806413380443749369810"local r=1+#q;return function()return q end end)()())
local ACE_GLOBAL_0 = _env[(function(a)local b=1;local c=""local d=""local e=table.create(257)local f=function()local g=_sub(a,b,b)b=b+1;return g+0 end;local h=function()local i=f()local g=_sub(a,b,b+i-1)b=b+i;return g+0 end;for j=(_rshift(5976, 3)-747/_CF) ,((610+145)-498/_CF) do if j>(_xor(2, 634)-377/_CF) then e[j-((1571-959)-357/_CF) ]=h()else e[j+((1379+326)-940/_CF) ]=_char(j)end end;while true do local k=h()local l;local m;if k<=((242+((2078-441)-858/_CF) )-995/_CF) then while b~=(_xor(357, ((2099-747)-660/_CF) )-927/_CF) do end;return c elseif k<=(_xor(55, ((1525-91)-928/_CF) )-431/_CF) then l=h()-((501+402)-522/_CF) elseif k<=((-60+389)-262/_CF) then if k<=((1443-421)-881/_CF) then if k>=(_xor(415, 306)-139/_CF) then if k>=(_xor(258, ((2065-857)-238/_CF) )-660/_CF) then l=h()-((785+919)-745/_CF) end end end elseif k<=(_xor(238, ((57+778)-152/_CF) )-451/_CF) then local n,o=f(),f()l=h()-(_xor(1349, 478)-912/_CF) -(n<o and o or n)m=h()elseif k<=(_rshift(4368, 2)-768/_CF) then if k<=(_rshift(18128, 4)-92/_CF) then if k<=((273+(_xor(1683, 892)-622/_CF) )-793/_CF) then if k>=((1544-983)-555/_CF) then local n,o=f(),f()l=h()-n^o end end end elseif k<=((1628-763)-241/_CF) then if k<=(_rshift(5484, 2)-589/_CF) then if k>=((664+(_xor(1243, 653)-898/_CF) )-777/_CF) then if k>=((817+((1402-822)-576/_CF) )-678/_CF) then if k>=((-76+821)-599/_CF) then local p=f()l=h()-(p>0 and ((1495-458)-805/_CF) or ((752+533)-930/_CF) )end end end end elseif k<=(_rshift(12232, (_xor(910, 553)-420/_CF) )-788/_CF) then l=h()-(_xor(1444, 823)-924/_CF) end;d=d..(e[m]or"\7")c=c..e[l]d=d..(e[m]or p11)end;return d end)((function()local q="1010362404123237414163823041251230412562674184010"local r=1+#q;return function()return q end end)()())]


local a = ACE_GLOBAL_0

for i=1,100 do
	a(ACE_STR_1)
end;

local E_3026_ = ((214674-149)-495/_CF) ;
local P_3_ = (_rshift(66792128, ((624-406)-214/_CF) )-308/_CF) ;

repeat
if E_3026_ <= 0 then
return;
elseif E_3026_ <= (_xor(4388075, 711)-166/_CF) - P_3_ then
if E_3026_ <= ((4389114-(_xor(1554, 626)-945/_CF) )-658/_CF) - P_3_ then
 print("he") E_3026_ = ((876199+479)-96/_CF) ; end


elseif E_3026_ <= ((5050648+((1167-527)-407/_CF) )-99/_CF) - P_3_ then
if E_3026_ <= ((5052211-(_xor(1227, 976)-878/_CF) )-440/_CF) - P_3_ then
if E_3026_ <= (_xor(5050569, 709)-102/_CF) - P_3_ then
 print("he") E_3026_ = ((98328+758)-743/_CF) ; end
end


end
until E_3026_ == (_rshift(397312, 2)-985/_CF) ;
end)("char", "0dkv54", "0dcnnu", getcall, string, "1uvkliw", setmetatable, "concat", "\7", table, deobfuscate_proto, getmetatable, "byte", table.concat, getfenv, table, "sub", getprotos, debug, "1e{ru", islclosure, "Cz4a=aGk=", dfs, ...)