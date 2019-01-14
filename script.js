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

/*eslint-env jquery */

//delcare variables
var chartData;

// event listeners
$('.sidebar-toggle').click(function() {
	$('.sidebar').toggle();
});
$('.settings-open').click(function() {
	$('.settings').addClass('opensettings');
	$('.sidebar').hide();
});
$('.settings-close').click(function() {
	saveAndClose();
});
$('.reset').click(function() {
	if (confirm("Are you sure?")) {
		localStorage.clear();
		document.cookie = ['chartData', '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
		document.cookie = ['visited', '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
		location.reload(true)
	}
});
$('.add-person-button').click(function() {
	addPerson();
});
$('.remove-person-button').click(function() {
	removePerson();
});
$('.add-task-button').click(function() {
	addTask();
});
$('.remove-task-button').click(function() {
	removeTask();
});
$('.saveAndClose').click(function() {
	saveAndClose();
});

//functions

function bakeCookie(name, value) {
	
	var date = new Date();
    date.setHours(23,59,59,999);
    date.setFullYear(new Date().getFullYear() + 2);
    var expires = "expires=" + date.toGMTString();
	
	var cookie = [name, '=', JSON.stringify(value), '; expires=', expires, '; domain=.', window.location.host.toString(), '; path=/;'].join('');
	document.cookie = cookie;
}

function readCookie(name) {
	var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
	result && (result = JSON.parse(result[1]));
	return result;
}

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
	localStorage.setItem('chartData', JSON.stringify(chartData));
	bakeCookie('chartData', JSON.stringify(chartData));
	alert('data saved: ' + JSON.stringify(chartData));
}

function loadData() {
	chartData = JSON.parse(localStorage.getItem('chartData'));
	if (chartData == undefined) {
		console.log('local storage failed, attempting to use cookie');
		chartData = JSON.parse(readCookie('chartData'));
		localStorage.setItem('chartData', JSON.stringify(chartData));
		localStorage.setItem('visited', "yes");
	}
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
		alert('Too many peeps!');
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

function removeTask() { //remove from html and array
	$(".tasks-list")
		.children()
		.last()
		.remove();
	chartData.tasks.pop();
}

function saveAndClose() {

	let peopleNum = chartData.people.length;
	for (let i = 0; i < peopleNum; i++) {
		chartData.people[i] = $(`#person-${i}-input`).val(); //set array to textbox value
	}
	
	let tasksNum = chartData.tasks.length;
	for (let i = 0; i < tasksNum; i++) {
		chartData.tasks[i].name = $(`#tasks-${i}-input`).val(); //set array to textbox value
	}

	saveData();
	$('.settings').removeClass('opensettings');
}

$(document).ready(function() {

	//check if we've visited before
	if (!((localStorage.getItem('visited') === 'yes') || (readCookie('visited') === 'yes'))) {
		//if we haven't, mark that we have now
		localStorage.setItem('visited', 'yes');
		bakeCookie('visited', 'yes');

		console.log('first visit');

		//if we haven't, create a blank chartData and save it
		chartData = {
			people: [],
			tasks: []
		};

		saveData();

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
	
	
	let tasksNum = chartData.tasks.length; //to fix infinite loop
	for (let i = 0; i < tasksNum; i++) {
		let element = $(".template div:nth-child(2)").html();
		element = element.replace(/thisNumber/g, i);
		$('.tasks-list').append(element);
		let text = chartData.tasks[i].name;
		$(`#tasks-${i}-input`).val(text);
	}

});