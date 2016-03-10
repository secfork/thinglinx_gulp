export default ($q, $location, $anchorScroll, $timeout, $sys) => {
   	

   	 // 判断 是否有ajax加载 并显隐 动作条;
  
    return {
        /* 四种拦截 key 是 固定的; */
        // optional method    通过实现 request 方法拦截请求
        'request': function(config) {
            

                config.headers['Accept-Language'] = localStorage.NG_TRANSLATE_LANG_KEY || "en";
                config.console = true;
  

            return config || $q.when(config);

        },
        /*
         // optional method  通过实现 requestError 方法拦截请求异常: 有时候一个请求发送失败或者被拦截器拒绝了
         'requestError': function (rejection) {
         // do something on request error
         if (canRecover(rejection)) {
         return responseOrNewPromise
         }
         return $q.reject(rejection);
         }, */

        // optional method   通过实现 response 方法拦截响应:
        'response': function(response) {

            console.log( "http response" , response )

            var resp = response.data

            if (resp.err) { 
                console.error("_ERR_:" + resp.err); 
                
                throw resp ;
            } 
            //return response || $q.when(response); 
            if (resp.order ) { 

                // jsorder[resp.order](); 
            }
            return response;
        },

        // optional method  通过实现 responseError 方法拦截响应异常:
        'responseError': function(response) {
            //@if  append
            console.log("responseError");
            //@endif 

            
            if (response.config.console) {
                // alert( "responseStatus:" +  response.status);
                throw (response.status + "--" + response);
            }
            //@if  append

            console.log(response.status + "--" + response  );
            //@endif 
            return response;

        }
    }
}
