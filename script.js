/* how chart data is structured

chartData {
  people: [
    "people",
    "names",
  ]
  tasks: [{
      name: "string",
      repeat: "daily, daysofweek, onceweekly, everyday"
      people: ["people", "involved"]
    },
    {
      name: "string",
      repeat: "daily, daysofweek, onceweekly, everyday"
      people: ["people", "involved"]
    }
  ]
}
*/

"use strict";
//delcare variables
let chartData;

//declare functions

// a function that saves people to array.
function savePeople() {
  let peopleNum = chartData.people.length; //to fix infinite loop
  for (let i = 0; i < peopleNum; i++) {
    console.log($(`#person-${i}-form`).val()); //for debug
    chartData.people[i] = $(`#person-${i}-form`).val(); //set array to textbox value
  }

  $("#settings").append(
    '<div class="alert alert-success alert-dismissible fade in show" style="width: 300px; position: fixed; top: 10px; right:10px" role="alert"><strong>Success!</strong> It totally worked!<button type="button" class="close" data-dismiss="alert">&times;</button></button></div>'
  );
  window.setTimeout(function() {
    $(".alert")
      .fadeTo(500, 0)
      .slideUp(500, function() {
        $(this).remove();
      });
  }, 4000);
}

function saveTasks() {


  let tasksNum = chartData.tasks.length; //to fix infinite loop
  for (let i = 0; i < tasksNum; i++) {
    console.log($(`#task-${i}-name`).val()); //for debug
    console.log(i);

    chartData.tasks[i].name = $(`#task-${i}-name`).val(); //set array to textbox value

    //type
    console.log($("label[for='" + $("input[name='task-" + i + "-type']:checked").attr("id") + "']").html());
    switch ($("label[for='" + $("input[name='task-" + i + "-type']:checked").attr("id") + "']").html()) {
      case "Daily":
        chartData.tasks[i].type = "daily";
        break;
      case "Weekly":
        chartData.tasks[i].type = "weekly";
        break;

        //room to extend
    }
  }

  $("#settings").append(
    '<div class="alert alert-success alert-dismissible fade in show" style="width: 300px; position: fixed; top: 10px; right:10px" role="alert"><strong>Success!</strong> It totally worked!<button type="button" class="close" data-dismiss="alert">&times;</button></button></div>'
  );

  window.setTimeout(function() {
    $(".alert")
      .fadeTo(500, 0)
      .slideUp(500, function() {
        $(this).remove();
      });

  }, 4000);

}

//open the settings window
function settings() {
  //clear the content to start fresh
  $("#person-list").empty();
  $('#tasks-list').empty();

  for (let i = 0; i < chartData.people.length; i++) {
    //clone and add the item to html
    let id = 'person-' + i;
    let clone = $("#template-person").clone();
    clone.children().attr("id", "person-form-template")
    clone.removeClass("template");
    clone.attr('id', id);

    clone.appendTo("#person-list");

    $("#person-form-template").children('input').attr("id", id + "-form");
    $("#person-form-template").children('input').val(chartData.people[i]);
    $("#person-form-template").children('label').attr("for", id + "-form");
    $("#person-form-template").attr("id", "");

    document.getElementById(id + "-form").focus();

  }

  /*
   *
   *     I N S E R T   T A S K   B U I L D E R   B E L O W
   *
   */

  for (let i = 0; i < chartData.tasks.length; i++) {

    let id = 'task-' + i;

    //clone and add the item to html
    let clone = $("#template-task").clone();
    clone.attr("id", id)
    clone.removeClass("template");
    clone.appendTo("#tasks-list");

    let element = document.getElementById(id).outerHTML;

    while (element.includes("template-task")) {
      element = element.replace("template-task", id);
    }

    document.getElementById(id).outerHTML = element;

    let modalClone = $("#template-task-modal").clone();
    modalClone.attr("id", id + "-modal");
    modalClone.removeClass("template");
    modalClone.appendTo("#modals-list");

    let modal = document.getElementById(id + "-modal").outerHTML;

    while (modal.includes("template-task")) {
      modal = modal.replace("template-task", id);
    }

    document.getElementById(id + "-modal").outerHTML = modal;

    $("#" + id + "-name").val(chartData.tasks[i].name);
    document.getElementById(id + "-name").focus();
    document.getElementById(id + "-name").blur();

    $("#task-" + i + "-type-" + chartData.tasks[i].type).attr("checked", "checked")

  }
  $("#settings").addClass("opensettings");
}


