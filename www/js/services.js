angular.module('app.services', [])

.service('User', [ '$rootScope', '$http', '$q', '$localStorage', '$state', function ( $rootScope, $http, $q, $localStorage, $state) {
// ?Id=
  function User(){}

  var controller = this;

  //login
  User.prototype.LoginUser = function (user) {
    return $http.post($rootScope.StartUrl + '/api/Users/Login', user);
  };

  //save data
  User.prototype.SetUserInfo = function (user) {
    $rootScope.UserData = user;
    $localStorage.UserData = user;
  };

  //geo
  User.prototype.GetGeoLocation = function(data) {
    return $http.get('http://api.geonames.org/countryCodeJSON?lat='+data.latitude+'&lng='+data.longitude+'&username=tommy');
  };

  //sign up
  User.prototype.Register = function (user) {
    var response = $rootScope.ValidateLoginEmail(user.Email);
    if( response.Success ){
      var response2 = $rootScope.ValidateAllFields(user);
      if(response2.Success){
        return $http.post($rootScope.StartUrl + '/api/Users/Register', user);
      } else {
        return {
          "Data" : null,
          "Success" : false,
          "Message" : "Please check all required fields!"
        }
      }
    }
  };

  //get user info
  User.prototype.ReloadUserData = function () {
    return $http.get($rootScope.StartUrl + '/api/Users/GetUserInfo?Id=' + $localStorage.UserData.Id);
  };

  User.prototype.CheckIfJoinedEvent = function(data) {
    return $http.post($rootScope.StartUrl + "/api/Events/CheckJoin",data);
  };

  User.prototype.GetOngoingEvents = function() {
    return $http.get($rootScope.StartUrl + "/api/Events/GetMyJoinedEvents?Id="+$localStorage.UserData.Id);
  };

  User.prototype.GetHistoryEvents = function() {
    return $http.get($rootScope.StartUrl + "/api/Events/GetMyClosedEvents?Id="+$localStorage.UserData.Id);
  };


  //logout
  User.prototype.SignOut = function () {
    $rootScope.ChangeLoading(true);
    $localStorage.$reset();
    $rootScope.UserData = null;
    $state.go('welcome');
    $rootScope.ChangeLoading(false);
  };

  return User;
}])

.service('Events', [ '$rootScope', '$http', function ( $rootScope, $http) {

  function Event(){}
  //get all events
  Event.prototype.ListAllEvents = function () {
      return $http.get($rootScope.StartUrl + '/api/Events/GetUpcomingEvents');
  };

  //get event details
  Event.prototype.GetEventDetailsByID = function (evID) {
      return $http.get($rootScope.StartUrl + '/api/Events/GetEventDetails?Id=' + evID);
  };

  //assign user to event
  Event.prototype.EnrollInEvent = function (data) {
    //todo: validate data (event and user info)

    return $http.post($rootScope.StartUrl + '/api/Users/JoinUserEvent/', data);

  };

  //load user events
  Event.prototype.GetUserEvents = function(userID) {
      return $http.get($rootScope.StartUrl + '/api/events/userevents/' + userID);
  };

  //user unfollow event
  Event.prototype.UserUnfollowEvent = function(data) {
    return $http.post($rootScope.StartUrl + '/api/Events/Unfollow', data);
  };

  //user follow event
  Event.prototype.UserFollowEvent = function (data) {
    return $http.post($rootScope.StartUrl + '/api/Events/Follow', data);

  };

  return Event;
}])

.factory('geoLocationService', ['$q', '$window', function ($q, $window) {

    'use strict';

    function getCurrentPosition() {
      var deferred = $q.defer();

      if (!$window.navigator.geolocation) {
        deferred.reject('Geolocation not supported.');
      } else {
        $window.navigator.geolocation.getCurrentPosition(
          function (position) {
            deferred.resolve(position);
          },
          function (err) {
            deferred.reject(err);
          });
      }

      return deferred.promise;
    }

    return {
      getCurrentPosition: getCurrentPosition
    };
  }])

.service('BlankService', [function(){

}]);
