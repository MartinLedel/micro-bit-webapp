(function () {
    'use strict';

    // Different DOM elements for getting inputs
    var roomBtn = document.getElementById('room');
    var height = document.getElementById('height');
    var width = document.getElementById('width');
    var roomName = document.getElementById('roomname');
    var roomChannel = document.getElementById('channel');
    var sensorNum = document.getElementById('sensornum');
    var sensorBtn = document.getElementById('sensorbtn');
    var sensorPlaceBtn = document.getElementById('sensorplace');
    var sensorDeleteBtn = document.getElementById('sensordelete');
    var sensorSelectedBtn = document.getElementById('sensorselectedbtn');
    var myRoomName = document.getElementById('myroomname');
    var myContent = document.getElementsByClassName('target')[0];
    var tempBox = document.createElement("div");
    //Some global variables for easy access
    var tempSensor;
    var sensorArr = [];
    var sensorSavedArr = [];
    var selectorChecker = false;
    var active = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;

    //Draws the room
    if (height.value && width.value && roomName.value && roomChannel.value) {
        myRoomName.innerHTML = "<p>" + roomName.value + "</p>";
        tempBox.classList.add("box");
        tempBox.style.height = (height.value * 2.5) + "em";
        tempBox.style.width = (width.value * 2.5) + "em";
        myContent.appendChild(tempBox);
    }

    //Get the id and x/y coordinates of the sensors
    var hiddenSensorId = document.getElementsByClassName("hiddensensorid");
    var hiddenSensorX = document.getElementsByClassName("hiddensensorx");
    var hiddenSensorY = document.getElementsByClassName("hiddensensory");

    //Places all the saved sensors in the room
    if (hiddenSensorId) {
        for (let i = 0; i < hiddenSensorId.length; i++) {
            tempSensor = document.createElement("div");
            tempSensor.innerHTML = hiddenSensorId[i].value;
            tempSensor.classList.add("sensor");
            tempSensor.style.width = 2 + "em";
            tempSensor.style.left = 0;
            tempSensor.style.top = 0;
            setTranslate(hiddenSensorX[i].value, hiddenSensorY[i].value, tempSensor);
            tempSensor.addEventListener("click", selectSensor, false);

            sensorSavedArr.push(hiddenSensorId[i].value, hiddenSensorX[i].value, hiddenSensorY[i].value);

            myContent.appendChild(tempSensor);
        }
    }

    roomBtn.addEventListener("click", updateRoom);

    sensorBtn.addEventListener("click", spawnSensor);

    sensorPlaceBtn.addEventListener("click", placeSensor);

    sensorDeleteBtn.addEventListener("click", deleteSensor);

    sensorSelectedBtn.addEventListener("click", function() {
        tempSensor = document.getElementsByClassName('selected')[0];

        getSensor(tempSensor);
    });

    //Function for getting data from the database for a specific sensor
    function getSensor(sensor) {
        var sensorTarget = document.getElementById('sensortarget');
        sensorTarget.innerHTML = "";

        fetch("/getsensor?id=" +  sensor.innerHTML + "&channel=" + roomChannel.value
        ).then(function (response) {
            return response.json();
        }).then(function(result) {
            result.data.forEach(function(sensor) {
                let tableRow = document.createElement("tr");
                let tableTemp = document.createElement("td");
                let tableLight = document.createElement("td");
                let tableUpload = document.createElement("td");

                tableTemp.textContent = sensor.Tempature;
                tableRow.appendChild(tableTemp);
                tableLight.textContent = sensor.Light;
                tableRow.appendChild(tableLight);
                tableUpload.textContent = sensor.Uploaded;
                tableRow.appendChild(tableUpload);
                sensorTarget.appendChild(tableRow);
            });
        }).catch(function(error) {
            console.log('The fetch operation failed due to the following error: ', error.message);
        });
    }

    //Function if the user decides to update the measurements of the room
    function updateRoom() {
        if (height.value && width.value && roomName.value && roomChannel.value) {
            myRoomName.innerHTML = "<p>" + roomName.value + "</p>";
            if (tempBox.classList.contains("box")) {
                tempBox.style.height = (height.value * 2.5) + "em";
                tempBox.style.width = (width.value * 2.5) + "em";
            } else {
                tempBox.classList.add("box");
                tempBox.style.height = (height.value * 2.5) + "em";
                tempBox.style.width = (width.value * 2.5) + "em";
                myContent.appendChild(tempBox);
            }
        }
    }

    //Function that takes the id from the choosen sensor and spawns it for the user to place in the room
    function spawnSensor() {
        if (tempBox.classList.contains("box") && !(selectorChecker) && !(sensorArr.includes(sensorNum.value)) && !(sensorSavedArr.includes(sensorNum.value))) {
            selectorChecker = true;
            tempSensor = document.createElement("div");

            tempSensor.innerHTML = sensorNum.value;
            tempSensor.classList.add("sensor");
            tempSensor.classList.add("selected");
            tempSensor.style.left = 0;
            tempSensor.style.top = 0;

            tempSensor.addEventListener("touchstart", dragStart, false);
            tempSensor.addEventListener("touchend", dragEnd, false);
            tempSensor.addEventListener("touchmove", drag, false);

            tempSensor.addEventListener("mousedown", dragStart, false);
            tempSensor.addEventListener("mouseup", dragEnd, false);
            tempSensor.addEventListener("mousemove", drag, false);

            myContent.appendChild(tempSensor);
        }
    }

    //Function that takes the id of the placed sensor and saves it to an array
    function placeSensor() {
        if (tempBox.classList.contains("box") && selectorChecker) {
            selectorChecker = false;
            tempSensor = document.getElementsByClassName('selected')[0];
            tempSensor.removeEventListener("touchstart", dragStart);
            tempSensor.removeEventListener("touchend", dragEnd);
            tempSensor.removeEventListener("touchmove", drag);

            tempSensor.removeEventListener("mousedown", dragStart);
            tempSensor.removeEventListener("mouseup", dragEnd);
            tempSensor.removeEventListener("mousemove", drag);
            tempSensor.classList.remove("selected");
            tempSensor.addEventListener("click", selectSensor, false);

            initialX = 0;
            initialY = 0;
            xOffset = 0;
            yOffset = 0;

            let sensorData = document.getElementById('sensordata');
            sensorArr.push(tempSensor.innerHTML, currentX, currentY);
            sensorData.value = sensorArr;
            currentX = 0;
            currentY = 0;
        }
    }

    //Function that deletes either the sensor if its not saved to the database. Or deletes it if it is already saved
    function deleteSensor() {
        let sensorData = document.getElementById('sensordata');
        let sensorDataArr = sensorData.value.split(",");
        let i;
        tempSensor = document.getElementsByClassName('selected')[0];

        if (tempSensor && sensorDataArr.includes(tempSensor.innerHTML)) {
            i = sensorDataArr.indexOf(tempSensor.innerHTML);
            sensorDataArr.splice(i, 1);
            sensorDataArr.splice(i, 1);
            sensorDataArr.splice(i, 1);
            sensorData.value = sensorDataArr;
            i = sensorDataArr.indexOf(tempSensor.innerHTML);
            sensorArr.splice(i, 1);
            sensorArr.splice(i, 1);
            sensorArr.splice(i, 1);
            myContent.removeChild(tempSensor);
        } else if (sensorSavedArr.includes(tempSensor.innerHTML)) {
            fetch("/deletesensor?id=" +  tempSensor.innerHTML + "&channel=" + roomChannel.value
            ).catch(function(error) {
                console.log('The fetch operation failed due to the following error: ', error.message);
            });
            myContent.removeChild(tempSensor);
        }
    }

    //Function that lets the user click on a sensor and highlights it
    function selectSensor(e){
        tempSensor = document.getElementsByClassName('selected')[0];
        if (e.target.classList.contains("selected")) {
            e.target.classList.toggle("selected");
        } else if (tempSensor) {
            tempSensor.classList.remove("selected");
            e.target.classList.add("selected");
        } else {
            e.target.classList.add("selected");
        }
    }

    //Here are some functions that makes the sensor drag able
    function dragStart(e) {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target === tempSensor) {
            active = true;
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;

        active = false;
    }

    function drag(e) {
        if (active) {
            e.preventDefault();
            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }
            xOffset = currentX;
            yOffset = currentY;
            setTranslate(currentX, currentY, tempSensor);
      }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }
})();
