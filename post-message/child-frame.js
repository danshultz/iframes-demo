/*jshint browser:true*/
/*globals TwoWay*/
(function (Messenger, $) {
  // General Setup
  // Define app namespace, etc
  this.App = { "Com": {} };
  var messenger = window.App.Com.messenger = new TwoWay.Messenger();

  // Set the domain to be used to verify cross iframe messaging
  var parentDomain = "0.0.0.0";
  var iframeId;
  var parentWindow;

  // On document ready
  $(document).ready(function () {
    // subscribe to a registration message which will be only fired once.
    messenger.subscribe({
      message: "window.register",
      to: onIframeInitialize,
      from: parentDomain
    });
  });

  // Initialze any iframe necessary start up behavior
  var onIframeInitialize = function (data, callingWindow) {
    // On intialization, an id will be provided to identify
    // the iframe uniquely for all further messaging
    iframeId = this.App.Com.iframeId = data.id;
    // set the parent window so this does not need to be looked up
    parentWindow = this.App.Com.parentWindow = callingWindow;

    /* Run a set of initializations */
    publishSize();
    messenger.subscribe({
      message: "window.resize",
      to: publishSize,
      from: parentDomain
    });
  };

  var publishSize = function () {
    var data = {
      id: iframeId,
      "height": $(document).height()
    };

    // publish message to parent to ensure proper sizing
    messenger.publish({
      message: "iframe.size",
      'with': data,
      to: parentWindow
    });
  };

}).call(this, this.Messenger, this.$);
