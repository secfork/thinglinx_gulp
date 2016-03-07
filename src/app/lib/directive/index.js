/*


export  default ()=>{
    "ngInject";
    return  {
        restrict:"A", 
    }

} 

transclude. instant ();

*/

import initFrameWorkDirective from "./forameworkDirective";

import panel from "./panel";

import table from "./table/table";

import panelInputGroup from "./input/panel_input_group";
import panelInput from "./input/panel_input";


import formInput from "./input/form_input";
import formRadio from "./input/form_radio";
import formInputValid from "./input/validInput";


import loadMask from "./loadMask";

import nav from "./nav";
import token from "./token";

import popwin from "./popwin";
import mark from "./mark";
 
 

export default (module) => {

    initFrameWorkDirective(module);

    module.directive("tlPanel", panel)
        .directive("tlTable", table)
        .directive("tlPanelInputs", panelInputGroup)
        .directive("tlPanelInput", panelInput)
        .directive("tlInput", formInput)
        .directive("tlRadio", formRadio)
        .directive("loadMask", loadMask)
        .directive('tlNav', nav)
        .directive('token', token)
        .directive('popwin', popwin)
        .directive('mark', mark) 


    .directive("valid", formInputValid);





}
