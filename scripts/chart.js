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

function saveData() {
    //compose a data object and save it
    chartData = {
        "people": people,
        "dailyJobs": dailyJobs,
    }

    setItem("chartData", chartData);

    //remove sharable link (less confusing)
    $(".sharable-link").remove();

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

//link sharing

$("#link-share").click(function(){
    var link = (window.location.href.toString() + "?sharing=" + LZString.compressToEncodedURIComponent(JSON.stringify(getItem("chartData"))))

    $(".sharable-link").remove();

    $(".settings-container").append($(`<a href=${link} class="sharable-link">${link}</a>`));

})

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

        chartData = backup;

        people = chartData.people;
        dailyJobs = chartData.dailyJobs;

        //update text boxes in settings
        $('#people').val(people);
        $('#dailyJobs').val(dailyJobs);

        initTable();
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
    console.log("current day code is " + dayCode)


    //add the daily jobs moving from row to row
    for (var i = 0; i < dailyJobs.length; i++) {
        $('#chart tr').eq((i + dayCode) % people.length).append($('<td />', { text: dailyJobs[i] }))
    }

   flipTable();

}

//code to flip table horizontal to vertical

function flipTable() {
    //get dimensions (not including th)
    var row = $('#chart tr').length;
    var col = Math.ceil($("table").find("tr td").length / row)

    //clone the chart and clear the old one
    var chart = $("#chart");
    clone = chart.clone();
    chart.find("tr").remove();

    //copy th
    chart.append($("<tr></tr>"));
    chart.find("tr:first").append(clone.find("th"));

    //copy td
    for (var i = 0; i < col; ++i) {
        chart.append($("<tr></tr>"));
        for (var j = 0; j < row; ++j) {
            newCell = clone.find("tr").eq(j).find("td").eq(i).clone();
            if (newCell.length == 0) {
                chart.find("tr:last").append($("<td></td>"));
                continue;
            }
            chart.find("tr:last").append(newCell)
        }
    }

}


//link importing

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

if (getUrlVars().sharing != undefined) {
    if (getItem("chartData") == null || confirm("Importing from link. (Data will be replaced, this cannot be undone). Continue?") == true) {
        alert("Imported from link. Following data was replaced: "+ JSON.stringify(getItem("chartData")));

        try {
            fromLink = JSON.parse(LZString.decompressFromEncodedURIComponent(getUrlVars().sharing));
            var backup = getItem("chartData");
            chartData = fromLink;

            people = chartData.people;
            dailyJobs = chartData.dailyJobs;

            //update text boxes in settings
            $('#people').val(people);
            $('#dailyJobs').val(dailyJobs);

            initTable();
            window.location = window.location.pathname;

        } catch {

            alert("error importing!! reverting...")

            window.location = window.location.pathname;

        }
    }

}

//if when the site is loaded no data exists populate with sample data
if (getItem("chartData") === null) {
    people = ["steve", "john", "sue", "mary jane"]
    dailyJobs = ["wash dishes", "dry dishes", "clear off counters", "sweep floor",
        "mop floor", "set table", "clean living room", "clean bathroom",
        "load dishwasher", "empty dishwasher", "vacuum living room", "water the plant",];
    saveData();
}


loadData();
initTable();