
 
import  system_m_ctrl from "../system_m/system_m_ctrl";

import  system_attr from "./system_attr";

import  system_basic from "./system_basic";
import  system_current from "./system_current";
import  system_history from "./system_history";
import  system_alarm from "./system_alarm";
import  system_map from "./system_map";
 


export default {

    "app.s_system": {
        url: "s_system",
        data: { manage: false  , regionAttr:false },
        templateUrl: "app/system_s/system_s.html", 
        controller: system_m_ctrl
    },
 
    "app.s_system_attr":{
    	url:"s_system/:uuid",
    	template:" <tl-subject></tl-subject> <tl-tab-panel load-mask ></tl-tab-panel>",
        resolve: {
            systemResp : function( $source , $stateParams){
                "ngInject";
                return  $source.$system.get({
                                        system_id: $stateParams.uuid,
                                        tag: true
                                    }).$promise;
            }
        }, 
    	controller:  system_attr
    },

    "app.s_system_attr.info":{
    	url:"/info",
    	templateUrl:"app/system_s/system_basic.html",
    	controller:  system_basic
    },
    "app.s_system_attr.current":{
    	url:"/current",
    	templateUrl:"app/system_s/system_current.html",
    	controller:system_current
    },
    "app.s_system_attr.history":{
    	url:"/history",
    	templateUrl:"app/system_s/system_history.html",
    	controller: system_history
    },
    "app.s_system_attr.alarm":{
    	url:"/alarm",
        templateUrl:"app/system_s/system_alarm.html",
    	controller: system_alarm
    },
    "app.s_system_attr.map":{
    	url:"/map",
    	templateUrl:"app/system_s/system_map.html",
    	controller: system_map    }
 	

}
