export default ($translate, $modalStack, $rootScope, $sys, $source) => {
    "ngInject";
    return {
        //  关闭所有 modal , 然后 alert ; 
        handlerErr: function(resp) {
            $modalStack.dismissAll();
            // $rootScope.$broadcast( "$cloasMask" ); 
            angular.alert({ warn: $translate.instant('err.' + resp.err) });
        },

        // 只 提示 不 关闭 modal ; 
        handlerRespErr: function(resp) {
            angular.alert({ warn: $translate.instant('err.' + resp.err) });

        },

        // region 列表; 
        // 收集 region_id  查询 激活非激活 system 数目; 
        //  默认 获取激活 的,  第二个参数 决定是否加载 非激活的; 
        queryAcUnAcSysNum: function(regionArray, bool) {
            var regionId_Self = {},
                region_ids;

            regionArray.forEach((r) => {
                regionId_Self[r.id] = r;
            });

            region_ids = Object.keys(regionId_Self);

            if (region_ids.length) {
                // 获取 激活的; 
                $source.$region.save({
                    pk: "sum",
                    state: 1
                }, region_ids, function(resp) {
                    resp.ret.forEach(function(v, i) {
                        regionId_Self[v.region_id].activeNum = v.count || 0;
                    })
                });

                // 获取非激活的; 
                if (bool) {
                    $source.$region.save({
                        pk: "sum",
                        state: 0
                    }, region_ids, function(resp) {
                        resp.ret.forEach(function(v, i) {
                            regionId_Self[v.region_id].unactiveNum = v.count || 0;
                        })
                    });

                }

            };

        },

        // loasSystem  ;  在 scope 上 附加 page 数据; 
        // $scope.od  必须 数据; 
        loadSystem : function( $scope , pageNo ){
            var d = angular.extend({
                        options: "query",
                        currentPage: pageNo,
                        itemsPerPage: $sys.itemsPerPage
                    }, $scope.od || {} );

            var permise = $source.$system.query(d, function(resp) {
 
                $scope.page.currentPage = pageNo;
                $scope.page.data = resp.data;
                $scope.page.total = resp.total;

            }).$promise ;

            return permise 

        } ,

        querySystemOnline:   function  ( uuids, pageData ) {
                return $source.$system.status(uuids, (resp) => {
                    angular.forEach( resp.ret  , (v, i) => {
                        pageData[i].online = !!( v && (v.daserver ? v.daserver.logon : v.online) );
                    })
                }).$promise; 
             
        },

        loasSystemPageData:function(){
            
        }






    }

}
