var chartData;
var people = [];
var dailyJobs = [];
var checkedArray;

var today = new Date();
today = Math.floor(today/8.64e7); //epoch time

function setItem(name, value) {
    //stringify then compress
    var compressed = LZString.compressToUTF16(JSON.stringify(value));
    //store it
    localStorage.setItem(name,compressed);
    console.groupCollapsed("Data Set");
    console.log(JSON.stringify(value));
    console.groupEnd();
}

function getItem(name) {
    //if the item doesn't exist return null
    if (localStorage.getItem(name) == null) {
        return null;
    }

    //decompress then parse then return
    var data = JSON.parse(LZString.decompressFromUTF16(localStorage.getItem(name)));
    console.groupCollapsed("Data Got");
    console.log(JSON.stringify(data));
    console.groupEnd();
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

    var link = (window.location.href.toString() + "?sharing=" + LZString.compressToEncodedURIComponent(JSON.stringify(chartData)));

    $(".sharable-link").remove();

    $(".link-sharing").append($(`<br class="sharable-link"><a href=${link} class="sharable-link">${link}</a>`));

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
    saveChecked()

    $(".settings-container").removeClass("open-settings");

})

//reload the chart when the height changes (for mobile)
function resizeChart() {
    $("#chart").css("height", window.innerHeight)
}

window.onresize = resizeChart;

function initTable() {
    //clear table
    $("#chart > tbody").html("");
    // create a row for each name
    for (const name of people) {
        $("#chart > tbody").append(`<tr><th>${name}</th></tr>`);
    }

    //calculate day code from 0 to people.length
    var dayCode = today % people.length;
    console.log("current day code is " + dayCode)


    //add the daily jobs moving from row to row
    for (var i = 0; i < dailyJobs.length; i++) {
        $('#chart tr').eq((i + dayCode) % people.length).append($('<td />', { text: dailyJobs[i] }))
    }

    //remove blanks
    $("#chart").find("td").each(function(){
        if ($(this).html() == "") {
            $(this).remove();
        }
    })

    flipTable();
    resizeChart();


    //checking off items
    $("td").click(function(){
        $(this).toggleClass("done");

        saveChecked();
    })


}

//code to flip table horizontal to vertical

function flipTable() {
    //get dimensions (not including th)
    var row = $('#chart tr').length;
    var col = 0;
    $("table").find("tr").each(function(){
        if ($(this).find("td").length > col) {
            col = $(this).find("td").length;
        }
    })

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
            setItem("chartData", fromLink)

            people = fromLink.people;
            dailyJobs = fromLink.dailyJobs;
            saveData();

            window.location = window.location.pathname;

        } catch {

            alert("error importing!! reverting...")
            
            people = backup.people;
            dailyJobs = backup.dailyJobs;
            saveData();

            window.location = window.location.pathname;
        }
    }

}

//if when the site is loaded no data exists populate with sample data
if (getItem("chartData") === null && confirm("populate with sample data?")) {
    people = ["steve", "john", "sue", "mary jane"]
    dailyJobs = ["wash dishes", "dry dishes", "clear off counters", "sweep floor",
        "mop floor", "set table", "clean living room", "clean bathroom",
        "load dishwasher", "empty dishwasher", "vacuum living room", "water the plant",];
    saveData();
}

loadData();
initTable();

if (getItem("checkedArray") == null) {
    checkedArray = [today];
} else {
    checkedArray = getItem("checkedArray");
}

function saveChecked() {
    checkedArray = [today]; //reset array then loop through all
    $("td").each(function(){
        if ($(this).hasClass("done")) {
            checkedArray.push(true)
        } else {
            checkedArray.push(false)
        }
    })

    setItem("checkedArray", checkedArray)
}

    //load checked
function loadChecked() {
    if (checkedArray[0] == today && checkedArray.length > 1) {
        $($("td").get().reverse()).each(function() { //iterate in reverse order
            var current = checkedArray.pop();
            if (current == true) {
                $(this).addClass("done");
            }
        });
    }
}
loadChecked();






$(".settings-icon-container").click(function(){
    $(".settings-container").addClass("open-settings");
})

$(".settings-close").click(function(){
    $(".settings-container").removeClass("open-settings");
    loadData();
})

$("#clear-all-data").click(function(){
    if (confirm("ARE YOU SURE YOU WANT TO CLEAR ALL DATA? THIS CANNOT BE UNDONE?") == true &&
        prompt("Type DELETE to confirm") === "DELETE") {
            localStorage.clear();
            alert("deleted");
            location.reload();
        } else {
            alert("not deleted");
        }
})

var hue = 30

function changeColors(){

    //get dimensions (including th)
    var row = $('#chart tr').length;
    var col = Math.ceil($("table").find("tr td, th").length / row + 1)

    chart = $("#chart")

    //colors
    for (var i = 0; i < col; ++i) {
        for (var j = 0; j < row; ++j) {
            var currentCell = chart.find("tr").eq(j).find("td, th").eq(i);
            var thOffset = 0;
            if (j == 0) {
                thOffset = 360 / col / 3
            }
            currentCell.css('background-color', 'hsl(' + (hue + i * (360 / col) - thOffset) + ', 100%, 70%)')
        }
    }

    hue++;
    if (hue > 360) {hue = 0}
}

changeColors();
var colors = setInterval(changeColors, 1000);

autosize($('textarea'))

var slider = document.getElementById("zoomSlider");
var output = document.getElementById("zoomLevel");

//the process is different if already modified due to slider max value
if (getItem("zoom") != null) {
    slider.value = getItem("zoom");
    $("#chart").css("font-size", `${getItem("zoom")}%`);
    output.innerHTML = getItem("zoom");
} else {
    slider.value = 100;
    $("#chart").css("font-size", `${slider.value}%`);
    output.innerHTML = slider.value; // Display the default slider value
}

// Update the current slider value
slider.oninput = function() {
    output.innerHTML = this.value;
    
    $("#chart").css("font-size", `${this.value}%`);
    setItem("zoom", this.value);

}

$("#zoomLevel").keypress(function(e){ return e.which != 13; });

var zoomLevelTimeout;

//update value when typed
$("#zoomLevel").on("input",function(){
    var value = $("#zoomLevel").html();
    if (!isNaN(value)) {
        slider.value = value;
        $("#chart").css("font-size", `${value}%`);
        setItem("zoom", value);
        
        clearTimeout(zoomLevelTimeout);

        $(".settings-container").css("background", "none");
        $("#zoomSlider").parent().parent().siblings().css("opacity", "0");

        zoomLevelTimeout = setTimeout(function(){
            $(".settings-container").css("background", settingsContainerCSS);
            $("#zoomSlider").parent().parent().siblings().css("opacity", "1");
        }, 1000)

    }
})


var settingsContainerCSS = $(".settings-container").css("background");

$("#zoomSlider").on("touchstart mousedown", function(){
    $(".settings-container").css("background", "none");
    $("#zoomSlider").parent().parent().siblings().css("opacity", "0");
})

$("#zoomSlider").on("touchend mouseup", function(){
    $(".settings-container").css("background", settingsContainerCSS);
    $("#zoomSlider").parent().parent().siblings().css("opacity", "1");
})

if (window.matchMedia('(display-mode: standalone)').matches) {
    $(".install-half").eq(0).remove();
    $(".install-half").removeClass("settings-half");
}

$(".install-half").last().next().css("margin-top","0");