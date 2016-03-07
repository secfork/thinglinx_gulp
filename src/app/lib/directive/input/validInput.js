 

export default ($compile ) => {

    "ngInject" ;

    var valid =  {
        "required": "该字段不能为空!",
        "min": "该数值必须不小于X",
        "max": "该数值必须小于X",

        "minlength": "该字段至少为X个字符!",
        "maxlength": "该字段不能不超过X个字符!",

        // 类型验证； 
        "email": "Email格式不正确!",
        "number": "该字段必须为数字格式!",
        "Number": "该字段必须为数字格式!"  
    } ;
    function  pText( type  , value ){
    	var text =  valid[ type ] ;
    	if( !text ) 
    		return "<p class = 'text-danger'> "+ type+"  验证不存在</p>"

    	if( value ){
    		text = text.replace("X", value);
    	} 
    	return  "<p class='text-danger' ng-if=' m.$dirty &&  m.$error."+type+" '>"+ text +"</p>"
    } ;

    return {
        restrict:"A", 
        require: 'ngModel',
        link:( scope , ele , attrs , modelCtrl )=> {

            $scope.m = modelCtrl;

            var  messageDom = $('<div></div>');
            
            $attrs.required  && messageDom.append(  pText('required') );
            $attrs.type  &&   messageDom.append(  pText( $attrs.type ) );
            $attrs.max &&    messageDom.append( pText( 'max' ,  $attrs.max )  );
            $attrs.min &&   messageDom.append( pText( 'min' ,  $attrs.min ) );
            $attrs.ngMinlength  && messageDom.append( pText( 'minlength' ,  $attrs.ngMinlength  ) );
            $attrs.ngMaxlength &&  messageDom.append( pText( 'maxlength' ,  $attrs.ngMaxlength  ) );
            
            $ele.after( $compile( messageDom)( $scope) ) ;

        } 
        
    }
}
