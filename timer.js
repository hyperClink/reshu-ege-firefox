var contPort;

chrome.runtime.onConnect.addListener(function(port) {
  contPort = port;
  console.assert(port.name == "currTime");
  port.onMessage.addListener(function(msg) {
    tm = msg.time;
    output.innerHTML = ftime(tm);
    document.getElementById("myRange").value = tm;
  });
});

function getCurrentTabId(cb) {
    var query = {active: true, currentWindow: true};
    chrome.tabs.query(query, function (tabArray) {
        cb(tabArray[0].id);
    });
};

function connectToCurrentTab () {
    getCurrentTabId(function(currentTabId) {
       var onClosePort = chrome.tabs.connect(currentTabId, {name: "popup"});
    });
};

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");

var inHour = document.getElementById("hour");
var inMin = document.getElementById("minute");
var inSec = document.getElementById("second");

var elements = document.getElementsByClassName("validate");

var countd = document.getElementById("countd");
var answ = document.getElementById("answ");
var answHax = document.getElementById("answHax");

var autol = document.getElementById("autol");
var showl = document.getElementById("showl");

var autosend = document.getElementById("autosend");
var autos = document.getElementById("autoS");

var parsedMaxTime = 0;

var tm = 1,
tmInH = 0,
tmInM = 1,
tmInS = 40,
sec = 0,
min = 0,
h = 0;

function parseMaxTime(time) {
  slider.max = 0;
  var l = 0;
  var n = 0;
  var tmp = 0;
  for (var i = time.length-1; i > -2; i--) {
    if (time.charAt(i) != ":" && i > -1){
      tmp += parseInt(time.charAt(i))*(Math.pow(10, n))
      n++;
      }else{
      switch (l) {
        case 0:
        slider.max = tmp;
        inSec.value = tmp;
        tmInS = tmp;
          break;

        case 1:
        slider.max = parseInt(slider.max) + 60*tmp;
        inMin.value = tmp;
        tmInM = tmp;
          break;

        case 2:
        slider.max = parseInt(slider.max) + 3600*tmp;
        inHour.value = tmp;
        tmInH = tmp;
          break;
        };
      l++;
      tmp = 0;
      n = 0;
    };
  };
  parsedMaxTime = slider.max;
};

function ftime(tm){
  sec = tm % 60;
  tm = (tm-sec)/60;
  min = tm % 60;
  h = (tm-min)/60;
  if (String(sec).length == 1) sec='0'+sec;
  if (String(min).length == 1) min='0'+min;
  return h+':'+min+':'+sec;
};

function send(data) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, data);
    });
};

function exchange(data) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, data, function(response) {
        switch (response.type) {

          case "countdState":
          if (response.limit) {
            if (response.state) {
              connectToCurrentTab();
              countd.checked = true;
              for (var i = 0; i < elements.length; i++) {
                elements[i].disabled = true;
              };
            };
          }else{
            countd.checked = true;
            countd.disabled = true;
            document.getElementById("autoCD").innerText = "Автоматический отсчет всегда включён в работах без лимита таймера."
          };
          break;

          case "tmPos":
          tm = response.pos;
          output.innerHTML = ftime(tm);
          document.getElementById("myRange").value = tm;
          break;

          case "maxTime":
          parseMaxTime(response.max);
          break;

          case "hasCTasks":
          if (response.state) {
            answHaxAuto.innerHTML = 'Авторешение 1 части';
            autohSubtitle.innerHTML = 'авторешение не поддерживает часть C.'
            autosend.disabled = "true"
            autosend.checked = false;
            autos.innerHTML = 'Автоотправка не поддерживает часть C.'
          };
          break;

          case "doAutoSending":
          if (response.do && autosend.disabled !== true) {
            autosend.checked = true;
          };
          break;

        };
      });
    });
};

function updateTimerLimits() {
  slider.max = (tmInH*3600)+(tmInM*60)+tmInS*1;
  output.innerHTML = ftime(slider.value);
};

document.addEventListener('DOMContentLoaded', function() {
    exchange({type:"countdState"});
    exchange({type:"maxTime"});
    exchange({type:"tmPos"});
    exchange({type:"hasCTasks"});
    exchange({type:"doAutoSending"});
  });

slider.oninput = function() {
  tm = this.value;
  output.innerHTML = ftime(tm);
  send({type:"setTimer", time:tm, max:parsedMaxTime});
};

inHour.oninput = function() {
  this.value = Math.max(this.value, 0);
  tmInH = this.value;
  updateTimerLimits()
};

inMin.oninput = function() {
  this.value = Math.min(this.value, 60);
  this.value = Math.max(this.value, 0);
  tmInM = this.value;
  updateTimerLimits()
};

inSec.oninput = function() {
  this.value = Math.min(this.value, 60);
  this.value = Math.max(this.value, 0);
  tmInS = this.value;
  updateTimerLimits()
};

autosend.oninput = function() {
  if (this.checked) {
    send({type:"autosend", set:true});
  } else {
    send({type:"autosend", set:false});
  };
};

countd.oninput = function() {
  if (this.checked) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = true;
    };
    exchange({type:"maxTime"});
    send({type:"ticker", set:true});
    connectToCurrentTab();
  } else {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = false;
    };
    send({type:"ticker", set:false});
    contPort.disconnect();
  };
};

answHax.onclick = function() {
  showl.style="width:35px; height:35px;"
  send({type:"hax", auto:false});
  answHax.disabled = true;
  answHaxAuto.disabled = true;
};

answHaxAuto.onclick = function() {
  autol.style="width:35px; height:35px;"
  send({type:"hax", auto:true});
  answHax.disabled = true;
  answHaxAuto.disabled = true;
};
