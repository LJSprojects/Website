function toCalendar(){
    console.log("go to calendar page")
    window.location.href = "calendar\\calendar.html";
}

function sendMail(){
    window.location.href = "mailto:INFO@ljsprojects.com"
    console.log("send an email")
}

function sizeColumns(){
    var width = screen.width - 300;

    console.log(width);
    document.getElementById("rightCol").style.width = width + "px" ;
    document.getElementById("background").style.width = width + "px";
}

function scrollCheck(){
    var rect = document.getElementById("rightCol").getBoundingClientRect();
    var left = rect.left;

    // console.log(left);
}
