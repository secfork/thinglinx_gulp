
export  default ()=>{
    "ngInject";
    return  {
        restrict:"E", 
        replace:true ,
        templateUrl:"app/lib/directive/nav.html",
        scope: { navs:"="}
    }
} 