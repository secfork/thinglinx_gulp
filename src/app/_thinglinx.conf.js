
    itemsPerPage: 20,

    restNode: "node/",

    state_inter_time: 60000, // system 在线状态更新 周期;


    // 支持的 system  通信类型  dtu  Dasever ;
    daServer: {
        "DTU": "DTU",
        "DTUxx": "DTUxx"

    },



    // 创建触发器 alarmorigin
    trigger: {
        origin_default: '0',
        origin: {
            "ThingLinx Cloud": 0
            //                jjw 去掉Remote Gateway
            //                1: "Remote Gateway"
        },

        action_default: 'alarm',
        action: {
            'alarm': "Alarm",
            //"event": "Event",
            //'task': "Task"
        },

        // 1:"事件" , 2:"任务"} ,

        action_alarm: "alarm",
        action_event: "event",
        action_task: "task",

        type_default: 1,
        type: {
            "状态持续触发": 0,
            "状态变化触发": 1
        },

        // {"PV":"PV" ,null:"输入值"},
        // fn 限制不可为 字符串的 "null" 故 改成 array 形式;
        fn_default: "PV",
        fn: {
            "PV": "PV"
        },

        // 新建 trigger 时 conditons [] 中 的值 使用该模版;
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
        },



        op_default: ">",
        op: [">", "<", "==", ">=", "<=", "!=", "&", "|", "xor"],


        // op:[ ">" , "<" , "=" ,">=" , "<=" ,"!=" , "&" ,"|" ,"!" ,"~"],

        verb_default: 'and',
        verb: ['and', 'or'],

        severity_default: "0",
        severity: {
            '不确定的': 0, //'Indeterminate',
            '紧急的': 1, //'Critical ',
            '重要的': 2, //'Major ',
            '一般的': 3, //'Minor ',
            '警告': 4, //'Warning',
            // '5':'Cleared'
        },

        class_id_default: "1",
        class_id: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], // 类型;

        desc: ""
    },

    // system model ;
    sysModel: {
        mode_default: 1,
        mode: {
            "托管模式": 1,
            "非托管模式": 2
        }
    },

    profileTag: {
        save_log_default: 0,
        save_log: {
            "不保存历史": 0,
            "保存历史": 1
        },

        log_cycle_default: 300,
        log_cycle: {

            desc: " prof pint 的 日志周期!",
            values: {
                "1分钟": 60,
                "5分钟": 300,
                "10分钟": 600,
                "15分钟": 900,
                "30分钟": 1800,
                "60分钟": 3600
            }
        },
        log_type_default: "",
        log_type: {
            //            jjw
            default: "",
            values: {
                //                "RAW": "保存原始记录",
                //                "CHANGED": "只在变化时存储"
                //                jjw
                "RAW": "周期保存",
                "CHANGED": "变化时保存"

            }
        },
    },

    // system Model deivce ;
    device: {
        entity: {
            dev_cycle: 2,
            cycle_unit: 1,
            slow_cycle: 59,
            slow_cycle_unit: 1,
            dev_timeout: 15,
            dev_retry: 1,
            delay: 1,
        },
    },




    "valid": {
        "required": "该字段不能为空!",
        "min": "该数值必须不小于X",
        "minlength": "该字段至少为X个字符!",
        "maxlength": "该字段不能不超过X个字符!",
        "max": "该数值必须小于X",
        "email": "Email 格式不正确!",
        "number": "该数值必须为数字格式!",
        "Number": "该数值必须为数字格式!"


    }


