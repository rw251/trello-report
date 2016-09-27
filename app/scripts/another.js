var $ = require('jquery');

var another = {

  doSomething: function() {
    var tmpl = require("templates/listOfPeople");
    $('#main').append(tmpl({
      people: [
        { name: "Richard", sex: "m", dob: "1976-03-02" },
        { name: "Michael", sex: "M", dob: "1979-12-11" },
        { name: "Clare", sex: "f", dob: "1983-11-12" },
        { name: "Nathan", sex: "m", dob: "1966-07-07" }
      ]
    }));
  }

};

module.exports = another;
