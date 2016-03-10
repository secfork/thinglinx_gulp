export default ($resource , $sys ) => {
    "ngInject";


   var  restNode = $sys.restNode ;


    function $createSource(url, config1, config2) {
        return $resource( restNode  + url, config1, config2);
    };

    var  $source = {} ;
 

    $source.$deviceModel = $createSource("devmodel/:pk");
    $source.$dmPoint = $createSource("devmodel/points/:pk");
    $source.$sysProfile = $createSource("profile/:pk");
    $source.$sysLogTag = $createSource("profile/tags/:pk");
    $source.$sysTag = $createSource("sysmodel/tags/:pk");
    $source.$sysProfTrigger = $createSource("profile/triggers/:pk");
    $source.$sysModel = $createSource("sysmodel/:pk");
    $source.$sysDevice = $createSource("sysmodel/devices/:pk");
    $source.$message = $createSource("sysmodel/messages/:pk");
    $source.$contact = $createSource( "system/contacts/:pk" );
    $source.$region = $createSource( "region/:pk/:op" );
        
        // account/admin?uuid 来判断 uuid is Exist
    $source.$account = $createSource( "account/:pk" );

    $source.$role = $createSource("role/:pk");
    $source.$driver = $createSource("driver/:type");
    $source.$sub    =  $createSource("subscribe/:pk/:op");

    // http://faefae.com/:id/crate , { id:123}
    
    //    sou: connent( sys联系人) , user( 用户) , 
    //  ? send : cell_phone , verify: code ;  
    $source.$note = $createSource("sms/:op/:sou"); 

    $source.$common = $createSource("common/:op", {}, {
        // 验证 uuid ; 
        verifyUuid:{  params:{op:"vuuid"}   } ,

       // 验证 图片验证码; 
        verify: {  url: restNode +"common/verify"  }

    });

    $source.$user = $createSource("user/:pk/:op", {}, {
        login: {  url: restNode + "common/login",  method: "POST"  },
        logout: {  url:restNode + "user/logout"  }
    });
    
    /// {pk:"@pk", userid:"@userid"} ,
    $source.$userGroup = $createSource("usergroup/:pk/:userid" ,  {}, {
          queryUser :{ url: restNode + "usergroup/:pk/users" },

    });

    $source.$ticket = $createSource( "ticket/:system_id");

    $source.$system = $createSource("system/:pk/:options/:proj_id", {}, {
        sync: {  method: "GET", params:{ options:"sync" }  },
        stop: {  method: "GET" , params:{ cmd:"stop"}  },
        start: {  method: "GET", params:{ cmd:"start"} }, 
        call :{  method:"POST"  },
        active:{   params:{options:"active"} },
        deactive:{ params:{options:"deactive"}  },
        assign: { params:{options:"assign"}   }, 
        getDtuServer: {  method:"GET" },

        status: { method:"POST" , params:{ options:"status" } },
        needSync: { method:"POST" ,  params:{options:"needsync" }  }
    });

    // 权限;
    $source.$permission = $createSource( "permission/:source/:source_id/:group_id"  )
    

    return $source ; 

}
