import config from './index.config';
import routerConfig from './index.route';
import runBlock from './index.run';


import initServices from "./lib/service";
import initDirective from "./lib/directive";

 

// 'ngTouch', 'ngSanitize', 'ngAria', 


var thinglinx = angular.module('thinglinx', [
    'ngAnimate', 'ngCookies', 'ngMessages',
    'ngResource', 'ui.router', 'ui.bootstrap', 'ngStorage',

    'ui.bootstrap.datetimepicker',
    'pascalprecht.translate',

    'ui.load',
    'ui.jq',
    'ui.validate'

])

.config(config)

.config(routerConfig)


.run(runBlock)

.controller('AppCtrl', function($scope, $localStorage, $window, $modal, $state,
    $timeout, $sessionStorage, $q, $animate, $cookies , $source , $translate,
    $location, $rootScope) {
    'ngInject';


    function isSmartDevice($window) {
        // Adapted from http://www.detectmobilebrowsers.com
        var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
        // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
        return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
    }

    var isIE = !!navigator.userAgent.match(/MSIE/i);
    isIE && angular.element($window.document.body).addClass('ie');
    isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

    // config
    $scope.app = {
        name: 'Angulr',
        version: '1.3.0',
        // for chart colors
        color: {
            primary: '#7266ba',
            info: '#23b7e5',
            success: '#27c24c',
            warning: '#fad733',
            danger: '#f05050',
            light: '#e8eff0',
            dark: '#3a3f51',
            black: '#1c2b36'
        },
        settings: {

            themeID: 1,
            navbarHeaderColor: 'bg-black',
            navbarCollapseColor: 'bg-white-only',
            asideColor: 'bg-black',
            headerFixed: true,
            asideFixed: true,
            asideFolded: false
        }
    };

    // save settings to local storage
    if (angular.isDefined($localStorage.settings)) {
        $scope.app.settings = $localStorage.settings;
    } else {
        $localStorage.settings = $scope.app.settings;
    }
    $scope.$watch('app.settings', function() {
        $localStorage.settings = $scope.app.settings;
    }, true);


    // angular translate
    $scope.lang = { isopen: false };
    $scope.langs = {  en: 'English',   zh: '简体中文'  };
    $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "简体中文";
    $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
    };


    $scope.showNavs = [
        {  title:"nav.region" , icon:"icon icon-grid"  ,           sref:"app.s_region"  },
        {  title:"nav.system" , icon:"icon icon-screen-desktop"  , sref:"app.s_system"  },
        {  title:"nav.alarm" , icon:"icon icon-fire "  ,           sref:"app.s_alarm"  }
    ],
 

    $scope.manageNavs = [
        {  title:"nav.region" , icon:"icon icon-grid"  ,           sref:"app.m_region"  },
        {  title:"nav.system" , icon:"icon icon-screen-desktop"  , sref:"app.m_system"  },
        {  title:"nav.model" , icon:"icon icon-puzzle"  ,         
            children: [
                { title:"nav.systemModel" ,   sref:"app.sysmodel"} ,
                { title:"nav.deviceModel" ,   sref:"app.devmodel"} 
            ]
        },
        {  title:"nav.user" , icon:"icon icon-user"  ,  
            children:[
                { title:"nav.manageUser" ,   sref:"app.user"} ,
                { title:"nav.manageRole" ,   sref:"app.role"} 
            ]

        },
        {  title:"nav.account" , icon:"icon icon-notebook"  ,  
            children:[
                { title:"nav.accountInfo" ,   sref:"app.account_info"} ,
                { title:"nav.bindWechat" ,   sref:"app.account_weichat"} 
            ]

        },
    ]

    $scope.na = "app.m_region"



    // 表单验证; 

    



    $scope.logout= function(){
        // console.log( 'cccccccccccc' ,$cookies.get("dd"))

        // $cookies.remove('token');
        // currentUser = {};
        $source.$user.logout();

        $window.location.href = "#/access/login"

    }



});


initServices(thinglinx);
initDirective(thinglinx);
