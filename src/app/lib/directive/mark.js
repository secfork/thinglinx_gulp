


export  default ()=>{
    "ngInject";
   return {
            restrict: 'E',
            replace: true,
            template: '<span class="text-danger font-bold">*</span>',
            link: function() {
                //@if  append

                console.log("mark!");
                //@endif 
            }
        };

} 