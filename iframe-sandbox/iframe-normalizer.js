/*jshint browser:true, expr:true*/
/*globals $:true*/
(function () {
  var resizeInterval = 42;
  //var resizeLimit = 1000 / 41 * 5;
  var resizeLimit = 2;

  var initialize = function () {
    $('iframe[data-normalize]').each(function () {
      var attrs = $(this).attr('data-normalize').split(' ');
      console.log('loading iframe');
      for (var i in attrs) {
        normalize[attrs[i]].call(this);
      }
    });
  };

  var normalize = {
    size: function () {
      var state = this.contentDocument.readyState;
      if (state === "complete") {
        normalizeIframe.call(this);
      } else {
        $(this).on('load', normalizeIframe);
      }

    },
    css: function () {
      var iframe = this;
      var doc = iframe.contentDocument;

      var getHref = function (i, el) { return $(el).attr('href'); };

      var loadCss = function (i, cssUrl) {
        var deferred = $.Deferred();

        var link = doc.createElement('link');
        link.type = "text/css";
        link.rel = "stylesheet";
        $(link).on('load', function () { deferred.resolve(link); });

        doc.head.appendChild(link);
        link.href = cssUrl;
        return deferred;
      };

      var links = $('link[rel=stylesheet]')
        .map(getHref)
        .map(loadCss);

      var resizer = new Resizer(iframe, $(doc), resizeInterval, resizeLimit);
      $.when.apply($, links).
        then(function () {
          doc.body.style.backgroundColor = "transparent";
          resizer.resizeImpl();
        });
    }
  };

  var normalizeIframe = function () {
    var iframe = this;
    var iframeDoc = $(iframe.contentDocument);

    var resizer = new Resizer(iframe, iframeDoc, resizeInterval, resizeLimit);
    resizer.interval =
      window.setInterval(function() { resizer.resize(); }, 42);
    $(window).on('resize', throttle(function () { resizer.resizeImpl(); }, 42));
  };

  var Resizer = function (iframe, iframeDoc, interval, limit) {
    this.iframe = $(iframe);
    this.iframeDoc = iframeDoc;
    this.interval = interval;
    this.limit = limit;
    this.resizeCount = 0;
  };

  Resizer.prototype = {
    resize: function () {
      this.resizeCount++;
      if (this.resizeCount > resizeLimit) {
        window.clearInterval(this.interval);
      }
      this.resizeImpl();
    },
    resizeImpl: function () {
      var height = $(this.iframeDoc).height();
      if (height > 0) {
        this.iframe.css('height', height);
      }
    }
  };

  var throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date();
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  $('document').ready(initialize);

}).call(this);
