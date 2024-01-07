local a = LS_HIDEGLOBAL(print)

for i=1,100 do
	a(LS_ENCSTR("Hello World"))
end;

LS_CF(function() 
	print("he")
print("he")
end)