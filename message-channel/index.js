/*jshint browser:true*/
(function() {
  var openPorts = function () {
    var button = document.querySelector('.open-port-btn');
    button.setAttribute('disabled', 'disabled');

    var messageChannel = new MessageChannel();
    var p1 = messageChannel.port1;
    var p2 = messageChannel.port2;
    window.p1 = p1;

    tryPassPort('#page-1', p1);
    tryPassPort('#page-2', p2);
  };

  // Try continue to try and pass the port until
  // the iframe accepts it. This can help ensure that
  // if the frame has not yet loaded the message will retry
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

  window.addEventListener('load', function () {
    var button = document.querySelector('.open-port-btn');
    button.addEventListener('click', openPorts, false);
  });
  window.addEventListener('message', onMessage, false);
}).call(this);
