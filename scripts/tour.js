// Instance the tour
var tour = new Tour({
  backdrop: false,
  debug: true,
  steps: [
  {
    element: "#firstheader",
    title: "Your Job Chart",
    content: "Welcome to your Job Chart.",
    placement: "bottom",
    onShow: function(){
        $("tr").first().attr("id", "firstheader");
    }
  },
  {
    element: "#firstheader",
    title: "People",
    content: "These are some example people I've put on your job chart.",
    placement: "bottom"
  },
  {
    element: "#secondrow",
    title: "Daily Jobs",
    content: "Here are some example chores I've put on your job chart.",
    placement: "bottom",
    onShow: function(){
        $("tr").eq(1).attr("id", "secondrow");
    }
  },
  {
    element: "#secondrow",
    title: "Rotating",
    content: "Every day at midnight, each of these tasks will rotate to the right one space.",
    placement: "bottom",
    onShow: function(){}
  },
  {
    element: "#lastcol",
    title: "Rotating",
    content: "Tasks in the last column will move to the first.",
    placement: "bottom",
    onShow: function(){
        $("tr").eq(1).children().last().attr("id", "lastcol");
    }
  },
  {
    element: "#secondrow",
    title: "Crossing Items",
    content: "Click on an item to cross it off the list. Go ahead and try it!",
    placement: "bottom",
    onShow: function(){}
  },
  {
    element: "#lastrow",
    title: "Weekly Jobs",
    content: "Here are some example weekly chores I've put on your job chart.",
    placement: "top",
    onShow: function(){
        $("tr").last().attr("id", "lastrow");
    }
  },
  {
    element: "#lastrow",
    title: "Rotating",
    content: "Every Sunday at midnight, each of these tasks will rotate to the right one space.",
    placement: "top",
    onShow: function(){}
  },
  {
    element: ".settings-icon",
    title: "Settings",
    content: "Click this gear to open settings.",
    onShow: function(){},
    onNext: function(){
        $(".settings-container").addClass("open-settings");
        document.getElementById("settings-title").scrollIntoView();
    }
  },
  {
    element: "#people",
    title: "People",
    content: "Enter names of people here.",
    placement: "bottom",
    onShow: function(){}
  },
  {
    element: "#dailyJobs",
    title: "Daily Jobs",
    content: "Enter daily jobs here. They will be automatically distributed evenly between people.",
    placement: "bottom",
    onShow: function(){}
  },
  {
    element: "#firstbutton",
    title: "Saving",
    content: "Click here to save settings and update the chart.",
    onShow: function(){
        $(".settings-button").eq(0).attr("id", "firstbutton");
    }
  },
  {
    element: "#thirdbutton",
    title: "Visual Editor",
    content: "Click here to open the visual chart editor. It is much easier to use in some ways, but can be limited in others.",
    onShow: function(){
        $(".settings-button").eq(2).attr("id", "thirdbutton");
    }
  },
  {
    element: "#s2",
    title: "Zoom",
    content: "Slide the slider to make text bigger or smaller, or type in a value directly.",
    placement: "auto",
    onShow: function(){
        $(".settings-section").eq(1).attr("id", "s2");
        document.getElementById("s2").scrollIntoView();
    }
  },
  {
    element: "#s3",
    title: "Link Sharing",
    content: "Link sharing will create a link using your current chart, which can be shared. Shared links become completely seperate from your chart, and changes to them will not affect this chart.",
    placement: "auto",
    onShow: function(){
        $(".settings-section").eq(2).attr("id", "s3");
        document.getElementById("s3").scrollIntoView();
    }
  },
  {
    element: "#s4",
    title: "Backup, Export, and Import",
    content: "This will export your chart as text, which can be saved as a backup and/or imported.",
    placement: "auto",
    onShow: function(){
        $(".settings-section").eq(3).attr("id", "s4");
        document.getElementById("s4").scrollIntoView();
    }
  },
  {
    element: "#s5",
    title: "Web App",
    content: "This chart can be installed as an app.",
    placement: "auto",
    onShow: function(){
        $(".settings-section").eq(4).attr("id", "s5");
        document.getElementById("s5").scrollIntoView();
    }
  },
  {
    element: "#s6",
    title: "Web App",
    content: "This chart can be installed as an app.",
    placement: "auto",
    onShow: function(){
        $(".settings-section").eq(5).attr("id", "s6");
        document.getElementById("s6").scrollIntoView();
    }
  },
  {
    element: "#s7",
    title: "Feedback",
    content: "Report bugs, issues, or suggestions here.",
    placement: "auto",
    onShow: function(){
        $(".settings-section").eq(6).attr("id", "s7");
        document.getElementById("s7").scrollIntoView();}
    },
  {
    element: "#s8",
    title: "Clear Data",
    content: "All data is stored locally. Clearing cookies may clear all chart data.",
    placement: "auto",
    onShow: function(){
        $(".settings-section").eq(8).attr("id", "s8");
        document.getElementById("s8").scrollIntoView();
    }
  }
]})

// Initialize the tour

    tour.init();

$(".splash-button").eq(0).click( function() {
    setTimeout(function(){tour.start()},2000)
    })


    /*        setTimeout(function(){
            var demoCount = 1;
            setInterval(function(){
                today++;
                initTable();
                $("th").eq(0).html("Steve<br><br>Current day: " + demoCount++);
                $("th").eq(1).html("John");
                $("th").eq(2).html("Sue");
                $("th").last().html($("<p>Mary Jane</p><br /><button onclick='location.reload();'>Click to End Demo</button>"));

                changeColors();
            },1000)
        },100)*/
