function toCalendar(){
    console.log("go to calendar page")
    window.location.href = "calendar\\calendar.html";
}

function sendMail(){
    window.location.href = "mailto:INFO@ljsprojects.com"
    console.log("send an email")
}

function sizeColumns(){
    var width = screen.width;
    if(width < 1126){
        return;
    }
    width = width - 300;
    var height = screen.height;
    console.log(width, height);
    document.getElementById("rightCol").style.width = width + "px" ;
    document.getElementById("background").style.width = width + "px";

    document.getElementById("rightCol").style.bottom = "0px";
    document.getElementById("background").style.bottom = "0px";
    // document.getElementById("leftCol").style.bottom = "0px";

}

function scrollCheck(){
    var rect = document.getElementById("rightCol").getBoundingClientRect();
    var left = rect.left;

    // console.log(left);
}
