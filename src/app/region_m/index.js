import region_m_ctrl from "./region_ctrl";


import region_attr from "./region_attr";  

import  system_m_ctrl  from "../system_m/system_m_ctrl";
import region_attr_author from "./region_attr_author"; 



export default {

    "app.m_region": {
        url: "m_region",
        templateUrl: "app/region_m/region.html",
        controller: region_m_ctrl
    },

    "app.m_region_attr": {
    	url:"m_region/{id}",
    	template:" <tl-subject></tl-subject><tl-tab-panel load-mask ></tl-tab-panel>",
    	resolve: {
            regionResp : function($source , $stateParams){
            	
                return  $source.$region.get( {pk:$stateParams.id} ).$promise ;
            }
        },
        controller: region_attr
    },

    "app.m_region_attr.sys":{
    	url:"/sys",
        data:{ manage:true  , regionAttr:true  }, 
    	templateUrl: 'app/region_m/region_attr_sys.html',
    	controller: system_m_ctrl
    },
    
    "app.m_region_attr.author":{
    	url:"/author",
    	templateUrl:"app/region_m/region_attr_author.html",
    	controller: region_attr_author
    }







}
