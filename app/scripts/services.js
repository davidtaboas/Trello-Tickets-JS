(function(){
  'use strict';

  angular.module('trellojs.services', ['ngResource']);

  function Board() {
    var board = {};
    var topic = {};

    var backlog = {};

    var members = {}

    return {
        saveBoard:function (data) {
            board = data;
            console.log('Save board');
            console.log(data);
        },
        getBoard:function () {
            return board;
        },
        saveTopic:function (data) {
            topic = data;
            console.log('Save topic');
            console.log(data);
        },
        getTopic:function () {
            return topic;
        },
        saveBacklog:function (data) {
            backlog = data;
            console.log('Save backlog');
            console.log(data);
        },
        getBacklog:function () {
            return backlog;
        },
        saveMembers:function (data) {
            members = data;
            console.log('Save members');
            console.log(data);
        },
        getMembers:function () {
            return members;
        }

    };
  }



  angular
    .module('trellojs.services')
    .factory('Board', Board);
})();
