$("#addCol").click(function(){
    $("tr").append($("<td contenteditable></td>"));
    $('td').on('focus', function () { setTimeout(() => {document.execCommand('selectAll', false, null);}, 10);});
})

$(".addRow").click(function(){
    $(this).prev().append($("table").first().children().first().clone());
    $('td').on('focus', function () { setTimeout(() => {document.execCommand('selectAll', false, null);}, 10);});
})

$("#rmCol").click(function(){
    $("tr").each(function(){
        $(this).children().last().remove();
    })
})

$(".rmRow").click(function(){
    $(this).prev().prev().children().last().remove();
})

function importData(data){
    try {
        data = JSON.parse(data);
        
        $("table").children().remove()
        $("table").first().append("<tr></tr>");
        
        for (let i = 0; i < data.people.length; i++) {
            $("tr").append($(`<td contenteditable>${data.people[i]}</td>`))
        }
            
        for (let i = 0; i < (Math.ceil(data.dailyJobs.length/data.people.length)*data.people.length); i++) {
            if (i % data.people.length == 0) {
                $("table").eq(1).append("<tr></tr>");
            }
            if (data.dailyJobs[i] === undefined) {
                $("tr").last().append($("<td contenteditable/>"));
            } else {
                $("tr").last().append($(`<td contenteditable>${data.dailyJobs[i]}</td>`));
            }
        }

        for (let i = 0; i < (Math.ceil(data.weeklyJobs.length/data.people.length)*data.people.length); i++) {
            if (i % data.people.length == 0) {
                $("table").eq(2).append("<tr></tr>");
            }
            if (data.weeklyJobs[i] === undefined) {
                $("tr").last().append($("<td contenteditable/>"));
            } else {
                $("tr").last().append($(`<td contenteditable>${data.weeklyJobs[i]}</td>`));
            }
        }
        
    } catch(error) {
        alert("There was an error...");
        console.log(error);
    }
}

$("#export").click(function(){
    
    let people = [];
    
    $("tr").first().find("td").each(function(){
        people.push($(this).text());
    });
    
    let dailyJobs = [];

    $("table").eq(1).find("td").each(function(){
        dailyJobs.push($(this).text());
    })

    let weeklyJobs = [];
    $("table").eq(2).find("td").each(function(){
        weeklyJobs.push($(this).text());
    })
    
    let final = JSON.stringify({people,dailyJobs,weeklyJobs});
    
    let loc = window.location.pathname;
    let dir = loc.substring(0, loc.lastIndexOf('/'));

    let editor = dir + "/index.html?sharing=" + LZString.compressToEncodedURIComponent(final);

    window.location.replace(editor);
  
})

function getUrlVars() {
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

let edit = getUrlVars().edit;

if (edit != undefined) {
    edit = LZString.decompressFromEncodedURIComponent(edit);
    importData(edit)
}

$('td').on('focus', function () { setTimeout(() => {document.execCommand('selectAll', false, null);}, 10);});

$('#abort').click(function(){
    if (confirm("Close without Saving?") == true) {
        let loc = window.location.pathname;
        let dir = loc.substring(0, loc.lastIndexOf('/'));
        window.location.replace(dir + "/index.html");
    }
})