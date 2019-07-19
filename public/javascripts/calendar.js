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
	cell1.setAttribute("id", "1");
	var cell2 = row.insertCell(1);
	cell2.setAttribute("id", "2");
	var cell3 = row.insertCell(2);
	cell3.setAttribute("id", "3");
	var cell4 = row.insertCell(3);
	cell4.setAttribute("id", "4");

	// Add some text to the new cells:
 	cell1.innerHTML = data.subject
 	cell2.innerHTML = data.start.dateTime
 	cell3.innerHTML = data.end.dateTime
 	cell4.innerHTML = ' <a class="btn" href="#edit_event" data-toggle="modal" data-target="#edit_event"><i class="icon-edit"></i> Edit</a> '
}

$('#edit_event').on('show.bs.modal', function (e) {

    var _button = $(e.relatedTarget);

    // console.log(_button, _button.parents("tr"));
    var _row = _button.parents("tr");
    var subject = _row.find("#1").text();
    var id = _row.attr('id');
    // console.log(_invoiceAmt, _chequeAmt);

    $(this).find("#modal_subject").val(subject);
    $(this).find("#event_id").val(id);
  
});