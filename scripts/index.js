
$(".splash-button").eq(1).click( function() {
    $(".splash-container").remove();
    $(".settings-container").addClass("open-settings");
    $("td").html("Click the settings gear in the bottom left to get started.")
} )

$(".splash-button").eq(2).click( function() {
    $(".splash-container").remove();
    $("td").html("Click the settings gear in the bottom left to get started.")
} )


//auto reload at midnight

function autoRefresh() {
    var refreshDate = new Date();
    thisHour = refreshDate.getHours();
    thisMinute = refreshDate.getMinutes();
    thisSecond = refreshDate.getSeconds();
    setTimeout("autoRefresh()",55000); // in milliseconds = 55min

    if(thisHour == 12 && thisMinute > 0 && thisSecond > 0 && thisMinute < 1 &&
    thisSecond < 60) {
        location.reload();
    }
}

autoRefresh();