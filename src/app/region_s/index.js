


import region_s_ctrl from "./region_s_ctrl";
import  region_s_attr  from "./region_s_attr";
import  system_m_ctrl  from "../system_m/system_m_ctrl";

export default {

    	
    "app.s_region":{
    	url:"s_region",
    	templateUrl:"app/region_s/region_s.html",
    	controller: region_s_ctrl 
    }  

    ,"app.s_region_attr": {
    	url:"s_region/{id}",  
        template:"<div ui-view></div>" ,
    	resolve: {
            regionResp : function($source , $stateParams){ 
                return  $source.$region.get( {pk:$stateParams.id} ).$promise ;
            }
        } ,
        controller: region_s_attr
    }
    ,"app.s_region_attr.sys": {
        url:"/system",
        templateUrl:"app/system_s/system_s.html", 
        data:{ manage:false  , regionAttr:true  }, 
        controller: system_m_ctrl 

    }

 

}
