(function(){
  'use strict';



  function config($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: 'views/trello-login.tpl.html',
        controller: 'TrelloLoginCtrl',
        controllerAs: 'trellologin'
      })
      .when('/new', {
        templateUrl: 'views/trello-new-card.tpl.html',
        controller: 'NewCardCtrl',
        controllerAs: 'newcard'
      });
  }

  angular
    .module('trellojs', ['ngRoute', 'trellojs.controllers'])
    .config(config);

})();
