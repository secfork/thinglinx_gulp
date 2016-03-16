{
    
	// 分页 ; 
    itemsPerPage: 20,   

    // restful 
    restNode: "node/",

    // system  状态更新周期; 
    state_inter_time: 60000,    // system 在线状态更新 周期;



    //  "1": "托管模式",
    // "2": "非托管模式"
    // sysModelMode   , 托管, 非托管, 类型的 systemModel ;  在 main.xx.json 中翻译; 



    //  新建 systemModel 时 , sysmodel 的通信类型:  目前只支持 DaServer ,  以后再加; 
    sysModelComType: {
        1: "DaServer"

    } ,


    // 支持的 system  通信类型  dtu   ; ( 不做中英文切换;)
    // 新建系统时 , 托管 且 DaServer 类型的 system时 , system 的网络类型;  目前只支持 DTU; 以后加其他的; 
    systemComType: { 
        "DTU": "DTU" 
    },


    //   



  	
  	"desc":"xxx"
}  
