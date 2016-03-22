



export default  ( $compile )=>{
	'ngInject';

	return {
		restrict:"E", 
		replace:true , 
		templateUrl:"app/lib/directive/panel/tab_panel.html", 
	}

}