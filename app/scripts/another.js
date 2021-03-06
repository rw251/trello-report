var $ = require('jquery');

var another = {

  allCards: [],
  allBoards: [],
  completedData: [],

  listnames: {},
  boardnames: {},

  // 0 is this week, 1 is next week, -1 is last week, -n is n weeks ago etc.
  getNWeek: function(dt) {

    //
    var today = new Date(),
      ans = 0;
    if (dt > today) {
      while (dt >= today) {
        dt.setDate(dt.getDate() - 1);
        if (dt.getDay() === 1) ans++;
      }
    } else {
      while (dt <= today) {
        dt.setDate(dt.getDate() + 1);
        if (dt.getDay() === 2) ans--;
      }
    }
    return ans;
  },

  getWCDate: function(dt) {
    while (dt.getDay() !== 2) {
      dt.setDate(dt.getDate() - 1);
    }
    return dt;
  },

  totalDurationInHours: 0,

  calculateWorkingDays: function(fromDate, toDate) {
    var workingDayCount = 0;

    while (fromDate < toDate) {
      fromDate.setDate(fromDate.getDate() + 1);
      if (fromDate.getDay() >= 2 && fromDate.getDay() <= 5) {
        ++workingDayCount;
      }
    }

    return workingDayCount;
  },

  parseDuration: function(duration, boardName, ignore) {
    var b = another.allBoards.filter(function(v) {
      return v.name === boardName;
    })[0];
    if (!b.duration) b.duration = 0;
    var num = duration.slice(0, -1);
    if (duration.search(/^[0-9]+h$/) > -1) {
      if (!ignore) {
        another.totalDurationInHours += +num;
        b.duration += +num;
      }
      return { hours: num, text: num + " hour" + (num === "1" ? "" : "s") };
    } else if (duration.search(/^[0-9]+d$/) > -1) {
      if (!ignore) {
        another.totalDurationInHours += (+num * 8);
        b.duration += (+num * 8);
      }
      return { hours: num * 8, text: num + " day" + (num === "1" ? "" : "s") };
    } else {
      return { hours: 0, text: duration + " is badly formed expecting Xh or Yd" };
    }
  },

  completed: {},

  actions: function(done) {
    Trello.get("members/me/actions?filter=updateCard:idList", function(actions) {
      var track = {};
      actions.forEach(function(v) {
        if (!track[v.data.card.id]) track[v.data.card.id] = [];
        track[v.data.card.id].push(v);
      });
      Object.keys(track).forEach(function(v) {
        track[v].sort(function(a, b) {
          return new Date(b.date) - new Date(a.date);
        });
        if (track[v][0].data.listAfter.name === "Completed") another.completed[v] = track[v][0].date;
      });
      done();
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
          var orderList = ["Completed", "Waiting", "Tasks"];
          var completedLog = {};
          if (soFar === finished) {
            another.allCards = cards.map(function(v) {
              v.listname = another.listnames[v.idList];
              v.boardname = another.boardnames[v.idBoard];
              var bracket = v.name.indexOf('[');
              if (bracket > -1 && v.name.length - bracket < 10 && v.listname !== "Completed") {
                var vals = another.parseDuration(v.name.substr(bracket, 10).replace(/[\[\]]/g, ""), v.boardname);
                v.durationHours = vals.hours;
                v.durationText = vals.text;
                v.name = v.name.substr(0, bracket);
              } else if (v.listname === "Completed") {
                var vals2 = another.parseDuration(v.name.substr(bracket, 10).replace(/[\[\]]/g, ""), v.boardname, true);
                var wk = another.getNWeek(new Date(another.completed[v.id]));
                if (!completedLog[wk]) completedLog[wk] = +vals2.hours;
                else completedLog[wk] += +vals2.hours;
              }
              return v;
            }).sort(function(a, b) {
              //sort order

              //First by tasks
              if (a.listname === b.listname) {
                //by due Date
                if (a.due === b.due) {
                  //by project
                  if (a.boardname === b.boardname) return 0;
                  if (a.boardname > b.boardname) return 1;
                  return -1;
                }
                if (!a.due) return 1;
                if (!b.due) return -1;
                return new Date(a.due) - new Date(b.due);
              } else {
                return orderList.indexOf(b.listname) - orderList.indexOf(a.listname);
              }
            });

            var today = new Date();
            var wholeDays = another.calculateWorkingDays(today, new Date('2016-11-23'));
            var leftToday = Math.min(8, Math.max(0, 17 - today.getHours()));
            another.need = another.totalDurationInHours;
            another.doin = (wholeDays * 8 + leftToday);

            another.displaySubheading();

            another.completedData = Object.keys(completedLog).map(function(v) {
              var t = new Date();
              t.setDate(t.getDate() + (+v * 7));
              return { wc: another.getWCDate(t).toISOString().substr(0, 10), name: v, hours: completedLog[v] };
            }).sort(function(a, b) {
              return new Date(b.wc) - new Date(a.wc);
            });

            another.displayAll();
          }
        });
      });
    });
  },
  need: 0,
  doin: 0,

  changeTime: function(t, board) {
    another.need += t;
    another.displaySubheading();
    another.allBoards.filter(function(v) {
      return v.name === board;
    })[0].duration += t;
    another.displayTopRow();
  },

  changeBoard: function(t, board) {
    another.need += t;
    another.displaySubheading();
    var bd = another.allBoards.filter(function(v) {
      return v.name === board;
    })[0];
    bd.include = t<=0;
    $('td:contains(' + board + ')').parent().toggleClass('ignore').find('input[type=checkbox]').prop('checked', !bd.include);
    another.displayTopRow();
  },

  displaySubheading: function() {
    $('#subheading').removeClass('text-error text-warning text-success').text("Need to do " + another.need + " hours work in " + another.doin + " hours (x" + (another.need / another.doin).toFixed(2) + " effort)");
    if (another.need > another.doin * 1.2) $('#subheading').addClass('text-error');
    else if (another.need > another.doin * 1.01) $('#subheading').addClass('text-warning');
    else $('#subheading').addClass('text-success');
  },

  displayTopRow: function(fade) {
    var tmpl = require("templates/listOfBoards");
    if (fade) {
      $('#top-row').fadeOut(800, function() {
        $(this).html(tmpl({
          boards: another.allBoards.filter(function(v){
            return v.duration>0;
          })
        }));

        tmpl = require("templates/listOfWeeks");

        $(this).append(tmpl({
          weeks: another.completedData
        }));
        $(this).fadeIn(600);
      });
    } else {
      $('#top-row').html(tmpl({
        boards: another.allBoards.filter(function(v){
          return v.duration>0;
        })
      }));

      tmpl = require("templates/listOfWeeks");

      $('#top-row').append(tmpl({
        weeks: another.completedData
      }));
    }
  },

  displayAll: function(){

    var tmpl = require("templates/listOfBoards");
    $('#content').fadeOut(800, function() {
      $('#top-row').html(tmpl({
        boards: another.allBoards.filter(function(v){
          return v.duration>0;
        })
      }));

      tmpl = require("templates/listOfWeeks");

      $('#top-row').append(tmpl({
        weeks: another.completedData
      }));

      tmpl = require("templates/listOfTasks");
      $(this).append(tmpl({
        tasks: another.allCards
      }));

      $(this).append("<div>" + (new Date()) + "</div>");

      $(this).fadeIn(600);
    });

  },

  unassigned: function() {
    Trello.get("search?query=-has:member is:open", function(res) {
      if (res.cards && res.cards.length > 0) {
        $('#main').append("<h2>" + res.cards.length + " cards without assignment.</h2>");
      }
    });
  },

  listname: function(listId, callback) {
    if (another.listnames[listId]) return callback(another.listnames[listId]);
    Trello.get("lists/" + listId + "/name", function(name) {
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
    another.actions(function() {
      another.newcards();
      another.unassigned();
    });
  },

  authenticationFailure: function() { console.log('Failed authentication'); },

  authorise: function() {
    Trello.authorize({
      type: 'redirect',
      name: 'Trello report',
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
