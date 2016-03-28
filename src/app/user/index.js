import user_ctrl from "./user_ctrl";
import user_detail_ctrl from "./user_detail_ctrl";
  
import role_ctrl from "./role";
import role_reg_acc_ctrl from "./role_reg_acc_ctrl";
 
 


export default {

    "app.user": {
        url: "user",
        templateUrl: "app/user/user.html",
        controller: user_ctrl
    } ,


    "app.userdetail": {
        url: "/userdetail/:id",
        templateUrl: "app/user/user_detail.html",
        controller: user_detail_ctrl
    } ,
 

    "app.role": {
        url: "role",
        template: "<tl-subject></tl-subject><tl-tab-panel load-mask ></tl-tab-panel>",
        controller: role_ctrl
    } ,
 

    "app.role.region" : {
        url: "/region",
        data:{ role_category:1},
        templateUrl: "app/user/role_reg_acc.html",
        controller: role_reg_acc_ctrl
    }  ,
    
    "app.role.account" : {
        url: "/account",
        data:{ role_category: 0 },
        templateUrl: "app/user/role_reg_acc.html",
        controller: role_reg_acc_ctrl
    }  ,



}
