



import  account_ctrl from "./account_ctrl";
import  wechat_ctrl from "./wechat_ctrl";


 

export default {

	"app.account_info": {
		url:"account" ,
		templateUrl:"app/account/account_info.html",
		controller: account_ctrl 
	},

	"app.wechat": {
		url:"wechat" ,
		templateUrl:"app/account/wechat.html",
		controller: wechat_ctrl 

	}


}