angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('welcome', {
    url: '/landing',
    templateUrl: 'templates/welcome.html',
    controller: 'welcomeCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signUp', {
    url: '/signUp',
    templateUrl: 'templates/signUp.html',
    controller: 'signUpCtrl'
  })

  .state('signUp2', {
    url: '/signUp-step-2',
    templateUrl: 'templates/signUp2.html',
    controller: 'signUpCtrl'
  })

  .state('EventDetails', {
    url: '/events/details/:id',
    templateUrl: 'templates/eventDetails.html',
    controller: 'eventDetailsCtrl'
  })

    .state('footerTabsController.home', {
      url: '/home',
      views: {
        'tabHome': {
          templateUrl: 'templates/home.html',
          controller: 'homeCtrl'
        }
      }
    })

    .state('footerTabsController.myEvents', {
      url: '/myEvents',
      views: {
        'tabMyEvents': {
          templateUrl: 'templates/myEvents.html',
          controller: 'myEventsCtrl'
        }
      }
    })

    .state('footerTabsController.userProfile', {
      url: '/userProfile',
      views: {
        'tabUserProfile': {
          templateUrl: 'templates/profile.html',
          controller: 'userProfileCtrl'
        }
      }
    })

    .state('footerTabsController', {
      url: '/footerCtrl',
      templateUrl: 'templates/footerTabsController.html',
      abstract:true
    })

  ;


  $urlRouterProvider.otherwise('/landing');


});
