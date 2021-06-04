chrome.runtime.onConnect.addListener(function (externalPort) {
  externalPort.onDisconnect.addListener(function () {
    if (typeof observer !== 'undefined' && typeof port !== 'undefined') {
      observer.disconnect();
      port.disconnect();
    };
  });
});

/*buttons.addEventListener('click',function(){
  chrome.runtime.sendMessage({message:"showingAns", do: false});
}); */

var testInps = document.getElementsByClassName("test_inp");
var test_id = document.getElementsByName('test_id')[0];
var stat_id = document.getElementsByName('stat_id')[0];

var maxTime;



var hasCTasks;
for (var i = 0; i < testInps.length; i++) {
  if (testInps[i].name.match(/answer_([0-9]*?)_c/g) !== null) {
    hasCTasks = true;
  };
};

//checks if the test was created from a template i.e. is randomized on reloads and stuff

/*
//get a reference to the div containing the test body (which now has a random class)
var testContent = document.getElementsByClassName('new_header')[0].parentElement;
var isRandomized = false;

//if the string saying it was a templated variant is present, disable autosolve
if (testContent != undefined){
  if (testContent.innerHTML.indexOf('Вариант составлен по шаблону') > -1) {
      isRandomized = true;
  }
}
*/

var countdChecked = false;
var answChecked = true;

var autosend = true;

var observer;
var port;

function modifyPage(snippet) {
  var script = document.createElement('script');
  script.textContent = snippet;
  (document.head||document.documentElement).appendChild(script);
  script.remove();
};

var timerIni = '(' + function() {
  clearTimeout(window.ticker);
  window.tick();
} + ')();';

var timerRnm = '(' + function() {
  ticker = window.setInterval(tick,1000);
} + ')();';

var timerStp = '(' + function() {
  clearTimeout(window.ticker);
} + ')();';

var ansThroughSaveShow = '(' + async function() {
  async function postData(url = '', t) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: t // body data type must match "Content-Type" header
    });
    return await response.text(); // parses JSON response into native JavaScript objects
  }

  var questionBodyIds = document.getElementsByClassName("test_inp");

  var parser = document.createElement('a');
  parser.href = window.location.toString();

  for (var i = 0; i < questionBodyIds.length; i++) {
    item = questionBodyIds[i];
    var FD = new FormData;
    if(item.name.indexOf("answer") > -1){
      FD.append('stat_id', questionBodyIds[1].value);
      FD.append('name', item.name.replace("c", ""));
      FD.append('answer[]', item.value);
      await postData("https://" + parser.hostname + "/test?a=save_part&ajax=1", FD)
    }
  }

  window.open("https://" + parser.hostname + "/pupil?id=0&test=" + questionBodyIds[1].value);
} + ')();';

var ansThroughSaveAuto = '(' + async function() {
  async function postData(url = '', t) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: t // body data type must match "Content-Type" header
    });
    return await response.text(); // parses JSON response into native JavaScript objects
  }

  var questionBodyIds = document.getElementsByClassName("test_inp");

  var parser = document.createElement('a');
  parser.href = window.location.toString();

  for (var i = 0; i < questionBodyIds.length; i++) {
    item = questionBodyIds[i];
    var FD = new FormData;
    if(item.name.indexOf("answer") > -1){
      FD.append('stat_id', questionBodyIds[1].value);
      FD.append('name', item.name.replace("c", ""));
      FD.append('answer[]', item.value);
      await postData("https://" + parser.hostname + "/test?a=save_part&ajax=1", FD)
    }
  }

  postData("https://" + parser.hostname + "/pupil?id=0&test=" + questionBodyIds[1].value).then((tt) => {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(tt, 'text/html');

    var answersParsed = [];
    var answers = htmlDoc.getElementsByClassName("res_row");
    for (var i = 0; i < answers.length; i++) {
      answersParsed.push(answers[i].cells[4].innerText);
    };

    var z = 0;
    for (var i = 0; i < questionBodyIds.length; i++) {
      if (questionBodyIds[i].name.match(/answer/g) == "answer") {
        questionBodyIds[i].value = answersParsed[z];
        z++;
      };
    };
    $(document).ready(function(){
      submit_form();
    });

  })
} + ')();';

