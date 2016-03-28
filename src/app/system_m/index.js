

import  system_m_ctrl from "./system_m_ctrl";

// attr ;

import  system_attr       from "./system_attr";
import  system_attr_basic from "./system_attr_basic";
import  system_attr_config from "./system_attr_config";
import  system_attr_tag from "./system_attr_tag";
import  system_attr_trigger from "./system_attr_trigger";
import  system_attr_map from "./system_attr_map";


export default {
	
	"app.m_system":{
		url:"m_system",
		data:{manage:true },
		templateUrl:"app/system_m/system.html",
		controller: system_m_ctrl
	} ,

	"app.m_system_attr" :{
		url:"m_system/{uuid}",
		template:" <tl-subject></tl-subject><tl-tab-panel load-mask ></tl-tab-panel>",
		resolve: {
			systemResp : ( $source , $stateParams)=>{
				"ngInject";
				return $source.$system.get({
                                        system_id: $stateParams.uuid
                        }).$promise ;

			}
		},
		controller:  system_attr
	},
 
	"app.m_system_attr.basic" : {
		url:"/basic",
		templateUrl:"app/system_m/system_attr_basic.html",
		controller: system_attr_basic

	},
	"app.m_system_attr.config" : {
		url:"/config",
		templateUrl:"app/system_m/system_attr_config.html",
		controller: system_attr_config
	},
	"app.m_system_attr.tag" : {
		url:"/tag",
		templateUrl:"app/system_m/system_attr_tag.html",
		controller: system_attr_tag

	},
	"app.m_system_attr.trigger" : {
		url:"/trigger",
		templateUrl:"app/system_m/system_attr_trigger.html",
		controller: system_attr_trigger

	},
	"app.m_system_attr.map" : {
		url:"/map",
		templateUrl:"app/system_m/system_attr_map.html",
		controller: system_attr_map

	},


 }