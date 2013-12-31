/*jshint browser:true*/
(function() {
  var onLoad = function () {
    var messageChannel = new MessageChannel();
    var p1 = messageChannel.port1;
    var p2 = messageChannel.port2;
    window.p1 = p1;

    tryPassPort('#page-1', p1);
    tryPassPort('#page-2', p2);
  };

  var tryPassPort = function (id, port) {
    var page = document.querySelector(id);

    var portSyncAck = function (e) {
      if (e.data === "portSyncAck" && e.source === page.contentWindow) {
        window.clearInterval(interval);
        e.source.postMessage("portopen", e.origin, [port]);
      }
    }

    var portSyncRquest = function () {
      page.contentWindow.postMessage("portSyncReady", "*");
    };

    window.addEventListener('message', portSyncAck);
    var interval = window.setInterval(portSyncRquest, 100);
  }

  var onMessage = function (e) {
    if(e.data === "connectFrame") {
      var page2 = document.querySelector("#page-2");
      page2.contentWindow.postMessage("portopen", "*", e.ports);
    }
  };

  window.addEventListener('load', onLoad, false);
  window.addEventListener('message', onMessage, false);
}).call(this);
