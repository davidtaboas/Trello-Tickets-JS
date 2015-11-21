(function(){
  'use strict';

  angular.module('trellojs.controllers', ['trellojs.services']);

  function TrelloLoginCtrl (Board,$scope){
    var self = this;

    self.loadProccess = function(){
      $scope.authenticated = true;
      $scope.token = Trello.token();

      Trello.get('/member/me/boards', {filter: 'open'})
        .success(function(response){
          $scope.$apply(function(){
            $scope.boards = response;
            $scope.boardsLoaded = true;
            $scope.selectedBoard = $scope.boards[0];
            $scope.selectBoard();
            setTimeout(function(){
                $('.selectpicker').selectpicker('refresh');
            }, 500);

          });
        })
        .error(function(){
          console.log('Ha ocurrido un error en la carga');
        });
    };

    if(Trello.authorized()){
      self.loadProccess();
    }
    // $scope.authenticated = Trello.authorized();
    $scope.boards        = [];
    $scope.selectedBoard = {};
    $scope.boardsLoaded  = false;

    $scope.allLists = {};
    self.topic = {};
    self.backlog = {};

    $scope.authenticate = function() {
      $scope.waitingForResolution = false;
      Trello.authorize({
        type: 'popup',
        name: 'Trello Trickets',
        scope: {read: true, write: true, account: true},
        expiration: 'never',
        success: $scope.authenticationSuccess,
        error: $scope.authenticationError
      });
	    $scope.waitingForResolution = true;

    };


    $scope.authenticationSuccess = function() {
      if($scope.waitingForResolution) {
        $scope.$apply(self.loadProccess);
      } else {
        self.loadProccess();
      }
    };

    $scope.authenticationError = function(error) {
      $scope.authenticationErrorMessage = error;
    };

    var getListTopics = function(element){
      return element.name === 'Projects';
    };
    var getListBacklog = function(element){
      return element.name === 'Backlog';
    };

    $scope.selectBoard = function(){
        // Obtener id lista de topics/sitios
        Trello.get('/boards/'+$scope.selectedBoard.id+'/lists')
          .success(function(response){
            $scope.$apply(function(){

              $scope.allLists = response;
              if (response.filter(getListTopics)) {
                self.topic = response.filter(getListTopics)[0];
              }
              if (response.filter(getListBacklog)) {
                self.backlog = response.filter(getListBacklog)[0];
              }

            });

          })
          .error(function(){
            console.log('Error obteniendo listas');
          });

        // Obtener usuarios del tablero
        Trello.get('/boards/'+$scope.selectedBoard.id+'/members')
          .success(function (response) {
            self.members = response;
          })
          .error(function () {

          });


    };


    $scope.save = function () {
      Board.saveMembers(self.members);
      Board.saveBacklog(self.backlog);
      Board.saveTopic(self.topic);
      Board.saveBoard(self.board);

    };


  }


  function NewCardCtrl(Board, $scope, $location) {
    var self = this;

    if(Trello.authorized()){
        $scope.authenticated = true;
    }
    else {
        $location.path('/');
    }
    self.topics = {};
    self.topic = Board.getTopic();
    self.members = Board.getMembers();
    self.board = Board.getBoard();
    self.backlog = Board.getBacklog();

    self.isSending = false;

    Trello.get('/lists/' + self.topic.id + '/cards')
      .success(function (response) {
        $scope.$apply(function () {
          self.topics = response;
        });
      })
      .error(function () {

      });

    this.create = function () {
      self.isSending = true;
      var newCard =
        {name: '['+self.ticket.topic.name+'] '+self.ticket.title,
        desc: self.ticket.text,
        pos: 'top',
        due: null,
        idList: self.backlog.id,
        idMembers: self.ticket.member
        };

        Trello.post('/cards/', newCard)
          .success(function (response) {
            $scope.$apply(function(){
              self.ticket.url = response.url;
            });

          })
          .error(function () {
            console.log('No se ha podido crear la tarjeta');
          });

    };
    this.reset = function () {
      self.ticket.topic = '';
      self.ticket.title = '';
      self.ticket.text = '';
      self.ticket.member = '';
      self.isSending = false;
    };
    this.changeBoard = function(){
      $location.path('/');
    };
  }

  angular.module('trellojs.controllers')
    .controller('TrelloLoginCtrl', TrelloLoginCtrl)
    .controller('NewCardCtrl', NewCardCtrl);
})();
