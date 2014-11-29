
/**
 * EventEmitter
 * @mixin
 */
Resource.Events = {

  /**
   * Listen for an event
   * @param  {String}   event   The name of the events
   * @param  {Function} fn      A callback function
   * @param  {Object}   context The context of which to call the function
   * @return {Object}           This
   */
  on: function (event, fn, context) {
    return this.addEventListener(event, fn, context, false);
  },


  /**
   * Listen for an event once
   * @param  {String}   event   The name of the events
   * @param  {Function} fn      A Callback Function
   * @param  {Object}   context The context in which to call the Function
   * @return {Object}           this
   */
  once: function (event, fn, context) {
    return this.addEventListener(event, fn, context, true);
  },

  /**
   * Listen for an event
   * @param {String}   event   The name of the events
   * @param {Function} fn      The function to call when the event occurs
   * @param {Object}   context The context in which to call the Function
   * @param {Object}   once    This
   */
  addEventListener: function (event, fn, context, once) {
    once = once || false;

    if (this._events == null) {
      this._events = {};
    }

    if (this._events[event] == null) this._events[event] = [];

    this._events[event].push({
      fn: fn,
      once: once,
      context: context || this
    });

    return this;

  },

  /**
   * Remove listener
   * @param  {String}   event The name of the event to remove a listener for
   * @param  {Function} fn    The function to remove
   * @return {Object}         this
   */
  off: function (event, fn) {
    if (this._events == null)
      return this;

    if (!event) {
      this._events = {};
    } else if (event && !fn) {
      this._events[event] = [];
    } else if (event && fn) {
      if (this._events[event] != null) {
        var events = this._events[event];
        for (var i = 0; i < events.length; i++) {
          var ev = events[i];
          if (ev.fn == fn)
            this._events[event].splice(i,1);
        }
      }
    }


  },

  /**
   * Triger an event whith supplied parametres
   * @param  {String} event The event to trigger
   * @param  {...Mixed} args Arguments
   * @return {Object} this
   */
  trigger: function () {
    var args, event;
    event = arguments[0], args = 2 <= arguments.length ? Array.prototype.slice.call(arguments, 1) : [];

    if (this._events == null) {
      this._events = {};
      this._events[event] = [];
      return this;
    }

    var listeners = this._events[event] || [];

    for (var i = 0; i < listeners.length; i++ ) {
      var listener = listeners[i];
      listener.fn.apply(listener.context, args);

      if (listener.once)
        this._events[event].splice(i,1);
    }

    return this;


  }


};