//onload function
$(document).ready(function() {
  //check if we've visited before
  if (localStorage.visited != "true") {
    //if we haven't, mark that we have now
    localStorage.visited = "true";

    //if we haven't, create a blank chartData and save it

    let chartData = {
      people: [],
      tasks: []
    };

    localStorage.chartData = JSON.stringify(chartData);
  }

  //load chartData
  chartData = JSON.parse(localStorage.chartData);

  //function for the "Let's Go" button on the welcome page
  document.getElementById("splashButton").onclick = function() {
    //add a class to trigger css animation
    $("#welcome").addClass("ready");
    localStorage.ready = "true";
    console.log("Ready button pressed!");
    console.log(chartData);
  };

  //if we have already pressed let's go, skip the welcome screen
  if (localStorage.ready == "true") {
    console.log("Already pressed button!");
    //remove welcome screen
    $("#welcome").remove();
    //and close the settings window
    $('#settings').removeClass('opensettings');
  }

  //function to add person
  document.getElementById("addPerson").onclick = function() {
    //clone and add the item to html

    if (chartData.people.length >= 10) {
      $("#settings").append(
        '<div class="alert alert-danger alert-dismissible fade in show" style="width: 300px; position: fixed; top: 10px; right:10px" role="alert"><strong>Uh Oh!</strong> There\'s too many people to add another one!<button type="button" class="close" data-dismiss="alert">&times;</button></button></div>'
      );
      return;
    }

    let id = 'person-' + chartData.people.length;
    let clone = $("#template-person").clone();
    clone.children().attr("id", "person-form-template")
    clone.removeClass("template");
    clone.attr('id', id);

    clone.appendTo("#person-list");

    $("#person-form-template").children('input').attr("id", id + "-form");
    $("#person-form-template").children('label').attr("for", id + "-form");
    $("#person-form-template").attr("id", "");

    document.getElementById(id + "-form").focus();

    //add a placeholder to the array
    chartData.people.push("placeholder");
  };

  document.getElementById("removePerson").onclick = function() {
    //remove from html and array
    $("#person-list")
      .children()
      .last()
      .remove();
    chartData.people.pop();
  };

  document.getElementById("savePeople").onclick = function() {
    savePeople();
  }



  document.getElementById("addTask").onclick = function() {

    let id = 'task-' + chartData.tasks.length;

    //clone and add the item to html
    let clone = $("#template-task").clone();
    clone.attr("id", id)
    clone.removeClass("template");
    clone.appendTo("#tasks-list");

    let element = document.getElementById(id).outerHTML;

    while (element.includes("template-task")) {
      element = element.replace("template-task", id);
    }

    document.getElementById(id).outerHTML = element;

    let modalClone = $("#template-task-modal").clone();
    modalClone.attr("id", id + "-modal");
    modalClone.removeClass("template");
    modalClone.appendTo("#modals-list");

    let modal = document.getElementById(id + "-modal").outerHTML;

    while (modal.includes("template-task")) {
      modal = modal.replace("template-task", id);
    }

    document.getElementById(id + "-modal").outerHTML = modal;
    document.getElementById(id + "-name").focus();

    //add a placeholder to the array
    chartData.tasks.push({
      "name": "placeholder"
    });
  };
  document.getElementById("removeTask").onclick = function() {
    $("#tasks-list")
      .children()
      .last()
      .remove();
    chartData.tasks.pop();
  };
  document.getElementById("saveTasks").onclick = function() {
    saveTasks();
  };

  //save the settings to the localStorage and close the menu.
  document.getElementById("updateSettings").onclick = function() {

    savePeople();
    saveTasks();
    localStorage.chartData = JSON.stringify(chartData);

    $("#settings").removeClass("opensettings");
  };

  $('#panel1').click(function(e) {
    e.preventDefault()
    $(this).tab('show')
  })

  $("#loadtime").remove();
});
