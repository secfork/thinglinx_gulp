/*


export  default ()=>{
    "ngInject";
    return  {
        restrict:"A", 
    }

} 

translate. instant ();

*/

import initFrameWorkDirective from "./forameworkDirective";

import panel from "./panel/panel";
import  subject  from "./panel/subject";


import tabpanel from "./panel/tabpanel";

import table from "./table/table";

import panelInputGroup from "./input/panel_input_group";
import panelInput from "./input/panel_input";


import formInput from "./input/form_input";


import loadMask from "./loadMask";

import nav from "./nav";
import token from "./token";

import popwin from "./popwin";
import mark from "./mark";

import privilege2text from "./privilege2text";



export default (module) => {

    initFrameWorkDirective(module);

    module.directive("tlPanel", panel)
        .directive("tlSubject" , subject )

        .directive("tlTabPanel", tabpanel)

        .directive("tlTable", table)
        .directive("tlPanelInputs", panelInputGroup)
        .directive("tlPanelInput", panelInput)
        .directive("tlInput", formInput)

        .directive("loadMask", loadMask)
        .directive('tlNav', nav)
        .directive('token', token)
        .directive('popwin', popwin)
        .directive('mark', mark)

        .directive("privilege2text", privilege2text)


        .directive("tlPagger" , ()=>{
            return {  restrict:"E", templateUrl:"app/debris/_pager.html"  }
        })







}