$("#settings-open").click(function(){
    $(".settings-container").addClass("open-settings");
})

$("#settings-close").click(function(){
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

window.onresize = function() {
    document.body.height = window.innerHeight;
}
window.onresize(); // called to initially set the height.