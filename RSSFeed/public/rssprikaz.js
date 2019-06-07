var paragraf = document.getElementById('pid')



function klik(){
    paragraf.innerHTML=""
    var ajax = new XMLHttpRequest()
    ajax.onreadystatechange=function(){
        if(ajax.readyState==4 && ajax.status==200){
            paragraf.innerHTML+=ajax.responseText
            paragraf.innerHTML+="sdasadas"
        }
    }
    ajax.open("GET","http://localhost:8080/rss",true)
    ajax.setRequestHeader('Content-Type','application/xml')
    ajax.send()
}