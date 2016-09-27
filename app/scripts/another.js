var $ = require('jquery');

var another = {

  allCards: [],
  allBoards: [],

  listnames: {},
  boardnames: {},

  cards: function(boardId, name) {
    Trello.get("boards/" + boardId + "/cards", function(cards) {
      console.log(cards.length + " cards found for " + name);
      //console.log(cards[0]);
      cards.forEach(function(v) {
        another.listname(v.idList, function(name) {
          v.listName = name;
          another.allCards.push(v);
          console.log(another.allCards.length);
        });
      });
    }, function(err) {

    });
  },

  newcards: function() {
    Trello.get("members/me/cards/open", function(cards) {
      another.allCards = cards;
      var uniqueListIds = cards.map(function(v) {
        return v.idList;
      }).sort().filter(function(value, index, array) {
        return (index === 0) || (value !== array[index - 1]);
      });
      var finished = uniqueListIds.length;
      var soFar = 0;
      uniqueListIds.forEach(function(v) {
        another.listname(v, function(name) {
          soFar++;
          //var sort ordering
          var orderList = ["Complete", "Waiting", "Tasks"];
          if (soFar === finished) {
            another.allCards = cards.map(function(v) {
              v.listname = another.listnames[v.idList];
              v.boardname = another.boardnames[v.idBoard];
              return v;
            }).sort(function(a, b) {
              //sort order

              //First by tasks
              if (a.listname === b.listname) {
                //by due Date
                if (a.due === b.due) {
                  //by project
                  if(a.boardname===b.boardname) return 0;
                  if(a.boardname > b.boardname) return 1;
                  return -1;
                }
                if(!a.due) return 1;
                if(!b.due) return -1;
                return new Date(a.due) - new Date(b.due);
              } else {
                return orderList.indexOf(b.listname) - orderList.indexOf(a.listname);
              }
            });
            var tmpl = require("templates/listOfTasks");
            $('#main').append(tmpl({
              tasks: another.allCards
            }));
          }
        });
      });
    });
  },

  listname: function(listId, callback) {
    if (another.listnames[listId]) return callback(another.listnames[listId]);
    Trello.get("lists/" + listId + "/name", function(name) {
      console.log(name._value);
      another.listnames[listId] = name._value;
      return callback(name._value);
    }, function(err) {

    });
  },

  boards: function() {
    Trello.get("members/me/boards", function(boards) {
      console.log(boards.length + " boards found.");
      another.allBoards = boards.filter(function(v) {
        return !v.closed;
      });
      another.allBoards.forEach(function(v) {
        another.boardnames[v.id] = v.name;
      });
    }, function(err) {

    });
  },

  authenticationSuccess: function() {
    console.log('Successful authentication');
    another.boards();
    another.newcards();
  },

  authenticationFailure: function() { console.log('Failed authentication'); },

  authorise: function() {
    Trello.authorize({
      type: 'redirect',
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
  }

};

module.exports = another;
