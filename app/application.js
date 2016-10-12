/* jshint node: true */
"use strict";

var $ = require('jquery'),
  another = require('scripts/another');

var App = {
  init: function init() {

    another.doSomething();

    $('#main').on('click', 'td input.include', function() {
      another.changeTime(this.checked ? +$(this).data('time') : -$(this).data('time'), $(this).data('board'));
    }).on('click', 'td input.includeBoard', function() {
      another.changeBoard(this.checked ? +$(this).data('time') : -$(this).data('time'), $(this).data('board'));
    });
  }
};

module.exports = App;
