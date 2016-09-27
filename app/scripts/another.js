var $ = require('jquery');

var another = {

  authenticationSuccess: function() { console.log('Successful authentication'); },

  authenticationFailure: function() { console.log('Failed authentication'); },

  authorise: function() {
    Trello.authorize({
      type: 'popup',
      name: 'Getting Started Application',
      scope: {
        read: 'true',
        write: 'true'
      },
      expiration: 'never',
      success: another.authenticationSuccess,
      error: another.authenticationFailure
    });
  },

  doSomething: function() {
    another.authorise();
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
