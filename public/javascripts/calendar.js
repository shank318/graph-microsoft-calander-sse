var source = new EventSource("/events/");
source.onmessage = function(e) {
	var data = JSON.parse(e.data);
	console.log(data);
	if (data.changeType === "deleted") {
		deleteRow(data)
	}else if(data.changeType === "updated") {
		editRow(data);
	}else if(data.changeType === "created") {
		createRow(data)
	}
};

function editRow(data) {
	var row = document.getElementById(data.id);
 	row.cells[0].innerHTML = data.subject
 	row.cells[1].innerHTML = data.start.dateTime
 	row.cells[2].innerHTML = data.end.dateTime
}

function deleteRow(data) {
 	$("#" + data.id).remove();
}

function createRow(data) {
	var table = document.getElementById("event-table");
	var row =   table.insertRow(1);
	row.setAttribute("id", data.id);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);

	// Add some text to the new cells:
 	cell1.innerHTML = data.subject
 	cell2.innerHTML = data.start.dateTime
 	cell3.innerHTML = data.end.dateTime
 	cell4.innerHTML = ' <a class="btn" href="#edit_event" data-toggle="modal" data-target="#edit_event"><i class="icon-edit"></i> Edit</a> '
}