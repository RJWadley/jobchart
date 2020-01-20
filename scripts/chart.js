var chartData;
var people = [];
var dailyJobs = [];

function setItem(name, value) {
    //stringify then compress
    var compressed = LZString.compressToUTF16(JSON.stringify(value));
    //store it
    localStorage.setItem(name,compressed);
    console.log("data set: " + JSON.stringify(value));
}

function getItem(name) {
    //if the item doesn't exist return null
    if (localStorage.getItem(name) == null) {
        return null;
    }

    //decompress then parse then return
    var data = JSON.parse(LZString.decompressFromUTF16(localStorage.getItem(name)));
    console.log("data got: " + JSON.stringify(data));
    return data;
}

//if when the site is loaded no data exists populate with sample data
if (getItem("chartData") === null) {
    people = ["steve", "john", "sue", "mary jane"]
    dailyJobs = ["wash", "dry", "sit", "clean bathroom 2",
        "wash 2", "dry 2", "sit 2", "clean bathroom",
        "wash3", "dry3", "sit3", "clean 3",];
    saveData();
}

function saveData() {
    //compose a data object and save it
    chartData = {
        "people": people,
        "dailyJobs": dailyJobs,
    }

    setItem("chartData", chartData);
}

function loadData() {
    //load the data from localStorage and assign local variables
    chartData = getItem("chartData");

    people = chartData.people;
    dailyJobs = chartData.dailyJobs;

    //update text boxes in settings
    $('#people').val(people);
    $('#dailyJobs').val(dailyJobs);
}

//get data to export
$("#export").click(function(){
    prompt("Copy the code below", JSON.stringify(getItem("chartData")));
});

//import
$("#import").click(function(){
    var pasted = prompt("Paste the code you copied:");
    try {
        pasted = JSON.parse(pasted);
        var backup = chartData;
        chartData = pasted;

        people = chartData.people;
        dailyJobs = chartData.dailyJobs;

        //update text boxes in settings
        $('#people').val(people);
        $('#dailyJobs').val(dailyJobs);

        initTable();
    } catch {
        alert("invalid code");
        return;
    }
    alert("successfully imported!")
});

$("#settings").submit(function(e) {
    e.preventDefault();  //prevent reload

    //get values from settings
    people = $('#people').val().split(',');
    dailyJobs = $('#dailyJobs').val().split(',');

    //save and reload
    saveData();
    initTable();

    $(".settings-container").removeClass("open-settings");

})

function initTable() {
    //clear table
    $("#chart > tbody").html("");
    // create a row for each name
    for (const name of people) {
        $("#chart > tbody").append(`<tr><th>${name}</th></tr>`);
    }

    //calculate day code from 0 to people.length
    var today = new Date();
    today = Math.floor(today/8.64e7); //epoch time
    var dayCode = today % people.length;

    //add the jobs moving from row to row
    for (var i = 0; i < dailyJobs.length; i++) {
        $('#chart tr').eq((i + dayCode) % people.length).append($('<td />', { text: dailyJobs[i] }))
    }

    // flip the table
    flipTable();

}

//code to flip table horizontal to vertical
function flipTable() {
    $("table").each(function () {
        var $this = $(this);
        var newrows = [];
        $this.find("tr").each(function () {
            var i = 0;
            $(this).find("td,th").each(function () {
                i++;
                if (newrows[i] === undefined) {
                    newrows[i] = $("<tr></tr>");
                }
                newrows[i].append($(this));
            });
        });
        $this.find("tr").remove();
        $.each(newrows, function () {
            $this.append(this);
        });
    });

    return false;
}

loadData();
initTable();