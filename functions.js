var table = document.getElementById("myTable");
if (typeof (Storage) !== "undefined") {
	if (localStorage.table) {
		table.innerHTML = localStorage.table;
	}
}

function callback(word, translation) {
	console.log(word, translation);
	var row = table.insertRow();
	var cell = row.insertCell(0);
	var translationFormatted = translation.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "").replace(/\s\s+/g, ' ').replace(/\r\n|\n|\r|\t\+/g, ';').replace(' &nbsp; ', '; ');
	cell.innerHTML = "Literally " + "'" + word + "'" + " means " + '"' + translationFormatted + '"';
	console.log(translationFormatted)
	localStorage.table = table.innerHTML;
}

function myFunction() {
	input = document.getElementById("textareaInput");
	words = input.value.split(",");
	for (i in words) {
		var translator = new babylonTranslator();
		translator.translate(3, 0, words[i], 'callback');
	}
	input.value = "";
}

function downloadCSV(csv, filename) {
	var csvFile;
	var downloadLink;
	csvFile = new Blob([csv], { type: "text/csv" });
	downloadLink = document.createElement("a");
	downloadLink.download = filename;
	downloadLink.href = window.URL.createObjectURL(csvFile);
	downloadLink.style.display = "none";
	document.body.appendChild(downloadLink);
	downloadLink.click();
}

function exportTableToCSV(filename) {
	var csv = [];
	var rows = document.querySelectorAll("table tr");
	for (var i = 1; i < rows.length; i++) {
		var row = [], cols = rows[i].querySelectorAll("td, th");
		for (var j = 0; j < cols.length; j++)
			row.push(cols[j].innerText);
		csv.push(row.join(","));
	}
	downloadCSV(csv.join("\n"), filename);
}

function importData() {
	var element = document.createElement('div');
	element.innerHTML = '<input type="file">';
	var fileInput = element.firstChild;
	fileInput.addEventListener('change', function () {
		var file = fileInput.files[0];
		if (file.name.match(/\.(txt|json)$/)) {
			var reader = new FileReader();
			reader.onload = function () {
				var lines = this.result.split('\n');
				for (var line = 0; line < lines.length; line++) {
					var row = table.insertRow();
					var cell = row.insertCell(0);
					cell.innerHTML = lines[line];
					localStorage.table = table.innerHTML;
				}
			};
			reader.readAsText(file);
		} else {
			alert("File not supported, .txt or .json files only");
		}
	});
	fileInput.click();
}

function clearData() {
	var r = confirm("Are you sure you want to clear the table?");
	if (r == true) {
		localStorage.table = "";
		table.innerHTML = '<thead class="thead-light"><tr><th scope="col">Word</th></tr></thead>';
	} else {
	}
}

$('#textareaInput').focus().on('blur', function () {
	$(this).focus();
});
$('button').on('click', function () {
})
$(document).ready(function () {
	$("#textModal").on('shown.bs.modal', function () {
		$(this).find('#textareaInput').focus();
	});
});

document.addEventListener('copy', function (e) {
	const text_only = document.getSelection().toString();
	const clipdata = e.clipboardData || window.clipboardData;
	clipdata.setData('text/plain', text_only);
	e.preventDefault();
});