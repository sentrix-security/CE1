local a = LS_HIDEFROMGC({});
a.dsf = true;
print(a.dsf);

LS_SECUREREQUEST({
	Url = "https://google.com",
	Method = "GET"
})