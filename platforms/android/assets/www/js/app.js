// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives','app.services', 'ngAnimate', 'ngStorage'])

.config(function($ionicConfigProvider, $sceDelegateProvider, $httpProvider){
  // $httpProvider.defaults.headers.common = {'Content-Type' : 'application/json; charset=utf-8,application/json'};
  $httpProvider.defaults.headers.post = {'Content-Type' : 'application/json'};
  $ionicConfigProvider.navBar.alignTitle('right');
  $ionicConfigProvider.tabs.position('bottom');
  $sceDelegateProvider.resourceUrlWhitelist([ 'self','*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

})

.run(function($ionicPlatform, $rootScope , $ionicLoading, User, $state, $localStorage, Events) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(false);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      window.StatusBar.styleDefault();
    }
  });

  $rootScope.StartUrl = "http://192.168.0.101:5555";
  $rootScope.AllEvents = [];
  $rootScope.SetAccessCode = function(code) {
    $rootScope.UserData.access_token = code;
  };

  $rootScope.ValidateLoginInfo = function(UserData) {
      if(UserData.Password != null && UserData.Password != undefined && UserData.Password != "" && UserData.Password.length >= 8){
        if(UserData.UserName != null && UserData.UserName != undefined && UserData.UserName != ""){
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
  };

  $rootScope.ValidateLoginEmail = function(Email) {
    if(Email){
      Email = Email.toLowerCase();
      return  {
        'Data' : null,
        'Success' : (Email != undefined && Email != null && Email != '' && Email.indexOf('@') != -1),
        'Message' : ''
      };
    } else {
      return {
        'Data' : null,
        'Success' : false,
        'Message' : 'Please provide or check your email address!'
      };
    }

  };

  $rootScope.ValidateAllFields = function (data){
    var good = true;
    if(data != undefined && data != null && Object.keys(data).length > 0){
      for(var obj in data){
        if(obj == undefined || obj == '' || obj == null){
          good = false;
        }
      }
    } else {
      good = false;
    }


    return {
      "Data" : null,
      "Success" : good,
      "Message" : good ? "Fields are fine." : "Please check all required fields!"
    }
  };

  $rootScope.ChangeLoading = function (value) {
      if(value){
        $ionicLoading.show();
      } else $ionicLoading.hide();
  };

  $rootScope.SetUserData = function (user) {
    $rootScope.UserData = user;
    $localStorage.UserData = user;
  };

  $rootScope.ReloadUserData = function() {
    var user = new User;
    user.ReloadUserData()
      .success(function (res) {
        user.SetUserInfo(res);
      })
      .error(function (err) {
        console.log(err);
        //todo: handle err
      });
  };

  $rootScope.LoadEventData = function(){
    var event = new Events;
    $rootScope.ChangeLoading(true);
    return event.ListAllEvents();
  };

  $rootScope.CheckUserLoginStatus = function (){

    if($rootScope.UserData == undefined || $rootScope.UserData == null){
      if($localStorage.UserData == undefined || $localStorage.UserData == null || $localStorage.UserData == "") {
        if($state.current.name != 'login' && $state.current.name != "signUp"){
          if($state.current.name != 'signUp2')
            $state.go('welcome');
        }
      } else {
        $rootScope.ReloadUserData();
        if($state.current.name == "welcome" || $state.current.name == "login" || $state.current.name == "signUp"){

          $state.go('footerTabsController.home');
        }


      }
    } else {
      if($state.current.name == "welcome" || $state.current.name == "login" || $state.current.name == "signUp"){

        $rootScope.ReloadUserData();
        $state.go('footerTabsController.home');
      }
    }
  };

  $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
    //assign the "from" parameter to something
    $rootScope.PreviousState = from;
    $rootScope.CurrentState = $state.current.name;
    if($rootScope.CurrentState == 'footerTabsController.home'){
      $rootScope.LoadEventData()
        .success(function (res) {

          $rootScope.CheckUserLoginStatus();
          $rootScope.ChangeLoading(false);
          $rootScope.AllEvents = res;
          $rootScope.ReloadUserData();
        })
        .error(function (err) {
          console.log(err);
          //todo: handle err
        });
    } else {

      $rootScope.CheckUserLoginStatus();
    }



  });


  $rootScope.CheckUserLoginStatus();

})

/*
  This directive is used to disable the "drag to open" functionality of the Side-Menu
  when you are dragging a Slider component.
*/
.directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function($ionicSideMenuDelegate, $rootScope) {
    return {
        restrict: "A",
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            function stopDrag(){
              $ionicSideMenuDelegate.canDragContent(false);
            }

            function allowDrag(){
              $ionicSideMenuDelegate.canDragContent(true);
            }

            $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
            $element.on('touchstart', stopDrag);
            $element.on('touchend', allowDrag);
            $element.on('mousedown', stopDrag);
            $element.on('mouseup', allowDrag);

        }]
    };
}])

/*
  This directive is used to open regular and dynamic href links inside of inappbrowser.
*/
.directive('hrefInappbrowser', function() {
  return {
    restrict: 'A',
    replace: false,
    transclude: false,
    link: function(scope, element, attrs) {
      var href = attrs['hrefInappbrowser'];

      attrs.$observe('hrefInappbrowser', function(val){
        href = val;
      });

      element.bind('click', function (event) {

        window.open(href, '_system', 'location=yes');

        event.preventDefault();
        event.stopPropagation();

      });
    }
  };
});
