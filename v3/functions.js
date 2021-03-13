var table = document.getElementById("myTable");
if (typeof(Storage) !== "undefined") {
    if (localStorage.table) {
        table.innerHTML = localStorage.table;

    }
}

function callback(word, translation) {
    console.log(word, translation);
    var row = table.insertRow();
    /*var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = word;
    cell2.innerHTML = "literally means";
    cell3.innerHTML = translation
    localStorage.table = table.innerHTML;*/
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
    // CSV file
    csvFile = new Blob([csv], { type: "text/csv" });

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
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

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}

$('#textareaInput').focus().on('blur', function () {
	$(this).focus();
});

$('button').on('click', function () {
	
})

document.addEventListener('copy', function(e) {
  const text_only = document.getSelection().toString();
  const clipdata = e.clipboardData || window.clipboardData;  
  clipdata.setData('text/plain', text_only);
  e.preventDefault();
});