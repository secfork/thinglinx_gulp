import m_region_route from "./region_m";
import m_system_route from "./system_m";
import access from "./main/access"; 
import  devmodel from "./model_device"; 


export default function routerConfig($stateProvider, $urlRouterProvider) {
    'ngInject';

    $urlRouterProvider.otherwise('/');
    
    $stateProvider.state('app', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: function($scope) {

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
            createNavGo('model'),

            devmodel,
            
            createNavGo('user'),

            createNavGo('account'),
 
            access 
        ), (config, route) => {
            $stateProvider.state(route, config);
        }
    )





}
