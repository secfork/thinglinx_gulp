

import region_m from "./region_m";
import system_m from "./system_m";

import access from "./main/access"; 
import  devmodel from "./model_device"; 

import  sysmodel from "./model_system";
import  user  from "./user";
import  account  from "./account";
 
import  region_s from  "./region_s";
import system_s  from  "./system_s";
import  alarm_s  from  "./alarm_s";



export default function routerConfig($stateProvider, $urlRouterProvider ) {
    'ngInject';

    $urlRouterProvider.otherwise('/');
    
    $stateProvider.state('app', {
        url: '/',
        templateUrl: 'app/main/main.html',
        resolve: {
            userResp: function($source) {                        
                        return $source.$common.get({
                            op: "islogined"
                        }).$promise
                     }
        },
        controller: function($scope , $state, $sys,  $manageNavs , userResp ) {
                   //后台判断是否已经登录;
                    var user = userResp.ret;
                    
                    // 控制 manageNavs ; 
                        // manageNavs 以后要 受控 ; 
                    $scope.manageNavs =  $manageNavs ; 

                    if (user) {
                        user.sms_notice = !!user.sms_notice;
                        user.mail_notice = !!user.mail_notice;

                        $scope.user = user;
                        $scope.$$user = user;

                        //@if  append
                        console.log("sessionStorage 含有user");
                        //@endif

                        // 是 app 路由转到 rootState ;
                        // rootstate = app.prpj.namage ;
                        $state.is("app") ? $state.go($sys.rootState) : undefined;

                        $scope.user = user;

                    } else { 
                        //  if( !$sys.$debug ){
                        $state.go('access.signin');
                        //  }
                    };
        } 
    }); 

    function createNavGo ( navGo ){

        var x =  {
            ['app.'+ navGo] : {
                url:'/'+ navGo,
                template: '<div ui-view class="fade-in-up"></div>'
            }
        };
        console.log("rrrr",x);
        return  x ; 
    } 

    angular.forEach( [
            region_s ,
            system_s,
            alarm_s,

            region_m,
            system_m,  

            devmodel,
            sysmodel,
            
            user ,
            account , 
 
            access 
    
        ] , ( routes )=>{
            angular.forEach( routes , ( config , route)=>{
                $stateProvider.state( route , config );
            }) 
        })


    // angular.forEach(
    //     angular.extend(
    //      region_s ,
    //         system_s,
    //         alarm_s,

    //         region_m,
    //         system_m,  

    //         devmodel,
    //         sysmodel,
            
    //         user ,
    //         account , 
 
    //         access 
        
    //     ), (config, route) => {
    //         $stateProvider.state(route, config);
    //     }
    // )





}
