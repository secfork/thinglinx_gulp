

import  sysmodel from "./sysmodel";
  
import  sysmodel_attr from "./sysmodel_attr";

import  sysmodel_attr_info from "./sysmodel_attr_info";
import  sysmodel_attr_profile from "./sysmodel_attr_profile";
import  sysmodel_attr_device from "./sysmodel_attr_device";
import  sysmodel_attr_tag from "./sysmodel_attr_tag";
import  sysmodel_attr_trigger from "./sysmodel_attr_trigger";
import  sysmodel_attr_gateway from "./sysmodel_attr_gateway";
 
export default {


    "app.sysmodel": {
        url: "sysmodel",
        templateUrl: "app/model_system/sysmodel.html",
        controller: sysmodel
    },

    "app.sysmodelattr":{
    	url:"sysmodel/{uuid}",
    	template:"<tl-subject></tl-subject><tl-tab-panel load-mask ></tl-tab-panel>",
        resolve: {
            sysModelResp : ( $source , $stateParams )=>{
                return  $source.$sysModel.get({pk: $stateParams.uuid}).$promise ;
            }
        },
    	controller: sysmodel_attr
    },


    "app.sysmodelattr.info":{
        url:"/info",
        templateUrl:"app/model_system/sysmodel_attr_info.html",
        controller: sysmodel_attr_info
    }, 
    "app.sysmodelattr.profile":{
        url:"/profile",
        templateUrl:"app/model_system/sysmodel_attr_profile.html",
        controller: sysmodel_attr_profile
    },
    "app.sysmodelattr.device":{
        url:"/device",
        templateUrl:"app/model_system/sysmodel_attr_device.html",
        controller: sysmodel_attr_device
    },
    "app.sysmodelattr.tag":{
        url:"/tag",
        
        //  sys systemModel 的 state ; 
        isModelState : true,  

        templateUrl:"app/model_system/sysmodel_attr_tag.html",
        controller: sysmodel_attr_tag
    },
    "app.sysmodelattr.trigger":{
        url:"/trigger",
        
        //  sys systemModel 的 state ; 
        isModelState : true,  

        templateUrl:"app/model_system/sysmodel_attr_trigger.html",
        controller: sysmodel_attr_trigger
    },

    "app.sysmodelattr.gateway":{
    	url:"/gateway",
    	templateUrl:"app/model_system/sysmodel_attr_gateway.html",
    	controller: sysmodel_attr_gateway
    }



 

}
