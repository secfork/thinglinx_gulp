import m_region_route from "./region_m";
import m_system_route from "./system_m";
import access from "./main/access"; 
import  devmodel from "./model_device"; 

import  sysmodel from "./model_system";
import  user  from "./user";




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
        controller: function($scope , $state, $sys, userResp ) {
                   //后台判断是否已经登录;
                    var user = userResp.ret;
                   

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

    angular.forEach(
        angular.extend(
            m_region_route,
            m_system_route, 
          //  createNavGo('model'),

            devmodel,
            sysmodel,
            
            user ,
           // createNavGo('user'),

           // createNavGo('account'),
 
            access 
        ), (config, route) => {
            $stateProvider.state(route, config);
        }
    )





}
