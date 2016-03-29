{

    PLC_SIEMENS_PPI: {

        point: {

            th: [
                'area', 'offset', 'type', 'type_ex'
            ],
            entity: {
                params: {
                    area: 0,
                    offset: 0,
                    type: 0,
                    type_ex: 0
                }
            },


            // bool 是否在初始化;     
            areaCC: function(point,scope,  bool) {
                var t, tt , area ;
                    tt = this.type ;

                    area = point.params.area;

                function cc(data) {  

                    (scope._dataType = data ) || (scope.$parent._dataType = data);


                    // console.log( bool ,   scope.$parent._dataType )
                };

                if (0 <= area <= 3) {
                    t = angular.copy( tt );
                    // t.splice(9, 1); // 删除掉 第十个; 
                    delete t[9];
                    cc(t);
                    !bool && (point.params.type = 0);

                }
                if (area == 4) {
                    cc(tt);
                    !bool && (point.params.type = 0);

                }

                if (area == 5 || area == 9) {
                    cc( { 6:tt[6], 7:tt[7], 8:tt[8] } ) ;
                    !bool && (point.params.type = 6);

                }

                if (area == 6 || area == 8) {
                    !bool && (
                        // point.params.type = undefined ; 
                        // point.params.type_ex = undefined ;
                        point.params.type = 0,
                        point.params.type_ex = 0
                    )

                }

                if (area == 7 || area == 10 || area == 11) {
                    cc({ 3:tt[3], 4:tt[4], 5:tt[5] });
                    !bool && (point.params.type = 3);

                };

            },

            typeCC: function(point) {
                var area = point.params.area,
                    type = point.params.type;
                if (type == 0) {
                    point.params.type_ex = 0;
                    return;
                }
                if (type == 9) {
                    point.params.type_ex = 1;
                    return;
                }
                // point.params.type_ex = undefined ;
                point.params.type_ex = 0;
            }

        },
        device:{
            entity:{
                params: {
                    address: 1,
                    max_packet_length: 150,
                    packet_offset: 10
                }

            }
        }

    }

}
