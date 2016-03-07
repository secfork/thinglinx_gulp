
 

 

export  default ( $compile  )=>{ 
	"ngInject";
  

	function  pText( type  , value ){

		console.log( "add  valid  " , type  , value );
		return ;
		var text =  valid[ type ] ;
		if( !text ) 
			return "<p class = 'text-danger'> "+ type+"  验证不存在</p>"

		if( value ){
			text = text.replace("X", value);
		} 
		return  "<p class='text-danger' ng-if=' m.$dirty &&  m.$error."+type+" '>"+ text +"</p>"
	} ;
 
	return  {
		restrict:"A", 
		require: 'ngModel',
		link:( scope , ele , attrs , modelCtrl )=>{

			var label = ' <label class= " col-sm-3 control-label " > '+ attrs.label +' </label> ' ,
				wrap_input = '<div class="form-group"><div class="col-sm-8"></div></div> ' ,
 				messageDom = $('<div></div>');
				
 			scope.m = modelCtrl ; 

	       
	        attrs.required  && 	messageDom.append(  pText('required') );
	        attrs.type  	&&  messageDom.append(  pText( attrs.type ) );
	        attrs.max 		&&  messageDom.append( pText( 'max' ,  attrs.max )  );
	        attrs.min 		&&  messageDom.append( pText( 'min' ,  attrs.min ) );
	        attrs.ngMinlength  &&	messageDom.append( pText( 'minlength' ,  attrs.ngMinlength  ) );
	        attrs.ngMaxlength 	&&  messageDom.append( pText( 'maxlength' ,  attrs.ngMaxlength  ) );
	       		
 
	        ele.addClass(  ele.is("input , textarea ,select")?"form-control" : " no-border" )
				.wrap( wrap_input)
	       	    .after( $compile( messageDom)( scope) ) 
				.parent().before( label );


		}

	}

} 