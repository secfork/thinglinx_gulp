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



    trigger:{

        entity:{ 
            type:1 ,
            origin:0 , //  非托管的只有  0 ;

            conditions:undefined ,
            action: "alarm" ,
            severity: 1 ,
            class_id: 1

        },

        conditon_entigy : { //verb : null,
            exp: {
                left: {
                    fn: 'PV',
                    args: null
                }, //   fn: pv  || null ; 
                op: ">=",
                right: {
                    fn: 'PV',
                    args: null
                }
            }
        },

         // trigger  触发源 ;
        "origin": {
            "0" : "ThingLinx Cloud" 
             //   jjw 去掉Remote Gateway
             //  , 1: "Remote Gateway"
        },
        // trigger 行为; 
        "action" : {
            alarm: "Alarm"

            // , "event": "Event",
            // , "task" : "Task"
        },
        // action 时 默认参数;  即使是 int 会在 ygf node后台转成 str ;
        actionParams :{
            class_id : "1",
            severity : "0" 
        },

        eventParams:{

        },
        TaskParams:{

        }, 

        op : [">", "<", "==", ">=", "<=", "!=", "&", "|", "xor"],
        class_id:[ "0","1","2","3","4","5","6","7","8","9" ],

        verb: ['and', 'or']

    },

   
 


    // gateway  串口  类型; 
    serialInterface : [ 'ETHERNET','RS232','RS485','RS422'  ] ,
    // gateway 通信协议 TCP , UDP ;
    gatewayProto : ['tcp' , 'udp'] , 
    
    gatewayTypes: {
          
           'RS232_1': "RS232",
           'RS232_2': "RS232",
           'RS232_3': "RS232",
           'RS232_4': "RS232",

           'RS485_1': 'RS485',
           'RS485_2': 'RS485',
           'RS485_3': 'RS485',
           'RS485_4': 'RS485',

           'RS422_1': 'RS422',
           'RS422_2': 'RS422'

    },
    // gateway 波特率
    gatewayBaudRate: [1200, 2400, 4800, 9600, 19200, 38400],
    // gateway 数据位;
    gatewayDataBits: [7, 8],
    // gateway 停止位;
    gatewayStopBits: [1, 2], 
    // gateway GPS  distance
    gatewayGpsDistance: [50, 100, 250, 500],
    // gateway  GPs 波特率;
    gatewayGpsBaudRate: [300, 600, 1200, 2400, 4800, 9600, 19200],
    // gateway  校验 , () // 放到 main.xx.json  中; 
    // gatewayParity: {
    //              'none': "无校验",
    //              'even': "偶校验",
    //              'odd': "奇校验"
    //          },

    gatewayEntity: {
         enable: true,
         baud_rate: 9600,
         data_bits: 8,
         stop_bits: 1,
         parity: 'none',
         delay: 10
    },

    // 支持 的 点 类型;  
    tagType: ['Analog', 'Digital'] ,


  	
  	"desc":"xxx"
}  
