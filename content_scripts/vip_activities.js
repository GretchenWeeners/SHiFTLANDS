var i;
for (i = 0; i < document.getElementsByTagName('li').length; i++) { 
    if (!document.getElementsByTagName('li')[i].className.includes("completed")) {document.getElementsByTagName('li')[i].click()}
}