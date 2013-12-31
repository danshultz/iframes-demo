/*! twoway - v - 2013-12-30
* https://github.com/danshultz/twoway
* Copyright (c) 2013 OverDrive, Inc; Licensed MIT */
(function() {
  var TwoWay = window.TwoWay = {};

  var Messenger = TwoWay.Messenger = function Messenger () { };

  Messenger.prototype = {
    _subscriptions: {},
    _wrappers: {},

    /**
     * publish a message to a window
     * @method
     * @param {Object} details
     * @param {String} details.message - message key to publish to
     * @param {Object} details.with - data object to publish to the message.
     *  Cannot contain functions but only serializable JSON data.
     * @param {Window} details.to - window to publish the message on
     * @param {String} [details.on] - (optional) domain to publish message on.
     *  If ommited, the message will be published to the window regardless of
     *  domain
     *
     *  example:
     *  messenger.publish({
     *    message: "this.message.key",
     *    "with": { some: "data" },
     *    to: myIframe.contentWindow,
     *    on: "google.com"
     *  });
     */
    publish: function (details) {
      var toSend = JSON.stringify({
        message: details.message,
        data: details["with"]
      });
      details.to.postMessage(toSend, details.on || "*");
    },

    /**
     * subscribe to a message being sent on the current window
     * @method
     * @param {Object} details
     * @param {String} details.message - message key to subscribe to
     * @param {Function} details.to - object to be subscribed
     * @param {String|Array} details.from - domain strings to allow the message
     *    to come from
     *
     * example:
     * messenger.subscribe({
     *   message: "this.message.key",
     *   to: myFunctionToBeCalled,
     *   from: "google.com"
     * });
     *
     */
    subscribe: function (details) {
      var domains = details.from,
      message = details.message,
      func = details.to,
      domainMatcher = Utils.domainMatcher(domains),
      subs =
        (this._subscriptions[message] = (this._subscriptions[message] || [])),
      wrappers = (this._wrappers[message] = (this._wrappers[message] || []));

      var wrapper = function (evt) {
        var data = JSON.parse(evt.data);
        if (domainMatcher(evt.origin) && data.message === message) {
          func(data.data, evt.source);
        }
      };

      subs.push(func);
      wrappers.push(wrapper);

      Utils.addEvent(window, 'message', wrapper);
    },

    /**
     * unsubscribes the current window from an event.
     * @method
     * @param {Object} details
     * @param {String} details.message
     * @param {Function} [details.from] - optional, function to be unsubscribed
     *   from if no function is passed, all events for the provided message will
     *   be unsubscribed from.
     *
     * example:
     * messenger.unsubscribe({
     *  message: "the.message",
     *  from: myFunction
     * })
     *
     */
    unsubscribe: function (details) {
      var message = details.message,
      func = details.from,
      subs = (this._subscriptions[message] || []),
      wrappers = (this._wrappers[message] || []),
      wrapper;

      if (func) {
        var index = subs.indexOf(func);

        if (index !== -1) {
          subs.splice(index, 1);
          wrapper = wrappers.splice(index, 1);
        }
      } else {
        wrapper = wrappers;
      }

      for (var i = 0; i < wrapper.length; i++) {
        Utils.removeEvent(window, 'message', wrapper[i]);
      }
    }

  };

  var Utils = TwoWay.Utils = {
    toArray: function (value) {
      return Array.isArray(value) ? value : [value];
    },

    domainMatcher: function (domains) {
      domains = Utils.toArray(domains);

      return function (domain) {
        return domains.reduce(Utils._domainMatches(domain), false);
      };
    },

    _domainMatches: function (domain) {
      return function (hasMatched, toMatch) {
        return hasMatched || domain.indexOf(toMatch) !== -1;
      };
    },

    addEvent: function (element, type, handler) {
      if (element.addEventListener) {
         element.addEventListener(type, handler, false);
      } else if (element.attachEvent) {
        element.attachEvent('on' + type, handler);
      }
    },

    removeEvent: function (element, type, handler) {
      if (element.removeEventListener) {
        element.removeEventListener(type, handler);
      } else if (element.detachEvent) {
        element.detachEvent(type, handler);
      }
    }

  };

}).call(window);

