var source = new EventSource("/events/");
source.onmessage = function(e) {
	var obj = JSON.parse(e.data);
	console.log(obj);

	var row = document.getElementById(obj.id);
 	row.cells[0].innerHTML = obj.subject
 	row.cells[1].innerHTML = obj.start.dateTime
 	row.cells[2].innerHTML = obj.end.dateTime
};