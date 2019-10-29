(function () {
    'use strict';

    var roomBtn = document.getElementById('room');
    var height = document.getElementById('height');
    var width = document.getElementById('width');
    var roomName = document.getElementById('roomname');
    var roomChannel = document.getElementById('channel');
    var myRoomNameDiv = document.getElementById('myroomname');
    var myContent = document.getElementsByClassName('target')[0];
    var tempBox = document.createElement("div");

    roomBtn.addEventListener("click", createRoom);
    
    function createRoom() {
        if (height.value && width.value && roomName.value && roomChannel.value) {
            myRoomNameDiv.innerHTML = "<p>" + roomName.value + "</p>";
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
})();
