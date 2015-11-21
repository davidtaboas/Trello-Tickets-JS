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
        },
        getBoard:function () {
            return board;
        },
        saveTopic:function (data) {
            topic = data;
        },
        getTopic:function () {
            return topic;
        },
        saveBacklog:function (data) {
            backlog = data;
        },
        getBacklog:function () {
            return backlog;
        },
        saveMembers:function (data) {
            members = data;
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
