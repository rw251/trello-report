!function(){"use strict";var e="undefined"==typeof window?global:window;if("function"!=typeof e.require){var t={},a={},n={},r={}.hasOwnProperty,i=/^\.\.?(\/|$)/,o=function(e,t){for(var a,n=[],r=(i.test(t)?e+"/"+t:t).split("/"),o=0,s=r.length;o<s;o++)a=r[o],".."===a?n.pop():"."!==a&&""!==a&&n.push(a);return n.join("/")},s=function(e){return e.split("/").slice(0,-1).join("/")},d=function(t){return function(a){var n=o(s(t),a);return e.require(n,t)}},u=function(e,t){var n=null;n=b&&b.createHot(e);var r={id:e,exports:{},hot:n};return a[e]=r,t(r.exports,d(e),r),r.exports},l=function(e){return n[e]?l(n[e]):e},c=function(e,t){return l(o(s(e),t))},f=function(e,n){null==n&&(n="/");var i=l(e);if(r.call(a,i))return a[i].exports;if(r.call(t,i))return u(i,t[i]);throw new Error("Cannot find module '"+e+"' from '"+n+"'")};f.alias=function(e,t){n[t]=e};var p=/\.[^.\/]+$/,h=/\/index(\.[^\/]+)?$/,m=function(e){if(p.test(e)){var t=e.replace(p,"");r.call(n,t)&&n[t].replace(p,"")!==t+"/index"||(n[t]=e)}if(h.test(e)){var a=e.replace(h,"");r.call(n,a)||(n[a]=e)}};f.register=f.define=function(e,n){if("object"==typeof e)for(var i in e)r.call(e,i)&&f.register(i,e[i]);else t[e]=n,delete a[e],m(e)},f.list=function(){var e=[];for(var a in t)r.call(t,a)&&e.push(a);return e};var b=e._hmr&&new e._hmr(c,f,t,a);f._cache=a,f.hmr=b&&b.wrap,f.brunch=!0,e.require=f}}(),function(){window;require.register("application.js",function(e,t,a){"use strict";var n=t("jquery"),r=t("scripts/another"),i={init:function(){r.doSomething(),n("#main").on("click","td input.include",function(){r.changeTime(this.checked?+n(this).data("time"):-n(this).data("time"),n(this).data("board"))}).on("click","td input.includeBoard",function(){r.changeBoard(this.checked?+n(this).data("time"):-n(this).data("time"),n(this).data("board"))})}};a.exports=i}),require.register("scripts/another.js",function(e,t,a){var n=t("jquery"),r={allCards:[],allBoards:[],completedData:[],listnames:{},boardnames:{},getNWeek:function(e){var t=new Date,a=0;if(e>t)for(;e>=t;)e.setDate(e.getDate()-1),1===e.getDay()&&a++;else for(;e<=t;)e.setDate(e.getDate()+1),2===e.getDay()&&a--;return a},getWCDate:function(e){for(;2!==e.getDay();)e.setDate(e.getDate()-1);return e},totalDurationInHours:0,calculateWorkingDays:function(e,t){for(var a=0;e<t;)e.setDate(e.getDate()+1),e.getDay()>=2&&e.getDay()<=5&&++a;return a},parseDuration:function(e,t,a){var n=r.allBoards.filter(function(e){return e.name===t})[0];n.duration||(n.duration=0);var i=e.slice(0,-1);return e.search(/^[0-9]+h$/)>-1?(a||(r.totalDurationInHours+=+i,n.duration+=+i),{hours:i,text:i+" hour"+("1"===i?"":"s")}):e.search(/^[0-9]+d$/)>-1?(a||(r.totalDurationInHours+=8*+i,n.duration+=8*+i),{hours:8*i,text:i+" day"+("1"===i?"":"s")}):{hours:0,text:e+" is badly formed expecting Xh or Yd"}},completed:{},actions:function(e){Trello.get("members/me/actions?filter=updateCard:idList",function(t){var a={};t.forEach(function(e){a[e.data.card.id]||(a[e.data.card.id]=[]),a[e.data.card.id].push(e)}),Object.keys(a).forEach(function(e){a[e].sort(function(e,t){return new Date(t.date)-new Date(e.date)}),"Completed"===a[e][0].data.listAfter.name&&(r.completed[e]=a[e][0].date)}),e()})},newcards:function(){Trello.get("members/me/cards/open",function(e){r.allCards=e;var t=e.map(function(e){return e.idList}).sort().filter(function(e,t,a){return 0===t||e!==a[t-1]}),a=t.length,n=0;t.forEach(function(t){r.listname(t,function(t){n++;var i=["Completed","Waiting","Tasks"],o={};if(n===a){r.allCards=e.map(function(e){e.listname=r.listnames[e.idList],e.boardname=r.boardnames[e.idBoard];var t=e.name.indexOf("[");if(t>-1&&e.name.length-t<10&&"Completed"!==e.listname){var a=r.parseDuration(e.name.substr(t,10).replace(/[\[\]]/g,""),e.boardname);e.durationHours=a.hours,e.durationText=a.text,e.name=e.name.substr(0,t)}else if("Completed"===e.listname){var n=r.parseDuration(e.name.substr(t,10).replace(/[\[\]]/g,""),e.boardname,!0),i=r.getNWeek(new Date(r.completed[e.id]));o[i]?o[i]+=+n.hours:o[i]=+n.hours}return e}).sort(function(e,t){return e.listname===t.listname?e.due===t.due?e.boardname===t.boardname?0:e.boardname>t.boardname?1:-1:e.due?t.due?new Date(e.due)-new Date(t.due):-1:1:i.indexOf(t.listname)-i.indexOf(e.listname)});var s=new Date,d=r.calculateWorkingDays(s,new Date("2016-11-23")),u=Math.min(8,Math.max(0,17-s.getHours()));r.need=r.totalDurationInHours,r.doin=8*d+u,r.displaySubheading(),r.completedData=Object.keys(o).map(function(e){var t=new Date;return t.setDate(t.getDate()+7*+e),{wc:r.getWCDate(t).toISOString().substr(0,10),name:e,hours:o[e]}}).sort(function(e,t){return new Date(t.wc)-new Date(e.wc)}),r.displayAll()}})})})},need:0,doin:0,changeTime:function(e,t){r.need+=e,r.displaySubheading(),r.allBoards.filter(function(e){return e.name===t})[0].duration+=e,r.displayTopRow()},changeBoard:function(e,t){r.need+=e,r.displaySubheading();var a=r.allBoards.filter(function(e){return e.name===t})[0];a.include=e<=0,n("td:contains("+t+")").parent().toggleClass("ignore").find("input[type=checkbox]").prop("checked",!a.include),r.displayTopRow()},displaySubheading:function(){n("#subheading").removeClass("text-error text-warning text-success").text("Need to do "+r.need+" hours work in "+r.doin+" hours (x"+(r.need/r.doin).toFixed(2)+" effort)"),r.need>1.2*r.doin?n("#subheading").addClass("text-error"):r.need>1.01*r.doin?n("#subheading").addClass("text-warning"):n("#subheading").addClass("text-success")},displayTopRow:function(e){var a=t("templates/listOfBoards");e?n("#top-row").fadeOut(800,function(){n(this).html(a({boards:r.allBoards.filter(function(e){return e.duration>0})})),a=t("templates/listOfWeeks"),n(this).append(a({weeks:r.completedData})),n(this).fadeIn(600)}):(n("#top-row").html(a({boards:r.allBoards.filter(function(e){return e.duration>0})})),a=t("templates/listOfWeeks"),n("#top-row").append(a({weeks:r.completedData})))},displayAll:function(){var e=t("templates/listOfBoards");n("#content").fadeOut(800,function(){n("#top-row").html(e({boards:r.allBoards.filter(function(e){return e.duration>0})})),e=t("templates/listOfWeeks"),n("#top-row").append(e({weeks:r.completedData})),e=t("templates/listOfTasks"),n(this).append(e({tasks:r.allCards})),n(this).append("<div>"+new Date+"</div>"),n(this).fadeIn(600)})},unassigned:function(){Trello.get("search?query=-has:member is:open",function(e){e.cards&&e.cards.length>0&&n("#main").append("<h2>"+e.cards.length+" cards without assignment.</h2>")})},listname:function(e,t){return r.listnames[e]?t(r.listnames[e]):void Trello.get("lists/"+e+"/name",function(a){return r.listnames[e]=a._value,t(a._value)},function(e){})},boards:function(){Trello.get("members/me/boards",function(e){console.log(e.length+" boards found."),r.allBoards=e.filter(function(e){return!e.closed}),r.allBoards.forEach(function(e){r.boardnames[e.id]=e.name})},function(e){})},authenticationSuccess:function(){console.log("Successful authentication"),r.boards(),r.actions(function(){r.newcards(),r.unassigned()})},authenticationFailure:function(){console.log("Failed authentication")},authorise:function(){Trello.authorize({type:"redirect",name:"Trello report",scope:{read:"true",write:"true"},expiration:"never",success:r.authenticationSuccess,error:r.authenticationFailure})},doSomething:function(){r.authorise()}};a.exports=r}),require.register("templates/listOfBoards.jade",function(e,t,a){var n=function(e){var t,a=[],n={},r=e||{};return function(e,r){n.board=t=function(e){this&&this.block,this&&this.attributes||{};a.push('<tr class="board"><td><a'+jade.attr("href",e.shortUrl,!0,!1)+' target="_blank">'+jade.escape(null==(t=e.name)?"":t)+"</a></td><td>"+jade.escape(null==(t=e.include?"0":e.duration)?"":t)+'</td><td><input type="checkbox"'+jade.attr("data-time",e.duration,!0,!1)+jade.attr("data-board",e.name,!0,!1)+jade.attr("checked",!e.include,!0,!1)+' class="includeBoard"/></td></tr>')},a.push('<div class="pure-u-1 pure-u-md-1-2"><div class="l-box right"><table class="pure-table"><thead><tr><th>Board name</th><th>Total duration</th><th>Inc</th></tr></thead><tbody>'),function(){var t=e;if("number"==typeof t.length)for(var a=0,r=t.length;a<r;a++){var i=t[a];n.board(i)}else{var r=0;for(var a in t){r++;var i=t[a];n.board(i)}}}.call(this),a.push("</tbody></table></div></div>")}.call(this,"boards"in r?r.boards:"undefined"!=typeof boards?boards:void 0,"undefined"in r?r.undefined:void 0),a.join("")};"function"==typeof define&&define.amd?define([],function(){return n}):"object"==typeof a&&a&&a.exports&&(a.exports=n)}),require.register("templates/listOfTasks.jade",function(e,t,a){var n=function(e){var t,a=[],n={},r=e||{};return function(e,r,i){n.task=t=function(n){var r=(this&&this.block,this&&this.attributes||{},["task"]);"Completed"===n.listname&&r.push("completed"),a.push("<tr"+jade.cls([r],[!0])+'><td data-label="Board">'+jade.escape(null==(t=n.boardname)?"":t)+'</td><td data-label="Task">'+jade.escape(null==(t=n.name)?"":t)+"<a"+jade.attr("href",n.shortUrl,!0,!1)+' target="_blank">link</a></td><td data-label="Time"'+jade.attr("style","background-size:"+100*n.durationHours/80+"% 100%",!0,!1)+jade.cls(["Completed"===n.listname?"":"duration"],[!0])+">"+jade.escape(null==(t=n.durationText)?"":t)+'</td><td data-label="List">'+jade.escape(null==(t=n.listname)?"":t)+'</td><td data-label="Due">'+jade.escape(null==(t=n.due?new e(n.due).toISOString().substr(0,10):"-")?"":t)+'</td><td data-label="Include"><input type="checkbox"'+jade.attr("data-time",n.durationHours,!0,!1)+jade.attr("data-board",n.boardname,!0,!1)+' checked="checked" class="include"/></td></tr>')},a.push('<div class="l-box"><table class="pure-table responsive"><thead><tr><th>Board</th><th>Name</th><th>Expected duration</th><th>List</th><th>Due by</th><th>Include</th></tr></thead><tbody>'),function(){var e=r;if("number"==typeof e.length)for(var t=0,a=e.length;t<a;t++){var i=e[t];n.task(i)}else{var a=0;for(var t in e){a++;var i=e[t];n.task(i)}}}.call(this),a.push("</tbody></table></div>")}.call(this,"Date"in r?r.Date:"undefined"!=typeof Date?Date:void 0,"tasks"in r?r.tasks:"undefined"!=typeof tasks?tasks:void 0,"undefined"in r?r.undefined:void 0),a.join("")};"function"==typeof define&&define.amd?define([],function(){return n}):"object"==typeof a&&a&&a.exports&&(a.exports=n)}),require.register("templates/listOfWeeks.jade",function(e,t,a){var n=function(e){var t,a=[],n={},r=e||{};return function(e,r){n.week=t=function(e){this&&this.block,this&&this.attributes||{};a.push("<tr><td>"+jade.escape(null==(t=e.wc)?"":t)+"</td><td>"+jade.escape(null==(t=e.hours)?"":t)+"</td></tr>")},a.push('<div class="pure-u-1 pure-u-md-1-2"><div class="l-box left"><table class="pure-table"><thead><tr><th>W/C</th><th>Hours</th></tr></thead><tbody>'),function(){var e=r;if("number"==typeof e.length)for(var t=0,a=e.length;t<a;t++){var i=e[t];n.week(i)}else{var a=0;for(var t in e){a++;var i=e[t];n.week(i)}}}.call(this),a.push("</tbody></table></div></div>")}.call(this,"undefined"in r?r.undefined:void 0,"weeks"in r?r.weeks:"undefined"!=typeof weeks?weeks:void 0),a.join("")};"function"==typeof define&&define.amd?define([],function(){return n}):"object"==typeof a&&a&&a.exports&&(a.exports=n)}),require.register("templates/partials/board.jade",function(e,t,a){var n=function(e){var t=[];return t.join("")};"function"==typeof define&&define.amd?define([],function(){return n}):"object"==typeof a&&a&&a.exports&&(a.exports=n)}),require.register("templates/partials/task.jade",function(e,t,a){var n=function(e){var t=[];return t.join("")};"function"==typeof define&&define.amd?define([],function(){return n}):"object"==typeof a&&a&&a.exports&&(a.exports=n)}),require.register("templates/partials/week.jade",function(e,t,a){var n=function(e){var t=[];return t.join("")};"function"==typeof define&&define.amd?define([],function(){return n}):"object"==typeof a&&a&&a.exports&&(a.exports=n)}),require.register("___globals___",function(e,t,a){})}(),require("___globals___");