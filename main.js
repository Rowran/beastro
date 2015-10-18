var myFirebaseRef = new Firebase("https://beastro-app.firebaseio.com/");
var usersRef = myFirebaseRef.child("user");
var userEventsRef;
var userEventsRefEvents;
var isArmed = false;
var lastEvent;

$(document).ready(function(){

  // js for icon animation
  $('#nav-icon3').click(function(){
    $(this).toggleClass('open');
  });

  // change text for feed/fed button and hint text
  $('#fed-toggle').click(function(){
    $('#circle').toggleClass("unlocked");
    // if currently fed, tell user
    if(this.checked){
      $('#button-text').text("FED");
      $('#suppl-text').text("Your Beastro bowl is currently: FULL!");
      usersRef.child(getName()).update({
        "armed": true
      });
    } else{
      // if currently not fed, prompt to feed
      $('#button-text').text("FEED ME");
      $('#suppl-text').text("Press the button to fill your Beastro bowl!");
      usersRef.child(getName()).update({
        "armed": false
      });
    }
  });

  var feedSound = new Audio('callAAA.mp3');
  $('#feed').click(function(){
    call911.play();
  });
});

function setName(username){
  localStorage.setItem("username", username);
  usersRef.child(username).update({
    "email" : username + "@" + username + ".com",
    "location" : "Toronto, ON",
    "armed": false
  });
}
function getName(){
  return localStorage.getItem("username");
}
function clearUser(){
  localStorage.setItem("username", null);
}
function getHistory(){
  userEventsRefEvents = myFirebaseRef.child("user/"+getName()+"/events");
  userEventsRefEvents.orderByChild("time").on('value', function(datasnapshot){
    eventDataObject = datasnapshot.val();
    document.getElementById('events').innerHTML="";
    for(i in eventDataObject){
      var p = document.createElement('p');
      p.className = 'history-event';
      p.innerHTML = '<h5 class="history-event-type">' + eventDataObject[i].event.toUpperCase() +
        '</h5><p>Silenced: ' + eventDataObject[i].silence + '</p><p>Date: ' +
        new Date(eventDataObject[i].time*1000).toLocaleString() + '</p>';
      document.getElementById('events').appendChild(p);
    }
  });
}
