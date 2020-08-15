var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthDays = [31,28,31,30,31,30,31,31,30,31,30,31];
var weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var startMonth;
var startYear;
var time;
var times = [8,9,10,11,12,1,2,3,4];
var monthsOff = 0;
var monthsOutAllowed = 2;

// var db = firebase.database();



function newMonth(){
    var d = new Date();
    var year = d.getFullYear();
    var monthNum = d.getMonth();
    startMonth = monthNum;
    startYear = year;
    var month = months[monthNum];
    fillData(monthNum, year);
}



function fillData(monthNum, year){
    if(monthNum == startMonth && year == startYear){
        document.getElementById("buttonDown").classList.add("invisible");
    } else {
        document.getElementById("buttonDown").classList.remove("invisible");
    }

    if(monthsOff >= monthsOutAllowed){
        document.getElementById("buttonUp").classList.add("invisible");
    } else {
        document.getElementById("buttonUp").classList.remove("invisible");
    }


    var month = months[monthNum];
    var firstDay = new Date("" + month + " 1, " + year + " 11:10:00");
   console.log(firstDay);
    var day1 = firstDay.getDay()-1;
    if(day1 == -1){
        day1 = 6;
    }
    console.log("firstDay: " + day1);
    document.getElementById("monthName").innerHTML = month;
    document.getElementById("yearNum").innerHTML = year;
    fillWeekdays();
    var days = monthDays[monthNum];

    if((year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0)){
        if(monthNum == 2){
            days += 1;
        }
    }

    checkDay(day1,days,monthNum,year);

    // fillDays(day1,days, monthNum, year);
}



function fillWeekdays(){
    var fill = document.getElementById("weekdayList");
    fill.innerHTML = "";
    day1 = 0;

    for(var i=0; i<7; i++){
        var index = day1 + i;
        if(index > 6){
            index = index - 7;
        }
        fill.innerHTML += "<li>" + weekdays[index];
    }
}



function fillDays(day1,days, monthNum, year, monthSlots){

    var fill = document.getElementById("dayList");
    fill.innerHTML = "";
    var leftover = 7 - days%7;
    var leftB4 = day1;
    var leftAfter = leftover - leftB4;
    if(leftAfter < 0){
        leftAfter = 7 + leftAfter;
    }
    // console.log(weekdays[day1], leftover, leftB4, leftAfter);

    for(var j=0; j<leftB4; j++){
        fill.innerHTML += "<div class='noday'>";
    }

    // console.log(monthSlots);
    for(var j=1; j<=days; j++){
        var day = j;
        var slots = monthSlots[j-1];

        var d = new Date();
        var cday = d.getDate();
        var cMonth = d.getMonth();
        console.log(cMonth, monthNum);

        if(parseInt(day) <= (parseInt(cday) ) && cMonth == monthNum){
            // console.log(day);
            fill.innerHTML += "<div class='day' id='day" + day + "'>" + day+ "<br><br><span class='dayinfo past'>" + "N/A</span>";
        } else {
            if(slots > 0){
                fill.innerHTML += "<div class='day' onclick='pickDay(" + day1 + "," + day + "," + monthNum + "," + year + ")' id='day" + day + "'>" + day + "<br><br><span class='dayinfo open'>" + slots + " slots</span>";
            } else{
                fill.innerHTML += "<div class='day' id='day" + day + "'>" + day+ "<br><br><span class='dayinfo notOpen'>" + "no openings</span>";
            }
        }
    }
    for(var j=0; j<leftAfter; j++){
        fill.innerHTML += "<div class='noday'>";
    }

    // checkDay(day1,days);
}



function monthUp(){
    monthsOff++;
    var year = document.getElementById("yearNum").innerHTML;
    var month = document.getElementById("monthName").innerHTML;
    var monthNum = months.indexOf(month);
    year = parseInt(year);
    if(monthNum < 11){
        monthNum++;
    } else {
        monthNum = 0;
        year += 1;
    }
    fillData(monthNum, year);
}



