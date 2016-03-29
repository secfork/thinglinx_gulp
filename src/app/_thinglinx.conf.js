{
    

    // v:k 的时不需要翻译 ,
    // k :v 的时配置信息; 


            
	// 分页 ; 
    itemsPerPage: 20 ,   

    // restful 
    restNode: "node/",

    // application  首页;
    rootState: "app.m_region",

    // system  状态更新周期; 
    state_inter_time: 5000,    // system 在线状态更新 周期;
 

    //  "1": "托管模式",
    // "2": "非托管模式"
    // sysModelMode   , 托管, 非托管, 类型的 systemModel ;  在 main.xx.json 中翻译; 



    //  新建 systemModel 时 , sysmodel 的通信类型:  目前只支持 DaServer ,  以后再加; 
    sysModelComType: {
        1: "DaServer",
        2: "Gateway"
    } ,


    // 支持的 system  通信类型  dtu   ; ( 不做中英文切换;)
    // 新建系统时 , 托管 且 DaServer 类型的 system时 , system 的网络类型;  目前只支持 DTU; 以后加其他的; 
    systemComType: { 
        "DTU": "DTU" 
    },


    // 周期单位 ,  秒 , 分 , 时 ; 
    timeUnit: {
        0:"Second", // 秒
        1:"Minute",
        2:"Hour"
    } ,

    // sysModel  device  默认值 ;
   
    sysModelDevice: {
             dev_cycle: 1,
             cycle_unit: 1,
             slow_cycle: 1,
             slow_cycle_unit: 2,
             dev_timeout: 15,
             dev_retry: 1,
             delay: 1,
         },


    


  	
  	"desc":"xxx"
}  
