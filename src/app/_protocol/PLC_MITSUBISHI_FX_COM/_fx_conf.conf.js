{

    PLC_MITSUBISHI_FX_COM: {

        point: { 

            areaCC: function(point, scope, bool) {
                //   X-开关量输入、Y-开关量输出、 M-辅组继电器、 S-状态寄存器、SM-特殊辅组继电器 、T-定时器接点、C-计数器接点 
                //     数据类型只有位读写。

                // 开关量输入 x-0 、定时器接点 T-5 、计数器接点C-6、定时器当前值TN-8、计数器当前值CN-9 只有“只读”可选择。  
                //   其它内存区三者都可以选择。  
                var ad = { 7: true, 8: true, 9: true },
                    ac = { 0: true, 5: true, 6: true, 8: true, 9: true },

                    area = point.params.area;

                if (ad[area]) {

                    scope._dataType = this.type;

                } else {
                    scope._dataType =  { 0 : this.type[0] } ; //  [{ k: "位读写", v: 0 }];
                    !bool && (point.params.type = 0);
                };

                if (ac[area]) {
                    scope._accessType = { 0 : this.access[0] };  //[{ k: "Read", v: 0 }];
                    !bool && (point.params.access = 0);
                } else {
                    scope._accessType = this.access;
                }

            },
            typeCC: function(point) {
                var area = point.params.area,
                    type = point.params.type;
                if (type == 0) {
                    point.params.type_ex = 0;
                    return;
                }
                if (type == 11) {
                    point.params.type_ex = 1;
                    return;
                }
                if (type == 1 || type == 2) {
                    point.params.type_ex = 1;
                    return;
                }
                // point.params.type_ex = undefined ;
                point.params.type_ex = 0;

            }
        },

        pointTh: [  'area', 'offset', 'type', 'type_ex' ,"access"  ],

         noTransTh: { 
                offset:true ,
                type_ex:true 
        },



        pointEntity: {
            params: {
                area: 0,
                offset: 0,
                type: 0,
                type_ex: 0,
                access: 0
            }

        },



        device: {

            type: {

                "0": 'FXon',
                "1": 'FX,FX2c',
                "2": 'FX2n',
                "3": 'FX3u'

            },
            
            format: {
                0:"格式1（无CR,LF）",
                1:"格式4（有CR,LF）"  
            }


        },

        deviceEntity: {

            params: {
                address:1,
                type: 2,
                format: 1,
                sum: 1
            }

        }




    }

}
