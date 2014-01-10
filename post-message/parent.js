/*jshint browser:true*/
/*globals TwoWay*/
(function ($) {
  this.App = { "Com": {} };
  var messenger = window.App.Com.messenger = new TwoWay.Messenger();
  // ensure domain is defined as we want to constrain who we are communicating with
  var theDomain = "http://localhost:" + window.location.port;

  $(document).ready(function () {

    $('iframe').each(function () {

      var iframe = this,
      theWindow = iframe.contentWindow;

      // subscribe to the size event
      messenger.subscribe({
        message: 'iframe.size',
        to: resizeFrame,
        from: theDomain
      });

      // every time the frame is loaded, offer it a registration event
      $(iframe).on('load', function () {
        var data = { id: iframe.id };
        messenger.publish({
          message: "window.register",
          'with': data,
          to: theWindow,
          on: theDomain
        });
      });

      // Notify iframe of resizes
      $(window).on('resize.iframes', notifyResize(theWindow));
    });
  });


  var resizeFrame = function (data) {
    $('#' + data.id).css({ height: data.height });
  };


  var notifyResize = function (theWindow) {
    return debounce(function () {
      messenger.publish({
        message: 'window.resize',
        to: theWindow,
        on: theDomain
      });
    }, 100);
  };


  var debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

}).call(window, window.$);
