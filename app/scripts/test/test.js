var fs = require('fs');
var xml2json = require("simple-xml2json");
var json2xml = require('json2xml');

var busOntoClassifMappingFile = "../data/testData/busOnto_classif_manual_mapping.json";
var classifFreeMind = "../data/testData/classif_tc_18052016.xml";

convertPlmXml2freeMindXml(classifFreeMind);
/**
 * [fromBusOntoClassifManualMapping2csv description]
 * @param  {[type]} fileName [description]
 * @return {[type]}          [description]
 */
function fromBusOntoClassifManualMapping2csv(fileName){
    fs.readFile(fileName, 'utf8', function (err, data) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }else{

            console.log(data);
            data = JSON.parse(data);
            var newMapping = [];
            newMapping.push("conceptId,conceptName,classId,className");
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].mappedClasses.length; j++) {
                    if (j !== 0) {
                        newMapping.push(",,"+data[i].mappedClasses[j].classId+","+data[i].mappedClasses[j].className);
                    }else{
                        newMapping.push(data[i].conceptId+","+data[i].conceptName+","+data[i].mappedClasses[j].classId+","+data[i].mappedClasses[j].className);
                    }
                }
                if (data[i].mappedClasses.length === 0) {
                    newMapping.push(data[i].conceptId+","+data[i].conceptName+",,");
                }
                newMapping.push("\n");
            }
            console.log(newMapping.join("\n"));
        }
    });
}

/**
 * [convertPlmXml2freeMindXml description]
 * This function convert exported .plmxml classification 2 freemind .xml
 * @param  {[type]} fileName [description]
 * @return {[type]}          [description]
 */
function convertPlmXml2freeMindXml(fileName){
    fs.readFile(fileName, 'utf8', function (err, data) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }else{
            var plmxmlArray = data.split("\n"); 
            for (var i = 0; i < plmxmlArray.length; i++) {
                if (plmxmlArray[i].indexOf('xmlns="http://www.ugs.com/in-CLASS/1.0"') !== -1) {
                    plmxmlArray[i] = "<InClassAdminPackage>";  
                    break;
                }
            }
            var xmlTcContent = plmxmlArray.join("\r\n"); 
            var jsonTcContent = xml2json.parser(xmlTcContent).inclassadminpackage; 
            // get .json tree from .json file
            var classes = jsonTcContent.classpackage; // get classes
            var attributes = jsonTcContent.icsdictionaryattribute; // get attribute dictionary

            var attributeTypes = [];
            for (var i = 0; i < attributes.length; i++) {
                if (attributeTypes.indexOf(Object.keys(attributes[i].format)[0]) == -1) attributeTypes.push(Object.keys(attributes[i].format)[0]);
            }
            var attributeIds = attributes.map(function(e){return e.attributeid;});
            var attributeNames = attributes.map(function(e){return e.name;});
            // console.log(attributeNames);
            var jsonTree = {
                "name":"Classification Root",
                "id":"ICM",
                "title":"Classification Root"
            };
            var xmlTreeArray = [];
            getTreeFromClasses(attributes, attributeIds, classes, jsonTree);
            jsonClassifTree2xmlClassifTree(jsonTree, xmlTreeArray);
            saveFile("xmlTree.mm",xmlTreeArray.join("\n"));
        }
    });

    function saveFile(outputFilename, outputData) {
        fs.writeFile(outputFilename, outputData, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log(outputFilename+" was saved!");
            }
        }); 
    }
    function jsonClassifTree2xmlClassifTree (jsonTree, xmlTreeArray) {
        if (jsonTree.node === undefined){
            xmlTreeArray.push('<node ID="'+jsonTree.id+'" TEXT="'+jsonTree.name+'"><icon BUILTIN="edit"/></node>');
        }else{
            xmlTreeArray.push('<node ID="'+jsonTree.id+'" TEXT="'+jsonTree.name+'">');
            for (var i = 0; i < jsonTree.node.length; i++) {
                jsonClassifTree2xmlClassifTree(jsonTree.node[i], xmlTreeArray);
            }
            xmlTreeArray.push('<icon BUILTIN="folder"/></node>');
        }
    }
    function getTreeFromClasses(attributes, attributeIds, classes, node){
        for (var i = 0; i < classes.length; i++) {
            if (classes[i].icsclass.parent == node.id){
                if (node.node === undefined) node.node = [];
                var newNode = {};
                newNode.name = classes[i].icsclass.name;
                newNode.id = classes[i].classid;
                newNode.title = classes[i].icsclass.name;
                var newAttributes = [];
                if (classes[i].icsclass.attribute !== undefined) {
                    for (var j = 0; j < classes[i].icsclass.attribute.length; j++) {
                        var attrId = classes[i].icsclass.attribute[j].attributeid;
                        var idxId = attributeIds.indexOf(attrId);
                        var attrName = attributes[idxId].name;
                        newAttributes.push({
                            "name":attrName,
                            "id":attrId
                        });
                    }
                }
                if (newAttributes.length !== 0) newNode.attribute = newAttributes;
                node.node.push(newNode);
                getTreeFromClasses(attributes, attributeIds, classes, node.node[node.node.length-1]);
            }
            // if (i == (classes.length - 1)) {console.log(node);}
        }
    }
}

/**
 * [busOntoDataModelMapping2freeMind description]
 * This function produces a .mm file which represent the 
 * business ontology and classification mapping.
 * @param  {[type]} busOntoDataModelMapping [description]
 * @return {[type]}                         [description]
 */
function busOntoDataModelMapping2freeMind(busOntoDataModelMapping){
    
}

