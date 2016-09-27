/* jshint node: true */
"use strict";

var $ = require('jquery'),
  another = require('scripts/another');

var App = {
  init: function init() {

    another.doSomething();

  }
};

module.exports = App;