var ansThroughSaveAutoNC = '(' + async function() {
  async function postData(url = '', t) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: t // body data type must match "Content-Type" header
    });
    return await response.text(); // parses JSON response into native JavaScript objects
  }

  var questionBodyIds = document.getElementsByClassName("test_inp");

  var parser = document.createElement('a');
  parser.href = window.location.toString();

  for (var i = 0; i < questionBodyIds.length; i++) {
    item = questionBodyIds[i];
    var FD = new FormData;
    if(item.name.indexOf("answer") > -1){
      FD.append('stat_id', questionBodyIds[1].value);
      FD.append('name', item.name.replace("c", ""));
      FD.append('answer[]', item.value);
      await postData("https://" + parser.hostname + "/test?a=save_part&ajax=1", FD)
    }
  }

  postData("https://" + parser.hostname + "/pupil?id=0&test=" + questionBodyIds[1].value).then((tt) => {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(tt, 'text/html');

    var answersParsed = [];
    var answers = htmlDoc.getElementsByClassName("res_row");
    for (var i = 0; i < answers.length; i++) {
      if(answers[i].cells[2].innerText.indexOf("C") == -1){
        answersParsed.push(answers[i].cells[4].innerText);
      }
    };

    var z = 0;
    for (var i = 0; i < questionBodyIds.length; i++) {
      if (questionBodyIds[i].name.match(/answer/g) == "answer" && questionBodyIds[i].name.indexOf("c") == -1) {
        console.log(answersParsed[z]);
        questionBodyIds[i].value = answersParsed[z];
        z++;
      };
    };

  })
} + ')();';

var rtview = document.getElementById("rtview");

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    switch(message.type) {

      case "hasCTasks":
          sendResponse({type:"hasCTasks", state:hasCTasks});
      break;

      case "countdState":
      if (typeof maxTime !== "undefined") {
        sendResponse({type:"countdState", state: countdChecked, limit:true});
        if (countdChecked) {
          port = chrome.runtime.connect({name: "currTime"});

          port.onDisconnect.addListener(function(event) {
            observer.disconnect();
          });

          observer = new MutationObserver(function(mutations){
            mutations.forEach(function(mutation){
              port.postMessage({time:document.getElementById('timer').value});
            });
          });

          var config = {characterData: false, attributes: false, childList: true, subtree: false};
          observer.observe(rtview, config);

          }else{
          if (observer != undefined){
            observer.disconnect();
          };
        };
      }else{
        sendResponse({type:"countdState", state: true, limit:false});
      };
      break;

      case "tmPos":
          sendResponse({type:"tmPos", pos:document.getElementById('timer').value});
      break;

      case "maxTime":
      if (typeof maxTime !== 'undefined') {
        sendResponse({type:"maxTime", max:maxTime});
      }else{
        sendResponse({type:"maxTime", max:"1:00:00"});
      };
      break;

      case "setTimer":
        document.getElementById('timer').value = message.time;
        if (typeof maxTime !== 'undefined') {
          var TIMEMAX = parseInt(message.max)+1;

          var timerSet = '(' + function(TIMEMAX) {
            t = document.getElementById('timer').value;
            document.getElementById('timer').value = t;
            document.getElementById('tview').innerHTML=ftime(t);
            document.getElementById('dtview').innerHTML=ftime(t);
            document.getElementById('rtview').innerHTML=ftime(TIMEMAX-t);
            document.getElementById('drtview').innerHTML=ftime(TIMEMAX-t);
          } + ')(' + JSON.stringify(TIMEMAX) + ')';

          modifyPage(timerSet);
        };
      break;

      case "doAutoSending":
        sendResponse({type:"doAutoSending", do:autosend});
      break;

      case "ticker":
        if (message.set) {
          if (confirm('Автоотсчёт сдаст работу учителю по истечении времени АВТОМАТИЧЕСКИ. Вы точно хотите его активировать?')) {
            document.getElementById('timer').value = 0;
            modifyPage(timerRnm);
            countdChecked = true;
          };
        } else {
          modifyPage(timerStp);
          countdChecked = false;
        };
      break;

      case "autosend":
        autosend = message.set;
      break;

      case "hax":
      if (message.auto) {

        chrome.runtime.sendMessage({message:"sendTime", time: document.getElementById('timer').value});
        if(hasCTasks || !autosend){
          modifyPage(ansThroughSaveAutoNC).then;

        }else{
          modifyPage(ansThroughSaveAuto);
        }
      }else{

        modifyPage(ansThroughSaveShow);
      };

      break;
    };
  });

//IMPORTANT -- ONLY GET MAXTIME after TICK()
if (rtview != undefined) {
  modifyPage(timerIni);
  maxTime = rtview.innerText;
};


