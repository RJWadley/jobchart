
$(".splash-button").eq(1).click( function() {
    $(".splash-container").remove();
    $(".settings-container").addClass("open-settings");
    $("td").html("Click the settings gear in the bottom left to get started.")
} )

$(".splash-button").eq(2).click( function() {
    $(".splash-container").remove();
    $("td").html("Click the settings gear in the bottom left to get started.")
} )