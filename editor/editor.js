$("#addCol").click(function(){
  $("tr").append($("<td contenteditable></td>"));
})

$("#addRow").click(function(){
  $("table").append($("tr").last().clone());
})

$("#rmCol").click(function(){
  $("tr").each(function(){
    $(this).children().last().remove();
  });
})
$("#rmRow").click(function(){
  if ($("tr").length > 1) {
    $("tr").last().remove();
  }
})

$("#import").click(function(){
  var pasted = prompt("Paste the code you copied from the settings menu:");
  
  try {
    pasted = JSON.parse(pasted);
    
    $("table").children().remove()
    $("table").append("<tr></tr>");
    
    for (var i = 0; i < pasted.people.length; i++) {
      $("tr").append($(`<td contenteditable>${pasted.people[i]}</td>`))
    }
        
    for (var i = 0; i < pasted.dailyJobs.length; i++) {
      if (i % pasted.people.length == 0) {
        $("table").append("<tr></tr>");
      }
      $("tr").last().append($(`<td contenteditable>${pasted.dailyJobs[i]}</td>`));
    }
    
  } catch {
    alert("error")
    location.reload();
  }
})

$("#export").click(function(){
  var people = [];
  $("tr").first().find("td").each(function(){
    people.push($(this).text());
  });
  
  var firstRow = $("tr").first();
  
  $("tr").first().remove();
  
  var dailyJobs = [];
  $("table").find("td").each(function(){
    dailyJobs.push($(this).text());
  })
  
  prompt("Copy the code below and import it in the settings menu.",
         JSON.stringify({people,dailyJobs}))
  
  $("tr").first().before(firstRow);
  
})