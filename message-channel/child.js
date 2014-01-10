/*jshint browser:true*/
(function() {
  var port;

  var onMessage = function (e) {
    if (e.data === "portSyncReady") {
      e.source.postMessage("portSyncAck", e.origin);
    }

    if (e.data === "portopen") {
      getEl('#post-button').removeAttribute('disabled');
      port = e.ports[0];
      output('port opened');
      port.addEventListener('message', function (e) { output(e.data); });
      port.start();
    }
  };

  var onLoad = function () {
    getEl('#post-button').addEventListener('click', sendMessage);
  }

  var sendMessage = function () {
    var text = getEl('#message').value;
    port.postMessage(text);
  }

  var getEl = function (selector) {
    return document.querySelector(selector);
  }

  var output = function (text) {
    var container = getEl('#output');
    var textContainer = document.createElement('div');
    textContainer.textContent = text;
    textContainer.style.borderBottom = "solid #FDF 1px";
    container.insertBefore(textContainer, container.firstChild);
  };


  window.addEventListener('message', onMessage, false);
  window.addEventListener('load', onLoad, false);
}).call(this);
