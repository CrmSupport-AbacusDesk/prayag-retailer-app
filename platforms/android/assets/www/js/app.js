// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngMaterial','ngCordova', '$selectSearchBox','angular-search-and-select','angular-search-and-select2'])

.run(function($ionicPlatform,loginService,mySharedService,$cordovaSQLite,$ionicPopup,$ionicLoading,$state,$ionicHistory, $timeout,$rootScope) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.show();
            StatusBar.backgroundColorByHexString("#086289");
            StatusBar.overlaysWebView(false);
            // StatusBar.styleLightContent();
            // StatusBar.styleDefault();
        }


        $ionicPlatform.registerBackButtonAction(function () {

            if ($ionicHistory.currentStateName() === 'login' || $ionicHistory.currentStateName() === 'tab.home') {

              if(backbutton==0) {
                 backbutton++;
                 window.plugins.toast.showShortBottom('Press again to exit');
                 $timeout(function(){backbutton=0;},2500);

              } else {
                 ionic.Platform.exitApp();
              }

            } else if ($ionicHistory.currentStateName() === 'tab.profile') {
               $state.go('tab.home');
            }
            else if ($ionicHistory.currentStateName() === 'tab.addorder')
            {
               if(backbutton==0) {
                 backbutton++;
                 window.plugins.toast.showShortBottom('Order will Vanish once you go back!!!');
                 $timeout(function(){backbutton=0;},2500);

              } else
              {
               navigator.app.backHistory();
              }
            }
             else {
               navigator.app.backHistory();
            }

        }, 100);


        if (window.cordova) {
            //   db = $cordovaSQLite.openDB({ name:  "my.app" , iosDatabaseLocation: 'default' });
              db = window.openDatabase("my.app",'1','my',1024 * 1024 * 100);
              console.log("browser");
              console.log("Android");
        } else {
              db = window.openDatabase("my.app",'1','my',1024 * 1024 * 100);
              console.log("browser");
        }

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS "+dbTableName+" (id integer primary key,username text,password text)");

        var query ="SELECT username, password FROM "+dbTableName+" ORDER BY id DESC LIMIT 1";

        $cordovaSQLite.execute(db, query).then(function(res) {

          if(res.rows.length > 0) {

            $ionicLoading.show({
             template: '<span class="icon spin ion-loading-d"></span> Loading...'
            });

            if(res.rows.item(0).username && res.rows.item(0).password) {

              loginService.login(res.rows.item(0).username,res.rows.item(0).password)

                    .then(function (result) {
                        console.log(result);
                        $timeout(function () {
                          navigator.splashscreen.hide();
                        }, 100);
                        mySharedService.company_name=result.data.dr_name;
                        mySharedService.company_district = result.data.district_name;  
                        console.log(mySharedService.company_district);
                        
                        $state.go('tab.home');
                        console.log(result);
                        login_id = result.data.id;
                        state_name = result.data.state_name;
                        district_name = result.data.district_name;
                        $ionicLoading.hide();

                    }, function (result) {

                         $ionicLoading.hide();

                         $timeout(function () {
                           navigator.splashscreen.hide();
                         }, 100);

                         var alertPopup = $ionicPopup.alert({
                           title: 'Login failed!',
                           template: 'Please check your credentials!'
                         });
                    });
            }

          } else {

            $timeout(function () {
              navigator.splashscreen.hide();
            }, 100);

            $state.go('login');

          }

        }, function (err) {
           console.error(err);
        });
    });
    $rootScope.seg_amt=[];
    $rootScope.default_category=[];
    $rootScope.show_default_category=[];
    $rootScope.show_default_product=[];
    $rootScope.default_products=[];
    $rootScope.disc_val=[];
    $rootScope.dist_array=[];
    $rootScope.price_val_chg=[];
    $rootScope.profile_state={};
    $rootScope.show_distributors=[];
    $rootScope.valid=false;


})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        cache: false,
        templateUrl: 'templates/tabs.html',
        controller : 'DashCtrl'
    })

    // Each tab has its own nav history stack:

    .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'templates/login.html',
        controller : 'DashCtrl'
    })

    .state('tab.home', {
        url: '/home',
        cache: false,
        views: {
            'tab-home': {
                templateUrl: 'templates/tab-home.html'
            }
        }
    })

    .state('point-location', {
        url: '/home',
        cache: false,
        templateUrl: 'templates/point-location.html',
        controller: 'DashCtrl'
    })

    .state('feedback', {
        url: '/feedback',
        cache: false,
        templateUrl: 'templates/tab-feedback.html',
        controller: 'DashCtrl'
    })

    .state('tab.distributor', {
        url: '/distributor',
        cache: false,
        views: {
            'tab-distributor': {
                templateUrl: 'templates/tab-distributor.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('distributor-details', {
        url: '/distributor-det',
        cache: false,
        templateUrl: 'templates/distributor-details.html',
        controller: 'DashCtrl'
    })

    .state('orders', {
        url: '/orders',
        cache: false,
        templateUrl: 'templates/orders.html',
        controller: 'DashCtrl'
    })

    .state('order-details', {
        url: '/order-details',
        cache: false,
        templateUrl: 'templates/order-details.html',
        controller: 'DashCtrl'
    })

    .state('tab.order-details', {
        url: '/order-details',
        cache: false,
        views: {
            'tab-order-details': {
                templateUrl: 'templates/order-details.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('payments', {
        url: '/payments',
        cache: false,
        templateUrl: 'templates/payments.html',
        controller: 'DashCtrl'
    })

    .state('tab.orders', {
        url: '/orders',
        cache: false,
        views: {
            'tab-orders': {
                templateUrl: 'templates/tab-orders.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.addorder', {
        url: '/addorder',
        // cache: false,
        views: {
            'tab-addorder': {
                templateUrl: 'templates/tab-addorder.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.orderdt', {
        url: '/orderdt',
        cache: false,
        views: {
            'tab-orderdt': {
                templateUrl: 'templates/tab-orderdt.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.confirmord', {
        url: '/confirmord',
        cache: false,
        views: {
            'tab-confirmord': {
                templateUrl: 'templates/tab-confirmord.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.payments', {
        url: '/payments',
        cache: false,
        views: {
            'tab-payments': {
                templateUrl: 'templates/tab-payments.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.pop', {
        url: '/pop',
        cache: false,
        views: {
            'tab-pop': {
                templateUrl: 'templates/tab-pop.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.imgdoc', {
        url: '/imgdoc',
        cache: false,
        views: {
            'tab-imgdoc': {
                templateUrl: 'templates/tab-imgdoc.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.gallery', {
        url: '/gallery',
        cache: false,
        views: {
            'tab-gallery': {
                templateUrl: 'templates/tab-gallery.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.profile', {
        url: '/profile',
        cache: false,
        views: {
            'tab-profile': {
                templateUrl: 'templates/tab-profile.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.profile-edit', {
        url: '/profile-edit',
        cache: false,
        views: {
            'tab-profile': {
                templateUrl: 'templates/profile-edit.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.announcement', {
        url: '/announcement',
        cache: false,
        views: {
            'tab-announcement': {
                templateUrl: 'templates/tab-announcement.html',
                controller : 'DashCtrl'
            }
        }
    })

    .state('tab.announcement-detail', {
        url: '/announcement-detail',
        cache:false,
        views: {
            'tab-announcement-detail': {
                templateUrl: 'templates/tab-announcement-detail.html',
                controller : 'DashCtrl'
            }
        }
    })

    .state('become-partner', {
        url: '/partner',
        cache: false,
        templateUrl: 'templates/become-partner.html',
        controller:'DashCtrl'
    })

    .state('assign-segment', {
        url: '/assign-segment',
        cache: false,
        templateUrl: 'templates/assign-segment.html',
        controller:'DashCtrl'
    })

    .state('tab.scheme_list', {
        url: '/scheme_list',
        cache:false,
        views: {
            'tab-scheme_list': {
                templateUrl: 'templates/scheme_list.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.upload_invoice', {
        url: '/upload_invoice',
        cache: false,
        views: {
            'tab-upload_invoice': {
                templateUrl: 'templates/upload_invoice.html',
                controller: 'DashCtrl'
            }
        }
    })
    
    .state('tab.scheme_my_status', {
        url: '/scheme_my_status',
        cache: false,
        views: {
            'tab-scheme_my_status': {
                templateUrl: 'templates/scheme_my_status.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.schemependingdetail', {
        url: '/schemependingdetail',
        cache:false,
        views: {
            'tab-schemependingdetail': {
                templateUrl: 'templates/schemependingdetail.html',
                controller: 'DashCtrl'
            }
        }
    })

     .state('tab.schemecompletedetail', {
        url: '/schemecompletedetail',
        cache:false,
        views: {
            'tab-schemecompletedetail': {
                templateUrl: 'templates/schemecompletedetail.html',
                controller: 'DashCtrl'
            }
        }
    })

     .state('tab.status_list', {
        url: '/status_list',
        cache:false,
        views: {
            'tab-status_list': {
                templateUrl: 'templates/status_list.html',
                controller: 'DashCtrl'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    // $urlRouterProvider.otherwise('login');

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    var param = function(obj) {
      var query = '',
         name, value, fullSubName, subName, subValue, innerObj, i;

     for (name in obj) {
         value = obj[name];

         if (value instanceof Array) {
             for (i = 0; i < value.length; ++i) {
                 subValue = value[i];
                 fullSubName = name + '[' + i + ']';
                 innerObj = {};
                 innerObj[fullSubName] = subValue;
                 query += param(innerObj) + '&';
             }
         }
         else if (value instanceof Object) {
             for (subName in value) {
                 subValue = value[subName];
                 fullSubName = name + '[' + subName + ']';
                 innerObj = {};
                 innerObj[fullSubName] = subValue;
                 query += param(innerObj) + '&';
             }
         }
         else if (value !== undefined && value !== null) query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
     }

     return query.length ? query.substr(0, query.length - 1) : query;
    };

    $httpProvider.defaults.transformRequest = [function(data) {
     return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];

})


.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.views.forwardCache(false);
});
