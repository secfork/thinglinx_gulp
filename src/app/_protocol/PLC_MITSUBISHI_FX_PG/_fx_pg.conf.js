{

    // .js 不可extend 古 , 以 驱动di 开头; 
    "PLC_MITSUBISHI_FX_PG": {
        "point": {
            "th": ['area', 'offset', 'type', 'type_ex'],

            "entity": {

                "params": {
                    "area": 0,
                    "offset": 0,
                    "type": 0,
                    "type_ex": 0,
                    "access": 0
                }

            },

            "AreaCC": function(point, scope, bool) {
                // 当寄存器区为：开关量输入(0)和开关量输出(1)时，数据为8进制，偏移地址不能出现‘8’和‘9’  
                // 当寄存器区为：数据寄存器 (6) 、定时器当前值(8) 、计数器当前值时(9)， 数据类型全部显示，其它方式只显示“0-位读写”
                // 当寄存器区为：开关量输入(0)、定时器接点(4)、计数器接点(5)、定时器当前值(8)、
                //             计数器当前值时(9)，显示“只读”

                var ad = { 6: true, 8: true, 9: true },
                    ac = { 0: true, 4: true, 5: true, 8: true, 9: true }
                area = point.params.area;

                if (ad[area]) {
                    scope._dataType = this.type;

                } else {
                    scope._dataType = { 0:  this.type[0]   };
                    !bool && (point.params.type = 0);
                };

                if (ac[area]) {
                    scope._accessType = { 0:  this.access[0] };
                    !bool && (point.params.access = 0);
                } else {
                    scope._accessType = this.access;
                }

            },
            "TypeCC": function(point) {
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
        "device": {
            "entity": {
                "params": {
                    "type": 0
                }
            }

        }

    }
}
