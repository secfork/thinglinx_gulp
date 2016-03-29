{ 

    "FCS_MODBUS": {    

        
        point: { 

            th: [  'area', 'offset', 'type', 'type_ex', 'access'  ],

            // 驱动相对应的默认参数; 
            entity: {
                params: {
                    "area": 0,
                    "offset": 0,
                    "type": 0, //  可选项遂区域在变; 
                    "type_ex": 0, // 遂区域在变; 
                    "access": 0, // 遂区域变;  
                }
            },
            // 级联属性 start ;  
            // Area 变化是数据变化; 
            // bool : 是否在初始化( _dataType , _accessType   ); 


            areaCC: function(point, scope, bool) { 
                var dd = this.type,
                    ac = this.access;


                function initDtatType() { 
                    return point.params.area == 0 || point.params.area == 1 ?
                         { 0: dd[0]   } : dd;
                }

                function initAccessType() {
                    return (point.params.area == 0 || point.params.area == 2) ? 
                       ac : {  0 : ac[0] };

                } 

                // if (bool) {
                scope._dataType = initDtatType();
                scope._accessType = initAccessType();
                // } else {
                //     scope.$parent._dataType = initDtatType();
                //     scope.$parent._accerssType = initAccessType();
                // }



                if (bool) {
                    return;
                }

                if (point.params.area < 2) { // 意思是 co ,di 区时 , 
                    point.params.type = 0;
                    point.params.type_ex = 0;
                } else {
                    point.params.type = 3;
                    point.params.type_ex = 0;
                }
                var cc = {
                    1: 0,
                    3: 0,
                    0: 2,
                    2: 2
                };
                point.params.access = cc[point.params.area];


            },
            // Type 变化时 数据变化; 
            typeCC: function(point) {
                //if( point.params.area  > 1 ){   // 意思是  hr , ai 区  > 1 ;

                //  // k: 数据类型 , v: typeEx 值;    

                var cc = { 0: 0, 1: 0, 2: 0, 8: 1, 12: 1, 13: 1 };
                point.params.type_ex = cc[point.params.type] || 0;


            }
        },

        device:{

            protocol :{
                0 : "ModbusRtu",
                1 : "ModbusTcp"
            }, 
            order_a : {
                0 : "FFH4_FFH3_FFH2_FFH1",
                1 : "FFH3_FFH4_FFH1_FFH2",
                2 : "FFH1_FFH2_FFH3_FFH4",
                4 : "FFH2_FFH1_FFH4_FFH3",
            },


            // endity.parmas ; 
            entity:{
               params: { // 驱动部分默认值; 
                     address: 1,
                     protocol_type: 0,
                     offset_format: 0,
                     // register_length :1 ,
                     max_packet_length: 64,
                     packet_offset: 4,
                     int_order: 0,
                     int64_order: 0,
                     float_order: 0,
                     double_order: 0,
                     // register_order : 0 ,
                     crc_order: 0
                } 
            }
            
        }


    }
}
