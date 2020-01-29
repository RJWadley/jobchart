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

function importData(pasted){
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
        var loc = window.location.pathname;
        var dir = loc.substring(0, loc.lastIndexOf('/'));
        var back = dir + "/index.html";
        window.location.replace(back);

    }
}

$("#import").click(function(){importData(prompt("Paste the code you copied from the settings menu:"))})

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
    
    var final = JSON.stringify({people,dailyJobs});
    
    var loc = window.location.pathname;
    var dir = loc.substring(0, loc.lastIndexOf('/'));

    var editor = dir + "/index.html?sharing=" + LZString.compressToEncodedURIComponent(final);

    window.location.replace(editor);
    
    $("tr").first().before(firstRow);
  
})

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

var edit = getUrlVars().edit;

if (edit != undefined) {
    edit = LZString.decompressFromEncodedURIComponent(edit);
    importData(edit)
}