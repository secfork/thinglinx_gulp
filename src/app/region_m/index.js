import region_m_ctrl from "./region_ctrl";


import region_attr from "./region_attr"; 
import region_attr_sys from "./region_attr_sys"; 
import region_attr_author from "./region_attr_author"; 



export default {

    "app.m_region": {
        url: "m_region",
        templateUrl: "app/region_m/region.html",
        controller: region_m_ctrl
    },

    "app.m_region_attr": {
    	url:"m_region/{id}",
    	template:"<tl-tab-panel load-mask ></tl-tab-panel>",
    	resolve: {
            regionResp : function($source , $stateParams){
            	
                return  $source.$region.get( {pk:$stateParams.id} ).$promise ;
            }
        },
        controller: region_attr
    },

    "app.m_region_attr.sys":{
    	url:"/sys",
    	templateUrl:"app/region_m/region_attr_sys.html",
    	controller: region_attr_sys
    },
    
    "app.m_region_attr.author":{
    	url:"/author",
    	templateUrl:"app/region_m/region_attr_author.html",
    	controller: region_attr_author
    }







}
