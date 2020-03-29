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

function minutesUntilMidnight() {
    var midnight = new Date();
    midnight.setHours( 24 );
    midnight.setMinutes( 0 );
    midnight.setSeconds( 0 );
    midnight.setMilliseconds( 0 );
    return ( midnight.getTime() - new Date().getTime() ) / 1000 / 60;
}

setTimeout(() => {
    window.reload();
}, (minutesUntilMidnight() * 60 * 1000));