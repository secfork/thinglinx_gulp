
/*

export default ( ) => {
	"ngInject"

}

*/
 
import  source from "./source";
import  show from "./show";
import  httpInterceptor from "./httpInterceptor";
import  modal from "./modal";


import  custom_translate from "./custom_translate";

export default  ( modele)=> {


	modele.factory("$source" , source)
		.factory("$show" , show )
		.factory("modal" , modal )
		
		.factory("httpInterceptor" , httpInterceptor )
		.factory("custom_translate" , custom_translate )

	 



}