function monthDown(){
    monthsOff --;
    var year = document.getElementById("yearNum").innerHTML;
    var month = document.getElementById("monthName").innerHTML;
    var monthNum = months.indexOf(month);
    year = parseInt(year);
    if(monthNum >0){
        monthNum--;
    } else {
        monthNum = 11;
        year -= 1;
    }

    fillData(monthNum, year);
}



function pickDay(day1,day,monthNum,year){
    var document = db.collection("defaults").doc("1");
    document.get().then(function(doc) {
        if (doc.exists) {
            var weekDay = (day + day1 - 1)%7;
            var availability = [];
            if(weekDay == 0){
                availability = doc.data().monday;
            } else if(weekDay == 1){
                availability = doc.data().tuesday;
            } else if(weekDay == 2){
                availability = doc.data().wednesday;
            } else if(weekDay == 3){
                availability = doc.data().thursday;
            } else if(weekDay == 4){
                availability = doc.data().friday;
            } else if(weekDay == 5){
                availability = doc.data().saturday;
            } else if(weekDay == 6){
                availability = doc.data().sunday;
            }

            // console.log(availability);

            var monthyear = "";
            var m = monthNum + 1;
            if(m < 10){
                monthyear = "0";
            }
            monthyear += m;
            monthyear += year;

            var dayID = "";
            if(day < 10){
                dayID = "0";
            }
            dayID += day;
            var dayData = db.collection("months").doc(monthyear).collection("Days").doc(dayID);
            dayData.get().then(function(doc2) {
                if(doc2.exists){
                    var apps = doc2.data().Appointments;
                    for(var a =0; a<apps.length; a++){
                        var time = apps[a].Time;
                        time = time.substring(0,time.length-2);
                        if(time[0] == "0"){
                            time = time[1]
                        }
                        var timeIndex;
                        if(time > 4){
                            timeIndex = time - 8;
                        } else {
                            timeIndex = time + 4;
                        }
                        availability[timeIndex] = 0;
                    }
                    // console.log(apps);

                    fillTimes(day,monthNum,year,availability);
                } else {
                    // console.log("No appointments yet");
                    fillTimes(day,monthNum,year,availability);
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function fillTimes(day, monthNum, year, availability){
    var popup = document.getElementById("popupContent");
    var popDay = document.getElementById("popupDate");
    popDay.innerHTML = "" + months[monthNum] + " " + day;
    popup.innerHTML = "";
    var first = true;
    for(var i=0; i<availability.length;i++){
        if(availability[i] == 1){
            var timeSlot = times[i] + ":00";
            if(i < 4){
                timeSlot += " AM";
            } else {
                timeSlot += " PM";
            }

            if(first){
                popup.innerHTML += "<div><input type='radio' checked id='" + times[i] + "' name='time' value='" + times[i] + "' onclick='updateTime(" + this.value + ")'><label for='"+ times[i] + "'>" + timeSlot + "</label></div>"
                first = false;
            } else {
                popup.innerHTML += "<div><input type='radio' id='" + times[i] + "' name='time' value='" + times[i] + "' onclick='updateTime(" + this.value + ")'><label for='"+ times[i] + "'>" + timeSlot + "</label></div>"
            }

            // console.log(timeSlot);
        }
    }

    document.getElementById("popupBox").classList.remove("hidden");
    document.getElementById("popupBox").classList.add("popup");

}

function checkDay(day1,days, monthNum, year){
    // console.log("filling out default timeslots");

    var baseSlots = [0,0,0,0,0,0,0];
    var document = db.collection("defaults").doc("1");
    document.get().then(function(doc) {
        if (doc.exists) {
            var monday = doc.data().monday;
            var tuesday = doc.data().tuesday;
            var wednesday = doc.data().wednesday;
            var thursday = doc.data().thursday;
            var friday = doc.data().friday;
            var saturday = doc.data().saturday;
            var sunday = doc.data().sunday;

            for(var i=0; i<monday.length; i++){
                if(monday[i] == 1){
                    baseSlots[0]++;
                }
                if(tuesday[i] == 1){
                    baseSlots[1]++;
                }
                if(wednesday[i] == 1){
                    baseSlots[2]++;
                }
                if(thursday[i] == 1){
                    baseSlots[3]++;
                }
                if(friday[i] == 1){
                    baseSlots[4]++;
                }
                if(saturday[i] == 1){
                    baseSlots[5]++;
                }
                if(sunday[i] == 1){
                    baseSlots[6]++;
                }
            }

            var monthyear = "";
            var m = monthNum + 1;
            if(m < 10){
                monthyear = "0";
            }
            monthyear += m;
            monthyear += year;
            // console.log(monthyear);

            var leftover = 7 - days%7;
            var leftB4 = day1;

            // console.log(leftover, leftB4, day1);

            var monthSlots = [];
            for(var z=0; z<days; z++){
                var weekDayNum = (z + leftB4)%7;
                // console.log(weekDayNum);
                // console.log(z, weekDayNum);
                // console.log(z+1,weekDayNum);
                monthSlots[z] = baseSlots[weekDayNum];
            }
            // console.log(monthSlots);

            // console.log("checking for booked appointments");

            var monthData = db.collection("months").doc(monthyear).collection("Days");
            monthData.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var day = doc.id;
                    var numApps = doc.data().Appointments.length;
                    day = "" + day;
                    if(day[0] == "0"){
                        day = day[1];
                    }
                    monthSlots[day-1] -= numApps;
                    
                    // console.log(day, numApps);
                });

                // while(daysChecked < days){

                // }

                fillDays(day1,days, monthNum, year, monthSlots);

            });

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}





function pickTime(){
    // console.log(time);
    var year = document.getElementById("yearNum").innerHTML;
    var month = document.getElementById("monthName").innerHTML;
    var monthNum = months.indexOf(month);

    var monthyear = "";
    var m = monthNum + 1;
    if(m < 10){
        monthyear = "0";
    }
    monthyear += m;
    monthyear += year;

    var date = document.getElementById("popupDate").innerHTML;
    // console.log(date);
    var space = date.indexOf(" ");
    var day = date.substring(space+1);
    // console.log(day);
    dayStr = "";
    if(day < 10){
        dayStr = "0";
    }
    dayStr += day;
    var time = "";

    for(var i=1; i<=12; i++){
        var rad = document.getElementById(i);
        if(rad){
            if(rad.checked){
                time = document.getElementById(i).value;
            }
        }
    }
    var timeNum = time;
    // console.log(timeNum);
    var timeString = "" + time + ":00";
    if(timeNum > 6 && timeNum < 12){
        timeString += " AM";
    } else{
        timeString += " PM";
    }
    if(time.length == 1){
        time = "0" + time;
    }
    time = time + "00";

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;


    if(name.length < 1){
        faultName = true;
        alert("You Must Enter a Name and valid Email")
    } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        
        console.log(name, email, time);


        var doc = db.collection("months").doc(monthyear).collection("Days").doc(dayStr);
        doc.get().then(function(doc2) {
            if(doc2.exists){
                var apps = doc2.data().Appointments;
                apps.push({
                    "Time": time,
                    "Name": name,
                    "Email": email
                });
                doc.update({
                    "Appointments": apps,
                })
                alert("Appointment Scheduled for " + date + " at " + timeString);
            } else {
                // console.log("No appointments yet");

                var apps = [];
                apps.push({
                    "Time": time,
                    "Name": name,
                    "Email": email
                });
                doc.set({
                    "Appointments": apps,
                })
                alert("Appointment Scheduled for " + date + " at " + timeString);
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

        document.getElementById("popupBox").classList.remove("popup");
        document.getElementById("popupBox").classList.add("hidden");

    } else {
        alert("You must enter a name and valid Email")
    }
}

function updateTime(newTime){
    time = newTime;
}