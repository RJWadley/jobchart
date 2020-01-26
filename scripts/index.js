$("#settings-open").click(function(){
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
            currentCell.css('background-color', 'hsl(' + (hue + i * (360 / col) - thOffset) + ', 100%, 65%)')
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
