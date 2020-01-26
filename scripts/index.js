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
slider.value = getItem("zoom")
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
    
    $("#chart").css("font-size", `${this.value}%`);
    setItem("zoom", this.value);

}


var settingsContainerCSS;

$("#zoomSlider").on("touchstart mousedown", function(){
    settingsContainerCSS = $(".settings-container").css("background")
    $(".settings-container").css("background", "none");
    $("#zoomSlider").parent().parent().siblings().css("opacity", "0");
})

$("#zoomSlider").on("touchend mouseup", function(){
    $(".settings-container").css("background", settingsContainerCSS);
    $("#zoomSlider").parent().parent().siblings().css("opacity", "1");
})

