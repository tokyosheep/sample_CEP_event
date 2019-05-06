/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/


function getData(){
    var obj = {
        name: activeDocument.name,
        width:activeDocument.width.value,
        height:activeDocument.height.value
    }
    return JSON.stringify(obj);
}