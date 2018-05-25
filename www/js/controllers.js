angular.module('app.controllers', [])

.controller('welcomeCtrl', ['$scope', '$state', '$timeout', '$rootScope', function ($scope, $state, $timeout, $rootScope) {

  $scope.signUp = function () {
          $state.go('signUp');
      };

      $scope.Login = function () {
        $state.go('login');
      };

}])

.controller('loginCtrl', ['$scope', '$stateParams', '$rootScope', 'User', '$state' , function ($scope, $stateParams, $rootScope, User, $state) {
    $scope.User = {};
    var UserObject = new User;
    $scope.Message = "";
    $scope.DisplayMessage = false;
    $scope.Login = function() {
        $rootScope.ChangeLoading(true);

        var isWell = $rootScope.ValidateLoginInfo($rootScope.UserSignUpData);
        if(isWell) {
            UserObject.LoginUser($rootScope.UserSignUpData)
              .success(function(res){
                $rootScope.ChangeLoading(false);
                if(res.Succeeded){
                  UserObject.SetUserInfo(res);
                  $rootScope.ReloadUserData();
                  $state.go('footerTabsController.home');
                } else {
                  $scope.DisplayMessage = true;
                  $scope.Message = res.Messagee;
                }
              }).error(function(err){
                $rootScope.ChangeLoading(false);
                console.log(err);
              });
        } else {
            console.log("Check data!");
            $rootScope.ChangeLoading(false);
        }
    };
  $scope.signUp = function () {
    $state.go('signUp');
  };

}])

.controller('signUpCtrl', ['$scope', '$state', '$rootScope', 'User', 'geoLocationService', function ($scope, $state, $rootScope, User, geoLocationService) {
  var user = new User();

  $scope.UserObject = {};
  $scope.SignUp = function () {
      var response1 = $rootScope.ValidateAllFields($rootScope.UserSignUpData);
      if(response1.Success){
          $rootScope.ChangeLoading(true);
          if($rootScope.UserSignUpData.Password == $rootScope.UserSignUpData.ConfirmPassword) {
            user.Register($rootScope.UserSignUpData)
              .success(function(response){
                user.LoginUser($rootScope.UserSignUpData)
                  .success(function(res){

                    $rootScope.ChangeLoading(false);
                    user.SetUserInfo(res);
                    $rootScope.ReloadUserData();
                    $state.go('footerTabsController.home');
                  })
                  .error(function(error){
                    console.log(error);
                    $rootScope.ChangeLoading(false);
                    //todo: handle login error after signup
                  });
              })
              .error(function(err) {
                $rootScope.ChangeLoading(false);
                // todo: handle sign up err
              });
          } else {
            $rootScope.ChangeLoading(false);
          }

      } else {
        $rootScope.ChangeLoading(false);

      }
  };
  $scope.SignUpStepTwo = function () {
    $state.go('signUp2');
  };

}])

.controller('homeCtrl', ['$scope', '$stateParams', '$rootScope', 'User', 'Events', 'geoLocationService', '$localStorage','$state', function ($scope, $stateParams, $rootScope, User, Events, geoLocationService, $localStorage, $state) {
  var user = new User;
  var event = new Events;

  //check if user is logged in
  // todo: add navigation controller to routes


  $scope.ViewEvent = function (eventID) {
      $state.go('EventDetails',{'id' : eventID});
  };

  $scope.LoadHomeScreen = function () {
    $rootScope.ReloadUserData();
    $rootScope.LoadEventData()
      .success(function(response){
        $rootScope.ChangeLoading(false);
        $rootScope.AllEvents = response;
      })
      .error(function(err){
        $rootScope.ChangeLoading(false);
        //todo: handle error
      });
  };

  // $rootScope.LoadEventData = function () {
  //   $rootScope.ChangeLoading(true);
  //   event.ListAllEvents()
  //
  // };

  $scope.JoinEvent = function () {
    $rootScope.ChangeLoading(true);
    // todo: pass userObject and eventObject in f
    event.EnrollInEvent()
      .success(function(response) {
        $rootScope.ChangeLoading(false);
          if(response.Success){
            //todo: use eventObject
            //$scope.ViewEvent()
          } else {
            //todo: handle err res
          }
      })
      .error(function(err){
        //todo: handle err
      })
  };

  $scope.AddDeposit = function () {
    $state.go('ePOSIT');
  };

  $scope.LoadHomeScreen();
}])

