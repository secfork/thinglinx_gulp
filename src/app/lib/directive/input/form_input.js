
 

 /**
	ng-messages  和 translate 用在一起 , translate 失效; 

	需要    <div ng-message="required"  >
                <span  translate="text.{{::manage}}"   >1111</span>
            </div>
    这样, 在次重构 麻烦; 
 */

export  default ( $compile ,$translate )=>{ 
	"ngInject"; 
  

  	var messageDomText = '<div ng-if="%s.$dirty" ng-messages="%s.$error"  ></div>',

 
  		messagesText =	'<div ng-message="%s"  class="text-danger" >' + 
  		 					'<span  translate="inputValid.%s" translate-values="{value:%s}"  > </span>' +
            			'</div>' ,

        messagesTextB = '<div ng-message="%s"  class="text-danger" >' + 
  		 					'<span  translate="inputValid.%s"   > </span>' +
            			'</div>'
            			; 


    function createMessageText( type , value ){
    	return   value? (  messagesText.format( type , type , value) ):( messagesTextB.format( type , type));
    }



	function  createMessageDom ( ele , attrs ){
		var formName =  ele.parents("form").attr('name'),
			inputName = attrs.name ,
			messageDom ,
			modalText;

			console.log( "name = " ,formName , inputName    );
				

			if( !(formName && inputName) ){

				console.error(" 没有 form 或者 input  无name: " , formName , inputName , attrs.ngModel  );
				return ; 
			} 
			modalText = formName +'.'+inputName

		    messageDom = $( messageDomText.format( modalText , modalText )   );
	        // 正则 约束; 
	        attrs.pattern  && messageDom.append( createMessageText('pattern'  )  );  

	        attrs.required  && 	messageDom.append(   createMessageText( 'required')  );
	        attrs.type  	&&  messageDom.append(   createMessageText( attrs.type)  );

	        attrs.max 		&&  messageDom.append(  createMessageText( 'max' ,  attrs.max )  ); 
	        attrs.min 		&&  messageDom.append(   createMessageText( 'min',  attrs.min ) );
	        attrs.ngMinlength   &&	messageDom.append( createMessageText('minlength', attrs.ngMinlength  ) );
	        attrs.ngMaxlength 	&&  messageDom.append( createMessageText('maxlength', attrs.ngMaxlength  ) );

	        return messageDom ;


	}
 

	return  {
		restrict:"A", 
		require: 'ngModel', 
		link:( scope , ele , attrs  )=>{

			console.log( 'valid scope ' ,scope , attrs )

			var label = '<label class="col-sm-3 control-label" translate >'+   attrs.label +'</label>' ,
				wrap_input = '<div class="form-group"><div class="col-sm-8"></div></div> ' ,
 				messageDom = $('<div></div>');
				 
	        ele.addClass(  ele.is("input , textarea ,select")?"form-control" : " no-border" )
				.wrap( wrap_input)
	       	     
	       	    .after(  $compile( createMessageDom( ele , attrs) )(scope)  )

				.parent().before(     $compile(  label  )( scope)     );
				 


		}

	}

} 