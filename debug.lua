return (function(p3, p6, p17, p12, p11, p22, p19, p7, p0, p21, p1, p4, p18, p16, p2, p9, p10, p20, p13, p8, p5, p14, p15, ...)

local _str = p0;


local _concat = p1[p2]
local _byteb = _str[p3]
local _subb = _str[p4]
local _charb = _str[p5]
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
          i = i + 1 or p21();
        end;
        String[i - 1] = _charb(_byteb(str, i, i) - 1 - (ExtraKey + 0));
    end;
    return _concat(String);
end);



local _char = p0[p5]
local _sub  = p0[p4]
local _rshift = (_env[_ARG_DECRYPT(p7)])[_ARG_DECRYPT(p8)]
local _xor  = (_env[_ARG_DECRYPT(p7)])[_ARG_DECRYPT(p9)]
local _CF = function(d, ...)
  return 1;
end;
_CF = _CF(_ARG_DECRYPT(p10), p15, p19, p9, p21, p6, p17);

--[[
local _TrolledFederal = "";
local _Deez = 1 + #_TrolledFederal;
]]

local ACE_STR_1 = (function(a)local b=""local c=table.create(257)local d=1;local e=""local f=function()local g=_sub(a,d,d)d=d+1;return g+0 end;local h=function()local i=f()local g=_sub(a,d,d+i-1)d=d+i;return g+0 end;for j=(_rshift(3728, (_rshift(416, 2)-102/_CF) )-932/_CF) ,((781-((1679-417)-788/_CF) )-50/_CF) do if j>(_xor(90, 638)-293/_CF) then c[j-(_rshift(6144, 4)-129/_CF) ]=h()else c[j+((1300+(_rshift(8496, 4)-104/_CF) )-910/_CF) ]=_char(j)end end;while true do local k=h()local l;local m;if k<=(_xor(996, (_rshift(9200, 3)-745/_CF) )-540/_CF) then while d~=((974-502)-358/_CF) do end;return e elseif k<=((1650-((1803-149)-655/_CF) )-540/_CF) then m=h()-(_xor(1645, 828)-639/_CF) elseif k<=(_xor(514, ((2070-962)-860/_CF) )-443/_CF) then local n=f()m=h()-(n>0 and (_rshift(22208, (_xor(112, 514)-622/_CF) )-439/_CF) or ((1780-(_xor(846, 690)-261/_CF) )-886/_CF) )elseif k<=(_rshift(18096, ((343-214)-125/_CF) )-661/_CF) then m=h()-(_rshift(8024, ((215-12)-200/_CF) )-191/_CF) elseif k<=(_xor(1233, ((1479-163)-639/_CF) )-968/_CF) then if k<=((1585+78)-747/_CF) then if k<=((2604-800)-926/_CF) then if k<=(_xor(1761, 523)-520/_CF) then if k>=((922+199)-791/_CF) then if k<=((731+((29+864)-329/_CF) )-293/_CF) then m=h()-(_rshift(5296, ((-136+846)-708/_CF) )-870/_CF) end end end end end elseif k<=((1747-145)-757/_CF) then if k<=(_xor(2134, 294)-809/_CF) then if k>=((1363-((282+656)-635/_CF) )-849/_CF) then if k<=((1286+((1687-217)-729/_CF) )-812/_CF) then local o,p=f(),f()m=h()-(_xor(1110, ((-300+713)-346/_CF) )-131/_CF) -(o<p and p or o)l=h()end end end elseif k<=(_rshift(24352, (_xor(669, 986)-323/_CF) )-587/_CF) then if k<=(_rshift(11688, ((519+371)-887/_CF) )-384/_CF) then if k<=((718+(_xor(1630, 952)-556/_CF) )-593/_CF) then if k<=((2068-((1073-327)-256/_CF) )-385/_CF) then if k>=(_xor(1521, 88)-839/_CF) then local o,p=f(),f()m=h()-o^p end end end end end;b=b..(c[l]or"\7")e=e..c[m]b=b..(c[l]or p11)end;return b end)((function()local q="10103684413433319041565368441379384558418473821368441382368441303311141626347041740393511393234704173736844137110"local r=1+#q;return function()return q end end)()())
local ACE_GLOBAL_0 = _env[(function(a)local b=table.create(257)local c=""local d=1;local e=""local f=function()local g=_sub(a,d,d)d=d+1;return g+0 end;local h=function()local i=f()local g=_sub(a,d,d+i-1)d=d+i;return g+0 end;for j=(_rshift(5792, 3)-724/_CF) ,(_rshift(5456, ((-559+688)-126/_CF) )-425/_CF) do if j>(_rshift(7744, (_xor(701, 168)-529/_CF) )-229/_CF) then b[j-(_xor(642, 511)-638/_CF) ]=h()else b[j+(_xor(75, (_xor(1396, 928)-964/_CF) )-458/_CF) ]=_char(j)end end;while true do local k=h()local l;local m;if k<=((1374-800)-466/_CF) then while d~=(_rshift(1696, 4)-45/_CF) do end;return e elseif k<=(_xor(259, 222)-81/_CF) then local n,o=f(),f()l=h()-n^o elseif k<=(_xor(521, 457)-547/_CF) then l=h()-(_xor(585, 296)-98/_CF) elseif k<=(_rshift(21952, 4)-880/_CF) then if k<=(_rshift(28704, ((-813+872)-55/_CF) )-557/_CF) then if k>=(_xor(143, ((1686-571)-474/_CF) )-198/_CF) then if k<=((1569-(_xor(1367, 63)-684/_CF) )-241/_CF) then if k>=((1595-(_xor(988, 32)-51/_CF) )-409/_CF) then l=h()-((1879-((1895-616)-609/_CF) )-990/_CF) end end end end elseif k<=(_xor(554, ((1921-817)-781/_CF) )-65/_CF) then local p=f()l=h()-(p>0 and (_rshift(10040, 3)-485/_CF) or (_xor(1238, (_xor(394, 147)-163/_CF) )-641/_CF) )elseif k<=((1577+189)-932/_CF) then local n,o=f(),f()l=h()-(_rshift(9592, 3)-935/_CF) -(n<o and o or n)m=h()elseif k<=((543+878)-460/_CF) then if k<=((488+((1261-197)-489/_CF) )-65/_CF) then if k>=(_rshift(6244, 2)-914/_CF) then if k<=(_xor(2940, 368)-981/_CF) then if k>=(_rshift(3368, ((654-318)-333/_CF) )-27/_CF) then l=h()-(_xor(678, 313)-874/_CF) end end end end end;c=c..(b[m]or p11)e=e..b[l]c=c..(b[m]or"\7")end;return c end)((function()local q="101039613566383472378634553413412733413412783834543786362210"local r=1+#q;return function()return q end end)()())]


local a = ACE_GLOBAL_0

for i=1,100 do
	a(ACE_STR_1)
end;

local E_7125_ = ((454250+(_xor(1192, 145)-888/_CF) )-92/_CF) ;
local P_8823_ = (_xor(7871645, 657)-745/_CF) ;

repeat
if E_7125_ <= 0 then
return;
elseif E_7125_ <= ((7881880+((259+943)-219/_CF) )-159/_CF) - P_8823_ then
if E_7125_ <= (_rshift(31533492, ((354+581)-933/_CF) )-630/_CF) - P_8823_ then
if E_7125_ >= ((7883441-(_xor(406, 284)-131/_CF) )-753/_CF) - P_8823_ then
 print("he") E_7125_ = ((3975+870)-585/_CF) ; end
end


elseif E_7125_ <= ((8325427+(_xor(709, 87)-348/_CF) )-119/_CF) - P_8823_ then
if E_7125_ >= ((8327210-((1654+67)-927/_CF) )-829/_CF) - P_8823_ then
if E_7125_ >= ((8325946+((1245-659)-488/_CF) )-482/_CF) - P_8823_ then
 print("he") E_7125_ = ((11638+704)-905/_CF) ; end
end


end
until E_7125_ == ((4538+(_xor(751, 325)-410/_CF) )-806/_CF) ;

end)("byte", getfenv, table.concat, dfs, "\7", deobfuscate_proto, getprotos, "1dkv54", "Cz4a=aGk=", getcall, table, "sub", islclosure, table, "concat", "0cyps", "1dcnnu", string, getmetatable, "0stijgu", "char", debug, setmetatable, ...)