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
var chartData;

// event listeners
$('.sidebar-toggle').click(function() {
  $('.sidebar').toggle();
})
$('.settings-open').click(function() {
  $('.settings').addClass('opensettings');
  $('.sidebar').hide();
})
$('.settings-close').click(function() {
  saveAndClose();
})
$('.reset').click(function() {
  if (confirm("Are you sure?")) {
    localStorage.clear();
  }
})
$('.add-person-button').click(function() {
  addPerson();
})
$('.remove-person-button').click(function() {
  removePerson();
})
$('.add-task-button').click(function() {
  addTask();
})
$('.remove-task-button').click(function() {
  removeTask();
})
$('.saveAndClose').click(function() {
  saveAndClose();
})

//functions

function flipTable() {
  $("table").each(function() {
    var $this = $(this);
    var newrows = [];
    $this.find("tr").each(function() {
      var i = 0;
      $(this).find("td,th").each(function() {
        i++;
        if (newrows[i] === undefined) {
          newrows[i] = $("<tr></tr>");
        }
        newrows[i].append($(this));
      });
    });
    $this.find("tr").remove();
    $.each(newrows, function() {
      $this.append(this);
    });
  });

  return false;
}

function saveData() {
  localStorage.chartData = JSON.stringify(chartData);
}

function loadData() {
  chartData = JSON.parse(localStorage.chartData);
}

function addPerson() {
  if (chartData.people.length < 12) {
    let element = $(".template div:nth-child(1)").html();
    let elemId = chartData.people.length;
    element = element.replace(/thisNumber/g, elemId);
    $('.people-list').append(element);
    chartData.people.push(undefined);
    $(`#person-${elemId}-input`).focus();
  } else {
    alert('Too many peeps!')
    return;
  }
}

function removePerson() {
  //remove from html and array
  $(".people-list")
    .children()
    .last()
    .remove();
  chartData.people.pop();
}

function addTask() {
  let element = $(".template div:nth-child(2)").html();
  let elemId = chartData.tasks.length;
  element = element.replace(/thisNumber/g, elemId);
  $('.tasks-list').append(element);
  chartData.tasks.push({});
  $(`#tasks-${elemId}-input`).focus();
}

function removeTask() {  //remove from html and array
  $(".tasks-list")
    .children()
    .last()
    .remove();
  chartData.tasks.pop();}

function saveAndClose() {

  let peopleNum = chartData.people.length; //to fix infinite loop
  for (let i = 0; i < peopleNum; i++) {
    chartData.people[i] = $(`#person-${i}-input`).val(); //set array to textbox value
  }

  saveData();
  $('.settings').removeClass('opensettings');
}

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

  //load chartData every time
  loadData();

  let peopleNum = chartData.people.length; //to fix infinite loop
  for (let i = 0; i < peopleNum; i++) {
    let element = $(".template div:nth-child(1)").html();
    element = element.replace(/thisNumber/g, i);
    $('.people-list').append(element);
    let text = chartData.people[i];
    $(`#person-${i}-input`).val(text); //set textbox value

  }


})
