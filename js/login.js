let logstatus =location.search.split("?")[1].split("&")[0].split("=")[1];
let login = document.getElementById("loginandre")

if (logstatus == "false") {
    login.innerHTML+=`<span style="font-size: 1.2em ;color: brown; margin-bottom: 10px; ">couldn't login please revise your login credential</span>`
}