.controller('userProfileCtrl', ['$scope', '$state', '$rootScope', 'User', 'Events', function ($scope, $state, $rootScope, User, Events) {
  var user = new User;
  var event = new Events;

  $scope.UserData = {};
  $scope.ReloadUserData = function () {
    $rootScope.ChangeLoading(true);
    user.ReloadUserData()
      .success(function (res) {
        $rootScope.ChangeLoading(false);
        $scope.UserData = res;
        user.SetUserInfo($scope.UserData);
      })
      .error(function (err) {
        console.log(err);
        //todo: handle err
      });
  };

  $scope.ReloadUserData();


  $scope.SignOut = function () {
    user.SignOut();
  };
}])

.controller('myEventsCtrl', ['$scope', '$state', '$rootScope', 'User', 'Events', '$localStorage', function ($scope, $state, $rootScope, User, Events, $localStorage) {
  var user = new User;
  var event = new Events;

  // todo:check if user is logged in
  // todo: add navigation controller to routes
  $scope.ongoingEvents = [];
  $scope.historyEvents = [];
  $scope.JoinedData = {};
  $scope.JoinedData.UserId = $localStorage.UserData.Id;

  $scope.Toggled = true;

  $scope.ToggleSelected = function () {
    var ongoing = angular.element( document.querySelector( '#ongoing' ) );
    var history = angular.element( document.querySelector( '#history' ) );
    if($scope.Toggled){
      ongoing.addClass('selected');
      history.removeClass('selected');
    } else {
      history.addClass('selected');
      ongoing.removeClass('selected');

    }
  };

  $scope.LoadOngoing = function () {
    $scope.historyEvents = [];
    $rootScope.ChangeLoading(true);
    user.GetOngoingEvents()
      .success(function (response) {
        $rootScope.ChangeLoading(false);
        $scope.ongoingEvents = response;
        $scope.Toggled = true;
        $scope.ToggleSelected();
      })
      .error(function (err) {
        console.log(err);
        $rootScope.ChangeLoading(false);
        //todo: handle err
      })
  };

  $scope.LoadHistory = function () {
    $scope.ongoingEvents = [];
    $rootScope.ChangeLoading(true);
    user.GetHistoryEvents()
      .success(function (response) {
        $rootScope.ChangeLoading(false);
        $scope.historyEvents = response;
        $scope.Toggled = false;
        $scope.ToggleSelected();
      })
      .error(function (err) {
        console.log(err);
        $rootScope.ChangeLoading(false);
        //todo: handle err
      })
  };

 $scope.ViewEvent = function(eventId) {
   $state.go('EventDetails', {'id' : eventId});
 };

  $scope.LoadOngoing();

}])

.controller('eventDetailsCtrl', ['$scope', '$state', '$rootScope', 'User', 'Events','$localStorage', function ($scope, $state, $rootScope, User, Events, $localStorage) {
    var user = new User;
    var event = new Events;

    $scope.currentEvent = {};
    $scope.UserJoined = false;
    $scope.JoinedData = {};
    if($state.params.id == null || $state.params.id == ""){
      //todo: handle no event id case
      $state.go('footerTabsController.home');
    } else {

      $scope.currentEventID = $state.params.id;
      $scope.JoinedData.EventId = $scope.currentEventID;
      $scope.JoinedData.UserId = $localStorage.UserData.Id;
    }

    $scope.LoadEventData = function () {
      $rootScope.ChangeLoading(true);
      //todo: pass user ID to f
      event.GetEventDetailsByID($scope.currentEventID)
        .success(function(response){
          $rootScope.ChangeLoading(false);
          $scope.currentEvent = response;
          $scope.UserJoined = false;
          user.CheckIfJoinedEvent($scope.JoinedData)
            .success(function (res) {
              $scope.UserJoined = res;
              user.ReloadUserData()
                .success(function (resp) {
                  user.SetUserInfo(resp);

                })
            })
            .error(function (error) {
              console.log(error);
              //todo: handle err
            })
        })
        .error(function(err){
          $rootScope.ChangeLoading(false);
          //todo: handle error
        });
    };

    $scope.JoinEvent = function () {
      $rootScope.ChangeLoading(true);
      // todo: pass userObject and eventObject to f
      event.EnrollInEvent($scope.JoinedData)
        .success(function (response) {
          $rootScope.ChangeLoading(false);

          $scope.LoadEventData();

        });
    };
    $scope.ViewEventSchedule = function () {
      $state.go('eventSchedule', {'id':$scope.currentEventID});
    };
    $scope.goBack = function (){
      $state.go('login', {}, {reload: true});
    };
    $scope.LoadEventData();

  }])


;
