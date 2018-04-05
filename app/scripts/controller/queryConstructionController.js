(function(angular) {
    'use strict';
    var app = angular.module("vaquero");

    app.directive('onReadFile', function($parse) {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs) {
                var fn = $parse(attrs.onReadFile);

                element.on('change', function(onChangeEvent) {
                    var reader = new FileReader();

                    reader.onload = function(onLoadEvent) {
                        scope.$apply(function() {
                            fn(scope, { $fileContent: onLoadEvent.target.result });
                        });
                    };
                    reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                });
            }
        };
    });

    app.controller('queryConstructionController', ['$location', '$rootScope', '$scope', '$uibModal', '$sce', '$q', '$timeout', '$http', '$window', controller]);
    function controller($location, $rootScope, $scope, $modal, $sce, $q, $timeout, $http, $window) {
        angular.element(document).ready(function() { // This code is executed after DOM loaded fully
            $scope.classifTreeRootClassId = "ICM";
            $scope.ontoConceptTreeModel = { "items": [] };
            $scope.queryConceptIds = [];
            $scope.operators = ["<=", "<", ">=", ">", "!=", "="];
            $scope.listCheckExamTypeDmObjectTypes = ["GIN4_ExamRes", "GIN4_Acquisition", "GIN4_DataUnit"];

            $scope.ontologySelection = {
                value: 1,
                options: {
                    floor: 0,
                    ceil: 1,
                    step: 1,
                    showTicksValues: false,
                    showTicks:false,
                    translate: function(value) {
                        var conceptTreeTypes = ["End-user view", "IT View"];
                        return  conceptTreeTypes[value];
                    }
                }
            };

            $scope.oneAtATime = true;
            $scope.status = {
                isFirstOpen: true,
                isFirstDisabled: false
            };

            $scope.returnResultNumber = { "value": "" };
            $scope.selectedReturnResultNumberOption = { "optionValue": "All" };
            $scope.returnResultNumberOptions = [{"optionName":"All","optionValue":"all"},{"optionName":"Other","optionValue":"other"}];

            $scope.selectedQueryOption = {"optionValue": "onlyRootQueryObject"};
            $scope.resultWithClassif = {"optionValue": 1};

            $scope.queryOptions = [{
	                "optionName": "Get only root query object and it's attributes' value.",
	                "optionValue": "onlyRootQueryObject",
	            }, 
	            {
	                "optionName": "Get related objects and their attributes' value.",
	                "optionValue": "getRelatedObjects"
	            }
	        ];

             $scope.resultWithClassifOptions = [{
                    "optionName": "Get results only with Ids",
                    "optionValue": 1,
                }, 
                {
                    "optionName": "Get results with information from the Classification.",
                    "optionValue": 2
                }
            ];

            $scope.tabs = [{
                    title: 'Attribute Selection',
                    url: 'attrSelection.tpl.html'
                }
                /*,{
                    title: 'd3 All Result Graph',
                    url: 'd3AllResultGraph.tpl.html'
                }
                ,
		        {
		            title: 'Results',
		            url: 'results.tpl.html'
		    	}
		        {
		            title: 'Classified Result',
		            url: 'classifiedResutls.tpl.html'
		    	}*/
            ];

            $scope.userAccount = {};
            $scope.currentTab = 'attrSelection.tpl.html';

            $scope.onClickTab = function(tab) {
                $scope.currentTab = tab.url;
            };

            $scope.isActiveTab = function(tabUrl) {
                return tabUrl == $scope.currentTab;
            };

            // $scope.$watch('ontologySelection',function(){
            //     switch($scope.ontologySelection.value) {
            //         case 0:
            //             initialization($scope.busOntoConceptTreeArray,$scope.busOntoRelationGraph);
            //             break;
            //         case 1:
            //             initialization($scope.appOntoConceptTreeArray,$scope.appOntoRelationGraph);
            //             break;
            //         case 2:
            //             initialization($scope.busOntoDmConceptTreeArray,$scope.busOntoDmRelationGraph);
            //             break;
            //     }
            // },true);

            // function initialization(ontoConceptTreeArray, relationGraph) {
            //     $scope.conceptTreeArray = ontoConceptTreeArray;
            //     $scope.conceptTree = $scope.conceptTreeArray[0]; $scope.listConcept = []; 
            //     getListConceptFromTree($scope.conceptTree, $scope.listConcept);
            //     $scope.listConceptIds = $scope.listConcept.map(function(e) {return e.id;});
            //     $scope.ontoConceptTreeModel.items = ontoConceptTreeArray;
            //     $scope.d3RelationGraph = relationGraph;
            //     $scope.d3ConceptRelations = setD3ConceptRelations($scope.d3RelationGraph);
            //     displayD3RelationGraph($scope.d3RelationGraph);
            //     $scope.clickedQueryObject = undefined;
            //     fnRemoveD3QueryGraph();
            // }

            // $http.get("data/appOnto_v1_conceptTree_array.json").success(function(data) {
            //     $scope.appOntoConceptTreeArray = data;
            //     $http.get("data/appOnto_v1_relationGraph.json").success(function(data) {
            //         $scope.appOntoRelationGraph = data;
            //     });
            // });

            // $http.get("data/busOnto_dm_v1_conceptTree_array.json").success(function(data) {
            //     $scope.busOntoDmConceptTreeArray = data;
            //     $http.get("data/busOnto_dm_v1_relationGraph.json").success(function(data) {
            //         $scope.busOntoDmRelationGraph = data;
            //         initialization($scope.busOntoDmConceptTreeArray, $scope.busOntoDmRelationGraph);
            //     });

            //     // $scope.busOntoConceptTreeArray = data;
            //     // $scope.busOntoConceptTree = data[0];
            //     // $scope.conceptTreeArray = $scope.busOntoConceptTreeArray;
            //     // $scope.conceptTree = data[0]; $scope.listConcept = [];
            //     // getListConceptFromTree($scope.conceptTree, $scope.listConcept);
            //     // $scope.ontoConceptTreeModel.items = $scope.conceptTreeArray;
            // });

            // $http.get("data/busOnto_v3_conceptTree_array.json").success(function(data) {
            //     $scope.busOntoConceptTreeArray = data;
            //     $http.get("data/busOnto_v3_relationGraph.json").success(function(data) {
            //         $scope.busOntoRelationGraph = data;
            //     });
            // });

            // $http.get("data/busOnto_relationGraph.json").success(function(data) {
            //     console.log(data);
            //     $scope.d3RelationGraph = data;
            //     $scope.d3ConceptRelations = setD3ConceptRelations($scope.d3RelationGraph);
            //     displayD3RelationGraph($scope.d3RelationGraph);
            // });

            // $http.get("data/exported_tc_classif.xml").success(function(data) {
            //     $scope.jsonExportedClassif = plmxlmClassif2jsonExportedClassif(data);
            //     jsonExportedClassif2classifTree($scope.jsonExportedClassif);
            //     $scope.allLeafClasses = [];
            //     getAllLeafClasses($scope.classifTree, $scope.allLeafClasses);
            //     $scope.allLeafClassIds = $scope.allLeafClasses.map(function(e) {return e.id;});
            // });

            // $http.get("data/list_path.json").success(function(data) {
            //     $scope.listPath = data;
            //     console.log($scope.listPath);
            // });

            // $http.get("data/all_result.xml").success(function(data) {
            //     $scope.jsonAllResult = $.xml2json(data);
            //     $scope.d3AllResultGraph = jsonAllResult2d3AllResultGraph($scope.jsonAllResult);
            //     displayD3AllResultGraph($scope.d3AllResultGraph);
            //     console.log($scope.jsonAllResult);
            //     console.log($scope.d3AllResultGraph);
            // });
            

            /**
             * THIS SECTION READ .OWL FILE AND CONVERT IT INTO CONCEPTS TREE AND RELATIONS GRAPHS
             */
            $http.get("data/lucid/onto-stepNC.owl").success(function(data) {
                $http.get("http://localhost:8080/queries").success(function(data) {
                    console.log('saved queries', data);
                });
                $http({
                    method  : 'POST',
                    url     : 'http://localhost:8080/queries/',
                    data    : $.param({
                                        name: "query_03",
                                        query_content: "query content"
                                    }),
                    headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                })
                .success(function(data, status, headers, config) {
                    console.log("result", data);
                })
                .error(function(data, status, headers, config){
                    console.log("error"+data);
                });
                $scope.owlOnto = data;
                $scope.jsonOnto = owlOnto2jsonOnto($scope.owlOnto);
                jsonOnto2conceptTreeRelationGraph($scope.jsonOnto);
                // addGroup2ConceptTree($scope.ontoConceptTree);
                console.log('final ontoConceptTree', $scope.ontoConceptTree);
                // writeFile("ontoConceptTree.json", JSON.stringify($scope.ontoConceptTree));
                $scope.ontoConceptTreeArray = [$scope.ontoConceptTree];
                $scope.ontoConceptTreeModel.items = $scope.ontoConceptTreeArray;
                $scope.d3RelationGraphDict = getD3RelationGraphDict($scope.ontoConcepts, $scope.ontoConceptDict, $scope.d3ConceptDict);
                /*$scope.d3RelationGraph = getD3RelationGraph($scope.ontoConceptTree);
                $scope.d3ConceptRelations = setD3ConceptRelations($scope.d3RelationGraph);
                displayD3RelationGraph($scope.d3RelationGraph);*/
                $scope.clickedQueryObject = undefined;
                fnRemoveD3QueryGraph();
            })

       		/**
             * @param  {ontoConceptTree}
             * @return {[d3RelationGraph]}
             */
            function getD3RelationGraph(ontoConceptTree) {
                $scope.listD3LeafConcept = [];
                getListLeafConcept(ontoConceptTree, $scope.listD3LeafConcept);
                $scope.listD3LeafConcetpIds = $scope.listD3LeafConcept.map(function(e) {return e.conceptId;});
                return getListD3RelationGraph($scope.listD3LeafConcept, $scope.listD3LeafConcetpIds);                
                // writeFile("d3RelationGraph.json", [JSON.stringify($scope.d3RelationGraph)]);
            };

            function getD3RelationGraphDict(ontoConcepts, ontoConceptDict, d3ConceptDict) {
                var d3RelationGraphDict = {};
                ontoConcepts.forEach(function(ontoConcept) {
                  var listD3Nodes = [], listD3Links = [];
                  listD3Nodes.push(jQuery.extend({}, true, d3ConceptDict[ontoConcept.id]));
                  ontoConcept.objectRestrictions.forEach(function(restriction) {
                    if (restriction.restrictionFiller !== "") {
                      if (d3ConceptDict[restriction.restrictionFiller] !== undefined) {
                        // console.log('Errror here........', ontoConcept);
                        // console.log('d3ConceptDict: ', d3ConceptDict);
                            var newConcept = jQuery.extend({}, true, d3ConceptDict[restriction.restrictionFiller]);
                            newConcept.linkLabel = restriction.restrictedProperty;
                            newConcept.group = restriction.restrictionGroup;
                            newConcept.direction = (restriction.restrictionDirection == -1) ? -1 : 1;
                            listD3Nodes.push(newConcept);
                            if (restriction.restrictionDirection == -1) {
                                listD3Links.push({
                                    "sourcedId": restriction.restrictionFiller,
                                    "source":  listD3Nodes.length - 1,
                                    "targetId": ontoConcept.id,
                                    "target": 0,
                                    "label": restriction.restrictedProperty                                
                                });
                            } else {
                                listD3Links.push({
                                    "sourcedId": ontoConcept.id,
                                    "source": 0,
                                    "targetId": restriction.restrictionFiller,
                                    "target": listD3Nodes.length - 1,
                                    "label": restriction.restrictedProperty                                
                                });
                            }
                        } else {
                            console.log('ontoConcept Datatype property', ontoConcept);
                        }   
                    }
                  });
                // reset positions for all nodes.

                // METHOD 01
                //   var sumYi = 0, n = listD3Nodes.length;
                //   listD3Nodes.forEach(function(node, i) {                      
                //       if (i == 0) {
                //         node.x = 100; // set position for center node
                //       } else {
                //         node.x = 300;
                //         node.y = 32*i;
                //         sumYi += node.y;
                //       }
                //   })
                //   listD3Nodes[0].y = (n == 1) ? 100 : sumYi/(n-1);

                // METHOD 02
                  var leftNodes = listD3Nodes.filter(node => (node.direction == -1) && (listD3Nodes.indexOf(node) !== 0)), 
                      rightNodes = listD3Nodes.filter(node => (node.direction !== -1) && (listD3Nodes.indexOf(node) !== 0));
                  var y_min = 10, y_max = document.getElementById("relationGraph").clientHeight-100;
                  var n = listD3Nodes.length;
                  if (n == 1) listD3Nodes[0].x = 100; listD3Nodes[0].y = (y_max - y_min) / 2;
                  if (n == 2) { 
                    listD3Nodes[0].x = 300; 
                    listD3Nodes[0].y = (y_max - y_min) / 2;
                    listD3Nodes[1].x = (listD3Nodes[1].direction == -1 ) ? 100 : 500;
                    listD3Nodes[1].y = y_min; 
                  } 
                  if (n >= 3) {
                    listD3Nodes[0].x = 300; 
                    listD3Nodes[0].y = (y_max - y_min) / 2;
                    if (leftNodes.length > 0) resetPosition(leftNodes, y_min, y_max, 100);
                    if (rightNodes.length > 0) resetPosition(rightNodes, y_min, y_max, 500);
                  }

                  d3RelationGraphDict[ontoConcept.id] = {"nodes": listD3Nodes, "links": listD3Links};
                });                
                return d3RelationGraphDict;
            }

            function resetPosition(nodes, y_min, y_max, xi) {
                var n = nodes.length
                if (n == 1) nodes[0].x = xi; nodes[0].y = (y_max - y_min) / 2;                         
                if (n >= 2)
                    for (var i = 0; i < n; i++) {                        
                        nodes[i].x = nodes[i].isProperty ? (xi < 300 ? 50 : 550) : xi;
                        nodes[i].y = y_min + i * (y_max - y_min) / (n - 1);
                    }  
            }

            function getListLeafConcept(conceptTree, listD3LeafConcept){
                if (conceptTree.node === undefined){
                    listD3LeafConcept.push(setNewD3ObjectFromConcept(conceptTree));
                }else{
                    for (var i = 0; i < conceptTree.node.length; i++) {
                        getListLeafConcept(conceptTree.node[i], listD3LeafConcept);
                    }
                }
            }

            function getListConcept(conceptTree, listConcept){
                listConcept.push(conceptTree);
                if (conceptTree.node !== undefined){
                    for (var i = 0; i < conceptTree.node.length; i++) {
                        getListConcept(conceptTree.node[i], listConcept);
                    }
                }
            }

            function getListD3RelationGraph(listConcepts, listConceptIds){
                var listD3Nodes = [], listD3Links = [];
                for (var i = 0; i < listConcepts.length; i++) {
                    listD3Nodes.push(listConcepts[i]);
                    for (var j = 0; j < listConcepts[i].objectRestrictions.length; j++) {
                        if (listConcepts[i].objectRestrictions[j].restrictedProperty !== "subClassOf")
                            if (listConcepts[i].objectRestrictions[j].restrictionFiller !== "")
                                if (listConceptIds.indexOf(listConcepts[i].objectRestrictions[j].restrictionFiller) !== -1)
                                    listD3Links.push({
                                        "sourceId":listConcepts[i].conceptId,
                                        "source":i,
                                        "targetId":listConcepts[i].objectRestrictions[j].restrictionFiller,
                                        "target":listConceptIds.indexOf(listConcepts[i].objectRestrictions[j].restrictionFiller),
                                        "label":listConcepts[i].objectRestrictions[j].restrictedProperty
                                    });
                    }
                }
                return {
                    "nodes":listD3Nodes,
                    "links":listD3Links
                };
            }

            function setNewD3ObjectFromConcept(concept){
                var valueAttr = {
                    "attrName": "value",
                    "attrValue": "",
                    "attrOrigin": "property",
                    "attrTCName": "",
                    "attrOperator": "",
                    "checked": false,
                    "objectName": "",
                    "getValue": false,
                };
                var x = (document.getElementById("queryGraph") !== null) ? Math.floor(Math.random() * document.getElementById("queryGraph").clientWidth) : Math.floor(Math.random()*800);
                var y = (document.getElementById("queryGraph") !== null) ? Math.floor(Math.random() * document.getElementById("queryGraph").clientHeight) : Math.floor(Math.random()*500);
                var color = d3.scale.category20();
                var newD3Object = {
                    "conceptId":concept.id,
                    "objectId":concept.id,
                    "objectName":concept.name,
                    "objectDisplayName":concept.displayName,
                    "objectRestrictions":concept.objectRestrictions,
                    "mappedDmObjectType":concept.mappedDmObjectType,
                    "x":x,
                    "y":y,
                    "currentPosition":{
                        "x":x,
                        "y":y
                    },
                    "objectAttrs": concept.isProperty ? [valueAttr] : [],
                    "color":color(concept.group),
                    "group":concept.group,
                    "opacity":"1",
                    "fillOpacity":"1",
                    "r":concept.isProperty ? 8 : 12,
                    "children": concept.children,
                    "fixed":true,
                    "isProperty": concept.isProperty,
                    "duplicatedIndex": 0
                };
                return newD3Object;
            }

            /**
             * [owlOnto2jsonOnto description]
             * This code converts .owl to json. It requires stringifying 
             * xml2json and then parse it to json. 
             * @param  {[type]} owlOnto [description]
             * @return {[type]}         [description]
             */
            function owlOnto2jsonOnto(owlOnto){
                var jsonOntoString = JSON.stringify($.xml2json(owlOnto));
                var jsonOnto = JSON.parse(jsonOntoString);
                console.log('jsonOnto: ', jsonOnto);
                var subClassOfProps = [];
                jsonOnto.Class.forEach(function(ontoClass) {
                    if (ontoClass.subClassOf !== undefined) 
                        if (ontoClass.subClassOf.length !== undefined)
                            ontoClass.subClassOf.forEach(function(subClass) {
                                if (subClass.Restriction !== undefined)
                                    subClassOfProps = [...new Set([...subClassOfProps, ...Object.keys(subClass.Restriction)])];
                            })
                });
                console.log('subClassOfProps: ', subClassOfProps);
                return jsonOnto;
            }
            
            /**
             * [jsonOnto2conceptTree description]
             * This function gets concept tree (.json) from ontology (.json)
             * @param  {[type]} jsonOnto [the converted .json content from .owl content]
             * @return {[type]}          [description]
             */
            function jsonOnto2conceptTreeRelationGraph(jsonOnto) {
                $scope.ontoPrefix = jsonOnto.Ontology["rdf:about"];
                $scope.ontoRootConceptId = "";
                if (jsonOnto.ObjectProperty.length === undefined) jsonOnto.ObjectProperty = [jsonOnto.ObjectProperty];
                $scope.objectProperties = jsonOnto.ObjectProperty.map(function(e){return e["rdf:about"];});
                // $scope.ontoClasses = jsonOnto.Class;
                $scope.ontoClasses = [];
                jsonOnto.Class.forEach(function(cl) {
                    $scope.ontoClasses.push(jQuery.extend(true, {}, cl));
                });
                $scope.ontoClasses = addRootConcept($scope.ontoClasses, $scope.ontoPrefix);
                getPropsFromParent($scope.ontoClasses);
                $scope.ontoConcepts = getChildrenOfConcepts($scope.ontoClasses, $scope.ontoPrefix);
                console.log('ontoConcepts with children information: ', $scope.ontoConcepts);
                // $scope.ontoConcepts = ontoClasses2ontoConcepts($scope.ontoClasses, $scope.ontoPrefix);
                

                for (var i = 0; i < $scope.ontoConcepts.length; i++) {
                    if ($scope.ontoConcepts[i].conceptParentIds === undefined){
                        $scope.ontoRootConcept = $scope.ontoConcepts[i];
                        $scope.ontoRootConceptId = $scope.ontoConcepts[i].id;
                    }
                }
                
                $scope.ontoConceptTree = jQuery.extend(true, {}, $scope.ontoRootConcept);
                var dicts = ontoConcepts2ontoConceptDict($scope.ontoConcepts);
                $scope.ontoConceptDict = jQuery.extend(true, {}, dicts[0]);
                $scope.d3ConceptDict = jQuery.extend(true, {}, dicts[1]); 
                console.log('ontoConceptDict, xxxxxxxxxxxxx', $scope.ontoConceptDict);
                ontoConcepts2ontoConceptTree($scope.ontoConceptTree, $scope.ontoConceptDict);

                $scope.ontoConceptIds = $scope.ontoConcepts.map(function(e) {return e.id;});
                $scope.relationGraph = ontoConcepts2relationGraph($scope.ontoConcepts, $scope.ontoConceptIds);

                // writeFile("ontoConceptTree.json", JSON.stringify($scope.ontoConceptTree));
                // writeFile("relationGraph.json", JSON.stringify($scope.relationGraph));
            }

            /**
             * [addRootConcept description]
             * In the case the imported ontology (.owl) dont have a real root concept (many concepts (A) isSubClass of owl:Thing).
             * We add a 'fake' root concept called 'rootConcept' and put all concepts in A as its children.
             * This function creates concept from ontology class. Each concept is a node in the
             * Node format: 
             * {"node":[{"id":"","name":"","annotations":[{"type":"rdfs:Literal","comment":""}],"objectRestrictions":[{"restrictedProperty":"executes","restrictionType":"some","restrictionFiller":"acquisition"}],"node":[]}]}}
             */
            function addRootConcept(ontoClasses, ontoPrefix) {			
                console.log('ontoClasses', ontoClasses);
                // console.log("need to add 'fake' root concept: ", hasNotRootConcept(ontoClasses));
                if (hasNotRootConcept(ontoClasses)) {
                    // 'fake' rootClass

                    for (var k = 0; k < ontoClasses.length; k++) {
                        if (ontoClasses[k].subClassOf === undefined){ // This is noParent concept without restrictions
                            console.log('subClass of rootConcept', ontoClasses[k]);
                            ontoClasses[k].subClassOf = 
                                {'rdf:resource': ontoPrefix + "#rootConcept"}
                            ;
                            ontoClasses[k].noRealParent = true; // <== add fake parent
                            console.log('noParent class: ', ontoClasses[k]);
                        } 
                        else { // This concept has subClassOf properties
                            var classSubClassOf = ontoClasses[k].subClassOf;					
                            if (classSubClassOf.length !== undefined) { // classSubClassOf is not an object 
                                var check = true // check if all subClassOf are restriction type
                                classSubClassOf.forEach(function(item) {
                                    if (item.Restriction === undefined) check = false;
                                })
                                if (check) {
                                    // this is noParent concept with restrictions
                                    ontoClasses[k].noRealParent = true; // <== add fake parent
                                    // console.log('noParent class here: ', ontoClasses[k]);
                                }
                            } else {
                                if (classSubClassOf.Restriction !== undefined) { // This is noParent concept with only one Restriction subClassOf
                                    // console.log('noParent - one restriction: ', ontoClasses[k]);
                                    ontoClasses[k].subClassOf = [ontoClasses[k].subClassOf];
                                    ontoClasses[k].noRealParent = true; // <== add fake parent
                                } 
                            }
                        }
                    }

                    ontoClasses.push({
                        'rdf:about': ontoPrefix + "#rootConcept"
                    });
                }			
                console.log("Recheck: need to add 'fake' root concept: ", hasNotRootConcept(ontoClasses));	
                return ontoClasses;
            }

            function hasNotRootConcept(ontoClasses) {
                // check if adding 'fake' root concept is necessary. 
                // adding 'fake' root concept is necessary only if there are more than one class thats dont have parent class.
                var count = 0;
                for (var k = 0; k < ontoClasses.length; k++) {
                    if (ontoClasses[k].subClassOf === undefined){ // This is noParent concept without restrictions
                        count += 1;
                        // console.log('noParent class: ', ontoClasses[k]);
                    } 
                    else { // This concept has subClassOf properties
                        var classSubClassOf = ontoClasses[k].subClassOf;					
                        if (classSubClassOf.length !== undefined) { // classSubClassOf is not an object 
                            var check = true // check if all subClassOf are restriction type
                            classSubClassOf.forEach(function(item) {
                                if (item.Restriction === undefined) {
                                    check = false;
                                    console.log(item);
                                }
                            })
                            if (check) {
                                console.log('Node without subClassOf', ontoClasses[k]);
                                count += 1 // this is noParent concept with all restrictions subClassOf
                                // console.log('noParent class - all restriction subClassOf: ', ontoClasses[k]);
                            }
                        } else {
                            if (classSubClassOf.Restriction !== undefined) { // This is noParent concept with only one Restriction subClassOf
                                console.log('noParent - one restriction: ', ontoClasses[k]);
                                count += 1;
                            } 
                        }
                    }
                }
                // console.log('countNoParentClass: ', countNoParentClass)
                var hasNotRootConcept = (count > 1) ? true : false;
                return hasNotRootConcept;
            }

            function getPropsFromParent(ontoClasses) {
                // add classParentId into each class
                ontoClasses.forEach(function(ontoClass) {
                    ontoClass.restrictions = [];
                    if (ontoClass.subClassOf !== undefined) {
                        if (ontoClass.subClassOf.length === undefined) { // subClassOf is an object.
                            var newSubClassOf = jQuery.extend({}, true, ontoClass.subClassOf);
                            if (newSubClassOf['rdf:resource'] !== undefined) 
                                ontoClass.classParentId = newSubClassOf['rdf:resource'];
                            else {
                                newSubClassOf.Restriction.inherited = true;
                                ontoClass.restrictions.push(newSubClassOf);
                            }
                        } else 
                            ontoClass.subClassOf.forEach(function(subClassOf) {
                                var newSubClassOf = jQuery.extend({}, true, subClassOf);
                                if (newSubClassOf['rdf:resource'] !== undefined) 
                                    ontoClass.classParentId = newSubClassOf['rdf:resource'];
                                else {
                                    newSubClassOf.Restriction.inherited = true;
                                    ontoClass.restrictions.push(newSubClassOf);
                                }
                            })                        
                    } else {
                        $scope.rootClass = ontoClass;
                    }
                });
                ontoClasses.forEach(function(ontoClass) {
                    if (ontoClass.noRealParent) {
                        setPropsChild(ontoClasses, ontoClass);
                    }
                })
            };

            function setPropsChild(ontoClasses, parentClass) {
                ontoClasses.forEach(function(ontoClass) {
                    if (ontoClass.classParentId == parentClass['rdf:about']) {
                        if (parentClass['rdf:about'] == $scope.ontoPrefix + '#executable') {
                            console.log(parentClass);
                        };
                        ontoClass.subClassOf = (ontoClass.subClassOf.length === undefined) ? [ontoClass.subClassOf] : ontoClass.subClassOf;
                        ontoClass.subClassOf = [...new Set([...parentClass.restrictions, ...ontoClass.subClassOf])];
                        ontoClass.restrictions = [...new Set([...parentClass.restrictions, ...ontoClass.restrictions])];
                        setPropsChild(ontoClasses, ontoClass);                                                
                    }
                })
            }

            function ontoClasses2ontoClassTree(ontoClasses, ontoClassTree) {
                for (var i = 0; i < ontoClasses.length; i++) {
                    if (ontoClasses[i].conceptParentId == ontoClassTree.id) {
                        if (ontoClassTree.node === undefined) ontoConceptTree.node = [];
                        ontoConceptTree.node.push(jQuery.extend(true, {}, ontoConcepts[i]));
                    }        
                }
    
                if (ontoConceptTree.node !== undefined){
                    for (var k = 0; k < ontoConceptTree.node.length; k++) {
                        ontoConcepts2ontoConceptTree(ontoConceptTree.node[k], ontoConcepts);
                    }
                }
            }

            /**
             * [getOntoConcepts description]
             * This function get concepts from classes with parent/children properties.		 
             */
            function getChildrenOfConcepts(ontoClasses, ontoPrefix) {
                var ontoConcepts = [];
                var childrenDict = {};
                var ontoConceptDict = {};
                
                ontoClasses.forEach(function(ontoClass) {
                    childrenDict[ontoClass['rdf:about']] = [];
                    ontoConceptDict[ontoClass['rdf:about']] = {};
                });

                for (var k = 0; k < ontoClasses.length; k++) {
                    var ontoClass = ontoClasses[k];
                    if (ontoClass['rdf:about'] == $scope.ontoPrefix + '#workplan') {
                        console.log('ontoClass workplan', ontoClass);
                    }
                    var tempObjectRestrictions = [];
                    var conceptParentIds = [];
                    var isProperty = false;
                    if (ontoClass.subClassOf === undefined){ // This is root concept without restrictions
                        ontoConcepts.push({
                            "id": ontoClass["rdf:about"],
                            "name": (ontoClass.label !== undefined) ? ontoClass.label : ontoClass["rdf:about"].slice(ontoPrefix.length+1),
                            "annotations" : [{
                                "type": "rdfs:Literal",
                                "comment": ontoClass.comment
                            }],
                            "objectRestrictions": [],
                            'isProperty': isProperty
                        });
                    } else {
                        var conceptParentIds = [];
                        var classSubClassOf = ontoClass.subClassOf;
                        var tempParentId = '';
                        if (classSubClassOf.length === undefined){ 
                            // This concept doesn't have any restrictions with other concepts except "subClassOf"
                            if (classSubClassOf['rdf:resource'] !== undefined) {							
                                tempObjectRestrictions.push({
                                    "restrictedProperty": "subClassOf",
                                    "restrictionType": "",
                                    "restrictionFiller": classSubClassOf["rdf:resource"],
                                    "restrictionGroup": "subClassRes"
                                });
                                if (ontoConceptDict[classSubClassOf["rdf:resource"]] === undefined) isProperty = true;
                                tempParentId = classSubClassOf["rdf:resource"];					
                                // if (conceptParentId === undefined)
                                // 		console.log("undefined conceptParentId 2: ", ontoClass);
                            } else {
                                var newRestriction = createNewRestriction(classSubClassOf, ontoPrefix);
                                if (ontoConceptDict[newRestriction.restrictionFiller] === undefined) isProperty = true;
                                tempObjectRestrictions.push(newRestriction);
                                tempParentId = newRestriction.restrictionFiller;
                            }
                            if (childrenDict[tempParentId] !== undefined)	{
                                conceptParentIds.push(tempParentId);
                                if (childrenDict[tempParentId].indexOf(ontoClass['rdf:about']) == -1)
                                        childrenDict[tempParentId].push(ontoClass['rdf:about']);
                            }
                        } else {
                            for (var i = 0; i < classSubClassOf.length; i++) {
                                if (classSubClassOf[i].Restriction === undefined){ // This is a "subClassOf" restriction
                                    tempObjectRestrictions.push({
                                        "restrictedProperty": "subClassOf",
                                        "restrictionType": "",
                                        "restrictionFiller": classSubClassOf[i]["rdf:resource"],
                                        "restrictionGroup": "subClassRes"
                                    });				
                                    if (ontoConceptDict[newRestriction.restrictionFiller] === undefined) isProperty = true;
                                    tempParentId = classSubClassOf[i]["rdf:resource"];  
                                    // if (conceptParentId === undefined)
                                    // 	console.log("undefined conceptParentId 2: ", ontoClass);
                                } else {
                                    var newRestriction = createNewRestriction(classSubClassOf[i], ontoPrefix);
                                    if (ontoConceptDict[newRestriction.restrictionFiller] === undefined) isProperty = true;
                                    tempObjectRestrictions.push(newRestriction); 
                                    tempParentId = newRestriction.restrictionFiller;
                                }
                                if (childrenDict[tempParentId] !== undefined)	{
                                    conceptParentIds.push(tempParentId);
                                    if (childrenDict[tempParentId].indexOf(ontoClass['rdf:about']) == -1)
                                        childrenDict[tempParentId].push(ontoClass['rdf:about']);
                                }
                            }
                        }
                        var newConcept = {
                            "id": ontoClass["rdf:about"],
                            "name": (ontoClass.label !== undefined) ? ontoClass.label : ontoClass["rdf:about"].slice(ontoPrefix.length+1),
                            "displayName": ontoClass["rdf:about"].slice(ontoPrefix.length+1),
                            "annotations" : [{
                                "type": "rdfs:Literal",
                                "comment": ontoClass.comment
                            }],
                            "conceptParentIds": conceptParentIds,
                            "objectRestrictions": tempObjectRestrictions,
                            "isProperty": isProperty			
                        };
                        ontoConcepts.push(newConcept);
                        ontoConceptDict[newConcept.id] = deepCopy(newConcept);
                    }
                }

                // writeFile("ontoConceptDict_before.json", JSON.stringify(ontoConceptDict));

                ontoConcepts.forEach(function(concept) {
                    concept.children = childrenDict[concept.id];                    
                    concept.children.forEach(function(childId) {
                        var tempConcept = deepCopy(ontoConceptDict[childId]);
                        var objRestrictions = tempConcept.objectRestrictions;
                        objRestrictions.forEach(function(res) {
                            if (res.restrictionFiller == concept.id) {
                                concept.objectRestrictions.push({
                                    "restrictedProperty": res.restrictedProperty,
                                    "restrictionType": res.restrictionType,
                                    "restrictionFiller": childId,
                                    "restrictionGroup": res.restrictionGroup,
                                    "restrictionDirection": -1
                                })
                            }
                        })
                    });
                });

                
                
                console.log('ontoConcepts: ', ontoConcepts);
                // writeFile("ontoConceptDict_after.json", JSON.stringify(ontoConceptDict));
                // writeFile("ontonConcepts.json", JSON.stringify(ontoConcepts));
                return ontoConcepts;                
            }

            
            function deepCopy(obj) {
                var toString = Object.prototype.toString;
                var rv;
            
                switch (typeof obj) {
                    case "object":
                        if (obj === null) {
                            // null => null
                            rv = null;
                        } else {
                            switch (toString.call(obj)) {
                                case "[object Array]":
                                    // It's an array, create a new array with
                                    // deep copies of the entries
                                    rv = obj.map(deepCopy);
                                    break;
                                case "[object Date]":
                                    // Clone the date
                                    rv = new Date(obj);
                                    break;
                                case "[object RegExp]":
                                    // Clone the RegExp
                                    rv = new RegExp(obj);
                                    break;
                                // ...probably a few others
                                default:
                                    // Some other kind of object, deep-copy its
                                    // properties into a new object
                                    rv = Object.keys(obj).reduce(function(prev, key) {
                                        prev[key] = deepCopy(obj[key]);
                                        return prev;
                                    }, {});
                                    break;
                            }
                        }
                        break;
                    default:
                        // It's a primitive, copy via assignment
                        rv = obj;
                        break;
                }
                return rv;
            }

            function createNewRestriction(classSubClassOf, ontoPrefix) {                
                var tempRestrictionType = "", tempRestrictionFiller = "", tempRestrictionValue = "";
                if (classSubClassOf.Restriction.allValuesFrom !== undefined) {
                    tempRestrictionType = "only";
                    tempRestrictionFiller = classSubClassOf.Restriction.allValuesFrom["rdf:resource"];
                }
                if (classSubClassOf.Restriction.someValuesFrom !== undefined) {
                    tempRestrictionType = "some";
                    tempRestrictionFiller = classSubClassOf.Restriction.someValuesFrom["rdf:resource"];
                }
                if (classSubClassOf.Restriction.minQualifiedCardinality !== undefined) {
                    tempRestrictionType = "min";
                    tempRestrictionValue = '(' + classSubClassOf.Restriction.minQualifiedCardinality + ')';
                    tempRestrictionFiller = classSubClassOf.Restriction.onClass["rdf:resource"];
								}
								if (classSubClassOf.Restriction.maxQualifiedCardinality !== undefined) {
										tempRestrictionType = "max";
										tempRestrictionValue = '(' + classSubClassOf.Restriction.maxQualifiedCardinality + ')';
										tempRestrictionFiller = classSubClassOf.Restriction.onClass["rdf:resource"];
								}
                if (classSubClassOf.Restriction.qualifiedCardinality !== undefined) {
                    tempRestrictionType = "exact";
                    tempRestrictionValue = '( ' + classSubClassOf.Restriction.qualifiedCardinality + ')';
                    tempRestrictionFiller = classSubClassOf.Restriction.onClass["rdf:resource"];
                }
                if (classSubClassOf.Restriction.onProperty === undefined) {
                    console.log('paused here');
                }
                return {
                        "restrictedProperty": classSubClassOf.Restriction.onProperty["rdf:resource"].slice(ontoPrefix.length+1),
                        "restrictionType": tempRestrictionType,
                        "restrictionValue": tempRestrictionValue,
                        "restrictionFiller": tempRestrictionFiller,
                        "restrictionGroup": classSubClassOf.Restriction.inherited ? "inheritedRes" : "ownRes"
                    }; 
            }

            function ontoConcepts2ontoConceptDict(ontoConcepts) {
                var ontoConceptDict = {}, d3ConceptDict = {};
                ontoConcepts.forEach(function(concept) {
                    ontoConceptDict[concept.id] = jQuery.extend(true, {}, concept); 
                    d3ConceptDict[concept.id] = setNewD3ObjectFromConcept(concept);
                });
                return [ontoConceptDict, d3ConceptDict];
            }

            /**
             * [ontoConcepts2ontoConceptTree description]
             * This function creates ontoConceptTree from ontoConcepts, ontoClasses and ontoRootConceptId;
             * @param  {[type]} ontoConcepts      [description]
             * @param  {[type]} ontoRootConceptId [description]
             * @return {[type]}                   [description]
             */
            // function ontoConcepts2ontoConceptTree(ontoConceptTree, ontoConceptDict, count) {
            //     console.log('Running:........ at: ', ontoConceptTree.id);
            //     if ((ontoConceptTree.children.length > 0) && ($scope.count < 10)){
            //         ontoConceptTree.node = [];
            //         ontoConceptTree.children.forEach(function(childId) {
            //             ontoConceptTree.node.push(ontoConceptDict[childId]);
            //         });
            //         for (var j = 0; j < ontoConceptTree.node.length; j++) { 
            //             $scope.count += 1;
            //             ontoConcepts2ontoConceptTree(ontoConceptTree.node[j], ontoConceptDict, $scope.count);
            //             $scope.count += -1;
            //         }
            //     }
            // }  
            
            function ontoConcepts2ontoConceptTree(ontoConceptTree, ontoConceptDict) {
                console.log('Running:........ at: ', ontoConceptTree.id);
                if (ontoConceptTree.children.length > 0) {
                    ontoConceptTree.node = [];
                    ontoConceptTree.children.forEach(function(childId) {
                        ontoConceptTree.node.push(jQuery.extend(true, {},ontoConceptDict[childId]));
                    });
                    ontoConceptTree.node.forEach(function(concept) {
                        if (concept.children.length > 0) {
                            concept.node = [];
                            concept.children.forEach(function(childId) {
                                concept.node.push(jQuery.extend(true, {},ontoConceptDict[childId]));
                            })
                        }
                    });
                };
            }
            
            function ontoConcepts2relationGraph(ontoConcepts, ontoConceptIds) {
                var tempNodes = [], tempLinks = [];
                for (var i = 0; i < ontoConcepts.length; i++) {
                    tempNodes.push(ontoConcepts[i]);
                }
                var tempNodeIds = tempNodes.map(function(e){return e.id;});
                for (var j = 0; j < tempNodes.length; j++) {
                    for (var k = 0; k < tempNodes[j].objectRestrictions.length; k++) {
                        var restrictionFiller = tempNodes[j].objectRestrictions[k].restrictionFiller;
                        var idxRestrictionFiller = tempNodeIds.indexOf(restrictionFiller);
                        if (idxRestrictionFiller !== -1) {
                            tempLinks.push({
                                "source": tempNodes[j], 
                                "sourceId": tempNodes[j].id, 
                                "target": tempNodes[idxRestrictionFiller], 
                                "targetId": tempNodes[idxRestrictionFiller].id
                            });
                        }
                    }
                }
                return {"nodes": tempNodes, "links": tempLinks};
            }

            /**
             * CONCEPT TREE PANEL FUNCTIONS
             */
            
            $scope.getCordinateD3RelationGraph = function() {
                $scope.d3RelationNodeIds = $scope.d3RelationGraph.nodes.map(function(e) {return e.conceptId;});
                for (var i = 0; i < $scope.d3RelationGraph.links.length; i++) {
                    var link = $scope.d3RelationGraph.links[i];
                    var newLink = {
                        "sourceId":link.sourceId,
                        "source":$scope.d3RelationNodeIds.indexOf(link.sourceId),
                        "targetId":link.targetId,
                        "target":$scope.d3RelationNodeIds.indexOf(link.targetId),
                        "label":link.label
                    };
                    $scope.d3RelationGraph.links[i] = newLink;
                }
                writeFile("relation_graph.json", JSON.stringify($scope.d3RelationGraph));
            };

            $scope.clickConcept = function(item) {
                console.log('clicked concept in tree concept: ', item);
                if ($scope.currentSelectedConcept && $scope.currentSelectedConcept.selected) {
                    $scope.currentSelectedConcept.selected = undefined;
                }
                item.selected = 'selected';
								$scope.currentSelectedConcept = item;
								$scope.d3RelationGraph = $scope.d3RelationGraphDict[item.id];
								console.log('current d3RelationGraph: ', $scope.d3RelationGraph);
								// $scope.d3ConceptRelation = getD3ConceptRelationByConceptId($scope.d3ConceptRelations, $scope.clickedQueryObject.conceptId);
								// //$scope.clickedQueryObjectLeafClassMapping = getOntoConceptLeafClassMapping($scope.clickedQueryObject);
								displayD3RelationGraph($scope.d3RelationGraph);
            };

            // $scope.dblClickConcept = function(item) {
            //     console.log("double click concept: ", item);
            //     if (item.mappedClasses === undefined) {
            //         $window.alert("This concept is temporary unqueryable. Please choose another concept.");
            //     } else {
            //         if (item.mappedClasses.length === 0) {
            //             $window.alert("This concept is temporary unqueryable. Please choose another concept."); 
            //         }else{
            //             $scope.rootQueryObject = setNewD3QueryObjectFromConcept(item);
            //             console.log($scope.rootQueryObject);
            //             $scope.routeRelatedObjects = [[]];
            //             $scope.currentSelectedConceptId = "";
            //             $scope.currentRouteRelatedObject = $scope.routeRelatedObjects[0];
            //             $scope.d3QueryGraph = queryConcepts2d3QueryGraph();
            //             displayD3QueryGraph($scope.d3QueryGraph);
            //             $scope.clickedQueryObject = undefined;
            //         }  
            //     }
            // };
            $scope.dblClickConcept = function(item) {
                console.log('double click concept: ', item);
                $scope.rootQueryObject = setNewD3ObjectFromConcept(item);
                $scope.routeRelatedObjects = [[]];
                $scope.currentSelectedConceptId = "";
                $scope.currentRouteRelatedObject = $scope.routeRelatedObjects[0];
                $scope.d3QueryGraph = queryConcepts2d3QueryGraph();
                displayD3QueryGraph($scope.d3QueryGraph);
                $scope.clickedQueryObject = undefined;
            };

            $scope.clickConceptIcon = function(item, $event) {
                if($event.shiftKey){
                    console.log('shilfkey click on concept icon detected');
                } else {
                    console.log('ontoConceptDict', $scope.ontoConceptDict);
                    console.log('icon concept clicked: ');
                    if ((item.children.length > 0) && ((item.node === undefined) || (item.node.length == 0))) {
                        item.node = [];
                        item.children.forEach(function(childId) {
                            var copiedConcept = jQuery.extend(true, {}, $scope.ontoConceptDict[childId]);
                            copiedConcept.showed = true;
                            copiedConcept.iconClicked = false;
                            item.node.push(copiedConcept);
                        });
                    }
                    if (item.iconClicked) {
                        item.showed = false;
                        item.iconClicked = false;
                    } else {
                        item.showed = true;
                        item.iconClicked = true;
                    }
                    console.log('concept: ', item);
                }
            }

            /**
             * [setNewD3QueyryObjectFromConcept description]
             * This function creates a d3 rootQueryObject (rootQueryObject or 
             * relatedQueryObject) from corresponding concept. 
             * @param {[type]} concept [description]
             */

            function setNewD3QueryObjectFromConcept(concept) {
                var color = d3.scale.category20();
                var x = (document.getElementById("queryGraph") !== null) ? Math.floor(Math.random() * document.getElementById("queryGraph").clientWidth) : Math.floor(Math.random() * 800);
                var y = (document.getElementById("queryGraph") !== null) ? Math.floor(Math.random() * document.getElementById("queryGraph").clientHeight) : Math.floor(Math.random() * 500);
                
                return {
                    "conceptId": concept.id,
                    "objectId": concept.id,
                    "objectName": concept.name,
                    "objectDisplayName": concept.name,
                    // "tcClassAttrs": [], //findTcClassAttrsByConceptId(concept.id),
                    // "mappedTcClassIds": (concept.mappedTcClassIds !== undefined) ? concept.mappedTcClassIds : [],
                    // "mappedTcClassId": (concept.mappedTcClassId !== undefined) ? concept.mappedTcClassId : "", //findMappedTcClassIdByConceptId(concept.id),
                    // "mappedDmObjectType": (concept.mappedDmObjectType !== undefined) ? concept.mappedDmObjectType : "", //findMappedDmObjectTypeByConceptId(concept.id),
                    // "mappedClasses": (concept.mappedClasses !== undefined) ? concept.mappedClasses : [],
                    "objectRestrictions": concept.objectRestrictions,
                    "x":x,"y":y,"currentPosition":{"x":x,"y":y},
                    "color": color(2),
                    // "group": concept.group,
                    "opacity": "1",
                    "fillOpacity": "1",
                    "r": "12",
                    "fixed": true
                };                
            }

            // function setNewD3QueryObjectFromConcept(concept) {
            //     var objectAttrs = [],
            //         tcClassAttrs = [];
            //     var mappedDmObjectType = "",
            //         mappedTcClassId = "";
            //     var color = d3.scale.category20();
            //     var x = (document.getElementById("queryGraph") !== null) ? Math.floor(Math.random() * document.getElementById("queryGraph").clientWidth) : Math.floor(Math.random() * 800);
            //     var y = (document.getElementById("queryGraph") !== null) ? Math.floor(Math.random() * document.getElementById("queryGraph").clientHeight) : Math.floor(Math.random() * 500);

            //     if (concept.selectedClass !== undefined) {
            //         if (concept.selectedClass.dmObject.attribute.length > 0) {
            //             for (var i = 0; i < concept.selectedClass.dmObject.attribute.length; i++) {
            //                 var attr = concept.selectedClass.dmObject.attribute[i];
            //                 objectAttrs.push({
            //                     "attrName": attr.name,
            //                     "attrValue": "",
            //                     "attrOrigin": attr.origin,
            //                     "attrTCName": attr.tcName,
            //                     "attrOperator": "",
            //                     "checked": false,
            //                     "objectName": concept.selectedClass.dmObject.objectType
            //                 });
            //             }
            //         }

            //         if ((concept.selectedClass.attribute !== undefined) && (concept.selectedClass.attribute.length > 0)) {
            //             for (var i = 0; i < concept.selectedClass.attribute.length; i++) {
            //                 var attr = concept.selectedClass.attribute[i];
            //                 tcClassAttrs.push({
            //                     "attrName": attr.name,
            //                     "attrId": attr.id,
            //                     "attrOperator": "",
            //                     "attrValue": undefined,
            //                     "attrParentId": concept.selectedClass.id,
            //                     "attrParentName": concept.selectedClass.name,
            //                     "objectName": concept.name
            //                 });
            //             }
            //         }
            //     }
            //    	objectAttrs.push({"attrName":"name","attrValue":"","attrOrigin":"default","attrTCName":"object_name","attrOperator":"","checked":false,"objectName":concept.name});
            //     objectAttrs.push({"attrName":"id","attrValue":"","attrOrigin":"default","attrTCName":"item_id","attrOperator":"","checked":false,"objectName":concept.name});
            //     var newObject = {
            //         "conceptId": concept.id,
            //         "objectId": concept.id,
            //         "objectName": concept.name,
            //         "objectDisplayName": concept.displayName,
            //         "objectAttrs": objectAttrs,
            //         "tcClassAttrs": [], //findTcClassAttrsByConceptId(concept.id),
            //         "mappedTcClassIds": (concept.mappedTcClassIds !== undefined) ? concept.mappedTcClassIds : [],
            //         "mappedTcClassId": (concept.mappedTcClassId !== undefined) ? concept.mappedTcClassId : "", //findMappedTcClassIdByConceptId(concept.id),
            //         "mappedDmObjectType": (concept.mappedDmObjectType !== undefined) ? concept.mappedDmObjectType : "", //findMappedDmObjectTypeByConceptId(concept.id),
            //         "mappedClasses": (concept.mappedClasses !== undefined) ? concept.mappedClasses : [],
            //      	"objectRestrictions": concept.objectRestrictions,
            //         "x":x,"y":y,"currentPosition":{"x":x,"y":y},
            //         "color": color(concept.group),
            //         "group": concept.group,
            //         "opacity": "1",
            //         "fillOpacity": "1",
            //         "r": "12",
            //         "fixed": true
            //     };
            //     return newObject;
            // }
		
            /**
             * [setNewD3QueyryObjectFromConcept description]
             * This function creates a d3 rootQueryObject (rootQueryObject or 
             * relatedQueryObject) from corresponding concept. 
             * @param {[type]} concept [description]
             */
            function setNewD3QueryObjectFromRelationGraphNode(concept) {
                var objectAttrs = [],
                    tcClassAttrs = [];
                var mappedDmObjectType = "",
                    mappedTcClassId = "";
                var color = d3.scale.category20();
                var x = (document.getElementById("queryGraph") !== null) ? Math.floor(Math.random() * document.getElementById("queryGraph").clientWidth) : Math.floor(Math.random() * 800);
                var y = (document.getElementById("queryGraph") !== null) ? Math.floor(Math.random() * document.getElementById("queryGraph").clientHeight) : Math.floor(Math.random() * 500);

                if (concept.selectedClass !== undefined) {
                    if (concept.selectedClass.dmObject.attribute.length > 0) {
                        for (var i = 0; i < concept.selectedClass.dmObject.attribute.length; i++) {
                            var attr = concept.selectedClass.dmObject.attribute[i];
                            objectAttrs.push({
                                "attrName": attr.name,
                                "attrValue": "",
                                "attrOrigin": attr.origin,
                                "attrTCName": attr.tcName,
                                "attrOperator": "",
                                "checked": false,
                                "objectName": concept.selectedClass.dmObject.objectType
                            });
                        }
                    }

                    if ((concept.selectedClass.attribute !== undefined) && (concept.selectedClass.attribute.length > 0)) {
                        for (var i = 0; i < concept.selectedClass.attribute.length; i++) {
                            var attr = concept.selectedClass.attribute[i];
                            tcClassAttrs.push({
                                "attrName": attr.name,
                                "attrId": attr.id,
                                "attrOperator": "",
                                "attrValue": undefined,
                                "attrParentId": concept.selectedClass.id,
                                "attrParentName": concept.selectedClass.name,
                                "objectName": concept.name
                            });
                        }
                    }
                }
               	objectAttrs.push({"attrName":"name","attrValue":"","attrOrigin":"default","attrTCName":"object_name","attrOperator":"","checked":false,"objectName":concept.name});
                objectAttrs.push({"attrName":"id","attrValue":"","attrOrigin":"default","attrTCName":"item_id","attrOperator":"","checked":false,"objectName":concept.name});
                var newObject = {
                    "conceptId": concept.id,
                    "objectId": concept.id,
                    "objectName": concept.name,
                    "objectDisplayName": concept.displayName,
                    "objectAttrs": objectAttrs,
                    "tcClassAttrs": [], //findTcClassAttrsByConceptId(concept.id),
                    "mappedTcClassIds": (concept.mappedTcClassIds !== undefined) ? concept.mappedTcClassIds : [],
                    "mappedTcClassId": (concept.mappedTcClassId !== undefined) ? concept.mappedTcClassId : "", //findMappedTcClassIdByConceptId(concept.id),
                    "mappedDmObjectType": (concept.mappedDmObjectType !== undefined) ? concept.mappedDmObjectType : "", //findMappedDmObjectTypeByConceptId(concept.id),
                    "mappedClasses": (concept.mappedClasses !== undefined) ? concept.mappedClasses : [],
                 	"objectRestrictions": concept.objectRestrictions,
                    "x":x,"y":y,"currentPosition":{"x":x,"y":y},
                    "color": color(concept.group),
                    "group": concept.group,
                    "opacity": "1",
                    "fillOpacity": "1",
                    "r": "12",
                    "fixed": true
                };
                return newObject;
            }

        /**
         * QUERY GRAPH PANEL
         */
            
            /**
             * [jsonAllResult2d3AllResultGraph description]
             * This function converts al result (json) to d3AllResultGraph
             * @param  {[type]} jsonAllResult [description]
             * @return {[type]}               [description]
             */
            function jsonAllResult2d3AllResultGraph(jsonAllResult) {
                var foundObjects = jsonAllResult.object;
                var tempD3Nodes = []; 
                var tempD3Links = [];
                var foundObjectD3Index = 0;
                for (var i = 0; i < foundObjects.length; i++) {
                    var foundObject = foundObjects[i];
                    tempD3Nodes.push(setNewD3NodeFromFoundObject(foundObject));
                    if (foundObject.relatedObject !== undefined) {
                        var path2rootQueryObjects = [];
                        for (var j = 0; j < foundObject.relatedObject.length; j++) {
                            var tempPath2rootQueryObject = foundObject.relatedObject[j].path2rootQueryObject;
                            var tempPath2rootQueryObjects = path2rootQueryObjects.map(function(e) {return e.path2rootQueryObject;});
                            var idxTempPath2rootQueryObject = tempPath2rootQueryObjects.indexOf(tempPath2rootQueryObject);
                            if (idxTempPath2rootQueryObject == -1) {
                                path2rootQueryObjects.push({
                                    "path2rootQueryObject": tempPath2rootQueryObject,
                                    "relatedObject": [foundObject.relatedObject[j]]
                                });
                            } else {
                                path2rootQueryObjects[idxTempPath2rootQueryObject].relatedObject.push(foundObject.relatedObject[j]);
                            }
                        }
                        for (var k = 0; k < path2rootQueryObjects.length; k++) {
                            var tempPath2rootQueryObject = path2rootQueryObjects[k];
                            var tempPath = tempPath2rootQueryObject.path2rootQueryObject;
                            var tempPathArray = tempPath.split("/");
                            for (var l = 2; l < tempPathArray.length - 1; l = l + 2) {
                                tempD3Nodes.push(setNewD3NodeFromObtainedObjectType(tempPathArray[l]));
                                if (l === 0) {
                                    tempD3Links.push({
                                        "source": foundObjectD3Index,
                                        "target": tempD3Nodes.length - 1
                                    });
                                } else {
                                    tempD3Links.push({
                                        "source": tempD3Nodes.length - 2,
                                        "target": tempD3Nodes.length - 1
                                    });
                                }
                            }
                            var lastObtainedObjectTypeD3Index = tempD3Nodes.length - 1;
                            for (var m = 0; m < tempPath2rootQueryObject.relatedObject.length; m++) {
                                tempD3Nodes.push(setNewD3NodeFromFoundObject(tempPath2rootQueryObject.relatedObject[m]));
                                tempD3Links.push({
                                    "source": lastObtainedObjectTypeD3Index,
                                    "target": tempD3Nodes.length - 1
                                });
                            }
                        }
                    }
                    foundObjectD3Index = tempD3Nodes.length;
                }
                return {
                    "nodes": tempD3Nodes,
                    "links": tempD3Links
                };
            }

            function setNewD3NodeFromObtainedObjectType(obtainedObjectType) {
                var tempNewD3Node = {
                    "conceptName":"",
                    "KTCId":"",
                    "objectid":"",
                    "objectName":obtainedObjectType,
                    "mappedDmObjectType":obtainedObjectType
                };
                return tempNewD3Node;
            }

            function setNewD3NodeFromFoundObject(foundObject) {
                var tempNewD3Node = {};
                tempNewD3Node.conceptName = foundObject.conceptName;
                tempNewD3Node.KTCId = foundObject.KTCId;
                tempNewD3Node.objectId = foundObject.objectId;
                tempNewD3Node.objectName = foundObject.objectName;
                tempNewD3Node.mappedDmObjectType = (foundObject.objectType === undefined) ? "" : foundObject.objectType;
                return tempNewD3Node;
            }

            $scope.loadSavedQuery = function($fileContent){
                var queryObjects = JSON.parse($fileContent),
                    lengthRoutes = queryObjects.length;
                $scope.rootQueryObject = queryObjects[lengthRoutes-1][0];
                queryObjects.splice(lengthRoutes-1,1);
                $scope.routeRelatedObjects = queryObjects;
                $scope.d3QueryGraph = queryConcepts2d3QueryGraph();
                displayD3QueryGraph($scope.d3QueryGraph);
                console.log($scope.routeRelatedObjects);
            };

        /**
         * DATA PANEL
         */
            $scope.clickMappedLeafClass2 = function(leafClass) {
                leafClass.isOpen = !leafClass.isOpen;
                if ($scope.currentSelectedLeafClass !== undefined) {
                    if ($scope.currentSelectedLeafClass.classId !== leafClass.classId) {
                        $scope.currentSelectedLeafClass.isOpen = !$scope.currentSelectedLeafClass.isOpen;
                        delete $scope.currentSelectedLeafClass.selected;
                        leafClass.selected = "selected"; 
                        if ($scope.currentSelectedLeafClass.tcClassAttrs !== undefined) {
                            for (var i = 0; i < $scope.currentSelectedLeafClass.tcClassAttrs.length; i++) {
                                $scope.currentSelectedLeafClass.tcClassAttrs[i].attrOperator = "";
                                $scope.currentSelectedLeafClass.tcClassAttrs[i].attrValue = "";
                            }
                        }
                        $scope.currentSelectedLeafClass = leafClass;   
                    }else{
                        if (leafClass.selected === undefined){
                            leafClass.selected = "selected";
                        }else {
                            delete leafClass.selected;
                            delete $scope.currentSelectedLeafClass;
                        }
                    }
                }else{
                    leafClass.selected = "selected";
                    $scope.currentSelectedLeafClass = leafClass;    
                }
                if (leafClass.selected == "selected") {
                    $scope.clickedQueryObject.mappedTcClassId = leafClass.classId;
                    $scope.clickedQueryObject.tcClassAttrs = leafClass.tcClassAttrs;
                    $scope.clickedQueryObject.mappedDmObjectType = leafClass.mappedDmObjectType;
                }
            };

            $scope.clickMappedLeafClass = function(leafClass) {
                leafClass.isOpen = !leafClass.isOpen;
                if ($scope.clickedQueryObject.currentSelectedLeafClass !== undefined) {
                    if ($scope.clickedQueryObject.currentSelectedLeafClass.classId !== leafClass.classId) {
                        $scope.clickedQueryObject.currentSelectedLeafClass.isOpen = !$scope.clickedQueryObject.currentSelectedLeafClass.isOpen;
                        delete $scope.clickedQueryObject.currentSelectedLeafClass.selected;
                        leafClass.selected = "selected";
                        if ($scope.clickedQueryObject.currentSelectedLeafClass.tcClassAttrs !== undefined) {
                            for (var i = 0; i < $scope.clickedQueryObject.currentSelectedLeafClass.tcClassAttrs.length; i++) {
                                $scope.clickedQueryObject.currentSelectedLeafClass.tcClassAttrs[i].attrOperator = "";
                                $scope.clickedQueryObject.currentSelectedLeafClass.tcClassAttrs[i].attrValue = "";
                            }
                        }
                        $scope.clickedQueryObject.currentSelectedLeafClass = leafClass;
                    }else{
                        if (leafClass.selected === undefined) {
                            leafClass.selected = "selected";
                        }else{
                            delete leafClass.selected;
                            delete $scope.clickedQueryObject.currentSelectedLeafClass;
                            if (leafClass.tcClassAttrs !== undefined) {
                                for (var i = 0; i < leafClass.tcClassAttrs.length; i++) {
                                    leafClass.tcClassAttrs[i].attrOperator = "";
                                    leafClass.tcClassAttrs[i].attrValue = "";
                                }
                            }
                            $scope.clickedQueryObject.mappedTcClassId = "";
                        }
                    }
                }else{
                    leafClass.selected = "selected";
                    $scope.clickedQueryObject.currentSelectedLeafClass = leafClass;
                }
                if (leafClass.selected == "selected") {
                    console.log(leafClass);
                    $scope.clickedQueryObject.mappedTcClassId = leafClass.classId;
                    $scope.clickedQueryObject.tcClassAttrs = leafClass.tcClassAttrs;
                    $scope.clickedQueryObject.mappedDmObjectType = leafClass.mappedDmObjectType;
                }
            };

            $scope.clickAttrClickedQueryObject = function(attr, $event) {
                if($event.shiftKey){
                    var copiedTcClassAttr = jQuery.extend(true, {}, attr);
                    leafClass.tcClassAttrs.splice($index, 0, copiedTcClassAttr);
                } else {
                    if ($scope.currentSelectedAttrClickedQueryObject !== undefined){
                        if ($scope.currentSelectedAttrClickedQueryObject.attrId !== undefined) {
                            if ($scope.currentSelectedAttrClickedQueryObject.attrId !== attr.attrId){
                                if ($scope.currentSelectedAttrClickedQueryObject.attrValue === "") {
                                    $scope.currentSelectedAttrClickedQueryObject.attrOperator = "";
                                }                
                            }
                            $scope.currentSelectedAttrClickedQueryObject = attr;
                        }else{
                            if ($scope.currentSelectedAttrClickedQueryObject.attrName !== attr.attrName){
                                if ($scope.currentSelectedAttrClickedQueryObject.attrValue === "") {
                                    $scope.currentSelectedAttrClickedQueryObject.attrOperator = "";
                                }                
                            } 
                            $scope.currentSelectedAttrClickedQueryObject = attr;
                        }
                    }else{
                        $scope.currentSelectedAttrClickedQueryObject = attr;
                    }
                }
            };  

            $scope.dblClickAttrClickedQueryObject = function(attr) {
                attr.attrOperator = "";
                attr.attrValue = "";
            };

            $scope.setAttrOperator4CurrentSelectedAttr = function(operator) {
                $scope.currentSelectedAttrClickedQueryObject.attrOperator = operator;
            };

            $scope.duplicateCurrentSelectedTcClassAttr = function(leafClass, attr) {
                leafClass.push(attr);
            };

        /**
         * D3 GRAPHS
         */

            function setD3ConceptRelations(d3RelationGraph) {
                var d3ConceptRelations = [];
                for (var i = 0; i < d3RelationGraph.nodes.length; i++) {
                    var tempNode = d3RelationGraph.nodes[i];
                    d3ConceptRelations.push({ "conceptId": tempNode.conceptId, "objectName": tempNode.objectName, "d3ConceptRelation": setD3ConceptRelation(tempNode, d3RelationGraph.links) });
                }

                function setD3ConceptRelation(relationGraphNode, relationGraphlinks) {
                    var d3ConceptRelation = { "nodes": [], "links": [] };
                    d3ConceptRelation.nodes.push(relationGraphNode);
                    for (var i = 0; i < relationGraphlinks.length; i++) {
                        if (relationGraphlinks[i].sourceId == relationGraphNode.conceptId) {
                            d3ConceptRelation.nodes.push(relationGraphlinks[i].target);
                            d3ConceptRelation.links.push({
                                "sourceId": relationGraphlinks[i].sourceId,
                                "source": 0,
                                "targetId": relationGraphlinks[i].targetId,
                                "target": d3ConceptRelation.nodes.length - 1
                            });
                        }
                        if (relationGraphlinks[i].targetId == relationGraphNode.conceptId) {
                            d3ConceptRelation.nodes.push(relationGraphlinks[i].source);
                            d3ConceptRelation.links.push({
                                "sourceId": relationGraphlinks[i].sourceId,
                                "source": d3ConceptRelation.nodes.length - 1,
                                "targetId": relationGraphlinks[i].targetId,
                                "target": 0
                            });
                        }
                    }
                    return d3ConceptRelation;
                }
                return d3ConceptRelations;
            }

            function displayD3RelationGraph(d3RelationGraph) {
                $scope.highlightedRelationGraphConceptIds = [];
                d3.select("#d3RelationGraph").select("#idD3RelationGraph").remove();
                console.log("D3 Relation Graph starts");
                var width = (document.getElementById("relationGraph") !== null) ? document.getElementById("relationGraph").clientWidth : 1200,
                    height = (document.getElementById("relationGraph") !== null) ? document.getElementById("relationGraph").clientHeight : 500;

                var vis = d3.select("#d3RelationGraph")
                    .classed("svg-container",true).append("svg:svg").attr("preserveAspectRatio","xMinYMin meet").attr("viewBox","-50 -70 800 500").classed("svg-content-responsive",true)
                    .attr("id","idD3RelationGraph").attr("width",width).attr("height",height).attr("pointer-events","all")
                    .call(d3.behavior.zoom().on("zoom",redraw)).on("dblclick.zoom",null).append('svg:g');

                function redraw() {
                    vis.attr("transform",
                        "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
                }
                var color = d3.scale.category20();
                var force=d3.layout.force().charge(-300).size([width,height])
                    .nodes(d3RelationGraph.nodes)
                    .links(d3RelationGraph.links).linkDistance(20).start();

                var link=vis.selectAll(".link").data(d3RelationGraph.links).enter().append("g").attr("class","link").append("line").style("marker-end","url(#arrowhead)").style("stroke","#6E6E6E").style("stroke-width","1.5");
                var linkText=vis.selectAll(".link").append("text").attr("fill","blue").attr("hidden",true).style("font","normal 14px Arial").attr("dy",".35em").style("stroke-opacity","1").text(function(d){return d.label;});

                var linkedByIndex = {};
                d3RelationGraph.links.forEach(function(d) {
                    linkedByIndex[d.source.index + "," + d.target.index] = 1;
                });

                function isConnected(a,b){return linkedByIndex[a.index+","+b.index]||linkedByIndex[b.index+","+a.index]||a.index==b.index;}

                function dblClickRelationGraphConcept(d) {
                    console.log('dblClickRelationGraphConcept ', d);
                    console.log('index in nodes', $scope.d3RelationGraph.nodes.indexOf(d));
                    if ($scope.d3RelationGraph.nodes.indexOf(d) == 0)  // dblClickedNode == currentSelectedNode
                        $window.alert("Please choose another node that is different with the currently selected node in the query graph.");
                    else 
                        if ($scope.clickedQueryObject === undefined)
                            $window.alert("Please choose a node in query graph before.");
                        else {
                            var newObject = jQuery.extend({}, true, $scope.d3ConceptDict[d.conceptId]);
                            // var foundConcept = findConceptByConceptId($scope.listConcept, d.conceptId);
                            if (newObject == {}) {$window.alert("Error: Cannot find corresponding concept");} else {                            
                                if ($scope.currentRouteRelatedObject !== undefined) {
                                    var lengthRoute = $scope.currentRouteRelatedObject.length;
                                    //  var addable = (lengthRoute == 0) ? checkAddableVaqueroConcept2QueryObjects($scope.rootQueryObject, newObject) : checkAddableVaqueroConcept2QueryObjects($scope.clickedQueryObject, newObject);
                                    //  var addable = (lengthRoute == 0) ? checkAddable2QueryObjects($scope.listPath, $scope.rootQueryObject, newObject) : checkAddable2QueryObjects($scope.listPath, $scope.clickedQueryObject, newObject);
                                    //  console.log(addable);
                                    var idx = $scope.clickedQueryObject.d3Id;
                                    if (idx == 10000) {
                                        if ($scope.routeRelatedObjects[$scope.routeRelatedObjects.length - 1].length !== 0) {
                                            $scope.routeRelatedObjects.push([]);
                                            $scope.currentRouteRelatedObject = $scope.routeRelatedObjects[$scope.routeRelatedObjects.length - 1];
                                        }
                                    }else{
                                        var objectIndex = idx % 100,
                                            routeIndex = (idx - objectIndex) / 100;
                                        if ($scope.routeRelatedObjects[routeIndex].length > objectIndex + 1) {
                                            $scope.routeRelatedObjects.splice(routeIndex + 1, 0, $scope.routeRelatedObjects[routeIndex].slice(0, objectIndex + 1));
                                            $scope.currentRouteRelatedObject = $scope.routeRelatedObjects[routeIndex + 1];
                                        }
                                    }
                                    
                                    var count = countObjectInQueryConceptIds($scope.queryConceptIds, newObject.objectId);
                                    if (count > 0) {
                                        newObject.x = newObject.x + 20 * count;
                                        newObject.y = newObject.y + 20 * count;
                                        newObject.currentPosition.x = newObject.currentPosition.x + 20 * count;
                                        newObject.currentPosition.y = newObject.currentPosition.y + 20 * count;
                                    }

                                    if ((document.getElementById("queryGraph") !== null) && (document.getElementById("queryGraph").clientWidth < newObject.x)) {
                                        newObject.x = Math.floor(Math.random() * document.getElementById("queryGraph").clientWidth);
                                        newObject.currentPosition.x = Math.floor(Math.random() * document.getElementById("queryGraph").clientWidth);
                                    }
                                    if ((document.getElementById("queryGraph") !== null) && (document.getElementById("queryGraph").clientHeight < newObject.y)) {
                                        newObject.y = Math.floor(Math.random() * document.getElementById("queryGraph").clientHeight);
                                        newObject.currentPosition.y = Math.floor(Math.random() * document.getElementById("queryGraph").clientHeight);
                                    }
                                    newObject.linkLabel = d.linkLabel;                                
                                    newObject.direction = d.direction;
                                    newObject.objectAttrs = d.objectAttrs;                                    
                                    newObject.duplicatedIndex = setDuplicatedIndex($scope.rootQueryObject, $scope.routeRelatedObjects, newObject);
                                    if (newObject.duplicatedIndex !== 0) newObject.objectDisplayName = newObject.objectDisplayName + newObject.duplicatedIndex;
                                    $scope.queryConceptIds.push(newObject.objectId);                                    
                                    $scope.currentRouteRelatedObject.push(deepCopy(newObject));
                                    updateD3QueryGraph();
                                }else{
                                    $window.alert("Click in an related object ligne to make it current ligne.");
                                }
                            }
                        }
                }

                function setDuplicatedIndex(rootQueryObject, routeRelatedObjects, newObject) {
                    var maxIndex = 0;
                    if (rootQueryObject.objectName == newObject.objectName) {                        
                        maxIndex = (rootQueryObject.duplicatedIndex >= maxIndex) ? maxIndex +1 : maxIndex;
                    }
                    routeRelatedObjects.forEach(function(routeRelatedObject) {
                        routeRelatedObject.forEach(function(relatedObject) {
                            if (relatedObject.objectName == newObject.objectName) {
                                maxIndex = (relatedObject.duplicatedIndex >= maxIndex) ? maxIndex + 1 : maxIndex;
                            }
                        })
                    })
                    return (maxIndex == 0) ? 0 : maxIndex;
                }

                function countObjectInQueryConceptIds(queryConceptIds, objectId) {
                    var count = 0;
                    for (var i = 0; i < queryConceptIds.length; i++) {
                        if (queryConceptIds[i] == objectId) count = count + 1;
                    }
                    return count;
                }

                var drag=force.drag().on("dragstart",function(d){d3.event.sourceEvent.stopPropagation();});
                var node = vis.selectAll(".node")
                    .data(d3RelationGraph.nodes).enter().append("g").attr("class","node").attr("name",function(d){if(d.objectDisplayName!==undefined){return d.objectDisplayName;}else{return d.objectName;}}).attr("id",function(d){return d.conceptId;})
                    .call(drag)
                    .on(('click'),function(d){
                        console.log('clicked query object: ', d);
                        console.log('d3QueryGraph: ', $scope.d3RelationGraph);
                        if (d3.event.shiftKey) { // insert selected node to the query graph and make it be the root query object
                            if ($scope.clickedQueryObject.d3Id !== 10000) {
                                $window.alert("Please click on the current root query object.");
                            } else {
                                if ($scope.highlightedRelationGraphConceptIds.indexOf(d.conceptId) == -1) {
                                    $window.alert("Please click on highlighted concept");
                                } else {
                                    if ((d.unqueryable !== undefined) && (d.unqueryable)) {
                                        $window.alert("Sorry, you cannot currently query this concept.");
                                    } else {
                                        var foundConcept = findConceptByConceptId($scope.listConcept, d.conceptId);
                                        if (foundConcept == {}) {
                                            $window.alert("Error: Cannot find corresponding concept");
                                        } else {
                                            var newObject = setNewD3QueryObjectFromConcept(foundConcept);
                                            var count = countObjectInQueryConceptIds($scope.queryConceptIds, newObject.objectId);
                                            if (count > 0) {
                                                newObject.x = newObject.x + 20 * count;
                                                newObject.y = newObject.y + 20 * count;
                                                newObject.currentPosition.x = newObject.currentPosition.x + 20 * count;
                                                newObject.currentPosition.y = newObject.currentPosition.y + 20 * count;
                                            }

                                            if ((document.getElementById("queryGraph") !== null) && (document.getElementById("queryGraph").clientWidth < newObject.x)) {
                                                newObject.x = Math.floor(Math.random() * document.getElementById("queryGraph").clientWidth);
                                                newObject.currentPosition.x = Math.floor(Math.random() * document.getElementById("queryGraph").clientWidth);
                                            }
                                            if ((document.getElementById("queryGraph") !== null) && (document.getElementById("queryGraph").clientHeight < newObject.y)) {
                                                newObject.y = Math.floor(Math.random() * document.getElementById("queryGraph").clientHeight);
                                                newObject.currentPosition.y = Math.floor(Math.random() * document.getElementById("queryGraph").clientHeight);
                                            }

                                            // add the old root query object into routeRelatedObjects
                                            var copiedRootQueryObject = deepCopy(newObject);
                                            for (var i = 0; i < $scope.routeRelatedObjects.length; i++) {
                                                $scope.routeRelatedObjects[i].splice(0, 0 ,copiedRootQueryObject);
                                            }

                                            $scope.rootQueryObject = newObject; // Make newObject be rootQueryObject
                                            
                                            console.log($scope.rootQueryObject);
                                            $scope.currentSelectedConceptId = "";
                                            $scope.currentRouteRelatedObject = $scope.routeRelatedObjects[0];
                                            $scope.d3QueryGraph = queryConcepts2d3QueryGraph();
                                            displayD3QueryGraph($scope.d3QueryGraph);
                                            $scope.clickedQueryObject = undefined;
                                        }
                                    }
                                }
                            }
                        }
                        console.log(d);
                    })
                    .on(('dblclick'),function(d){
                            console.log("dblclick query Object");
                            var ctrlKey=d3.event.ctrlKey;
                            dblClickRelationGraphConcept(d);
                        })
                    // display the adjacent link labels on mouseenter
                    .on('mouseenter', function (d) {
                        console.log('mouseenter');
                        console.log('d', d);
                        console.log('d.links', d.links);
                        displayLinkText(d);
                            // updateLinkLabels(d.links);
                    })
                    // remove the adjacent link labels on mouseout
                    .on('mouseout', function (d) {
                        console.log('mouseout');
                        console.log('d.links', d.links);
                        undisplayLinkText(d);
                    });

                function displayLinkText(mouseenteredConcept) {
                    $scope.highlightedRelationGraphConceptIds.push(mouseenteredConcept.conceptId);
                    console.log('mouseenteredConcept :', mouseenteredConcept);
                    var linkedByIndex = {};
                    d3RelationGraph.links.forEach(function(d) {
                        linkedByIndex[d.source.index + ',' + d.target.index] = 1;
                    })

                    function isConnected(a, b) {
                        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
                    }

                    var relationGraphNodes = vis.selectAll(".node").select("circle").attr("r", function(d){return d.r}).style("fill",function(d){
                        switch(d.group) {
                            case 'inheritedRes':
                                return color(1);
                                break;                          
                            case 'ownRes':
                                return color(2);
                                break;
                            case 'subClassRes':
                                return color(3);
                                break;
                            default:
                                return color(4);
                                break;
                        }
                    });                    
                    
                    var relationGraphNodes = vis.selectAll(".node").filter(function(d) { return (d.linkLabel == mouseenteredConcept.linkLabel) && (d.conceptId == mouseenteredConcept.conceptId) }).select("circle").attr("r", 20).each(function(d) {
                        var opacity = 0.1;
                        var node = d3.select("#d3RelationGraph").selectAll(".node").style("stroke-opacity", function(o) {
                            var thisOpacity = isConnected(d, o) ? 1 : opacity;
                            if (isConnected(d, o))
                                $scope.highlightedRelationGraphConceptIds.push(o.conceptId);
                            this.setAttribute('fill-opacity', thisOpacity);
                            return thisOpacity;
                        });

                        var link = vis.selectAll(".link").style("stroke-opacity", function(o) {
                            return o.source === d || o.target === d ? 1 : opacity;
                        });
    
                        link = vis.selectAll(".link").select("text").attr('hidden', function(o) {
                            return o.source === d || o.target === d ? null : true;
                        });
                        // link = d3.select("#d3RelationGraph").selectAll(".link").select("text").style("stroke-opacity", function(o) {
                        //     return o.source === d || o.target === d ? opacity : 1;
                        // });
                    });
                }

                function undisplayLinkText(mouseenteredConcept) {
                    var relationGraphNodes = vis.selectAll(".node").select("circle").attr("r", function(d){return d.r}).style("fill", function(d){
                        switch (d.group) {
                            case 'inheritedRes':
                                return color(1);
                                break;                          
                            case 'ownRes':
                                return color(2);
                                break;
                            case 'subClassRes':
                                return color(3);
                                break;
                            default:
                                return color(4);
                                break;
                        }
                    }).each(function(d) {
                        var node = d3.select("#d3RelationGraph").selectAll(".node").style("stroke-opacity", function(o) {
                            var thisOpacity = 1
                            this.setAttribute('fill-opacity', thisOpacity);
                            return thisOpacity;
                        });
                    })

                    var link = vis.selectAll(".link").style("stroke-opacity", 1);
                    link = vis.selectAll(".link").select("text").attr('hidden', true);
                }

                node.append("circle").attr("class","node").attr("r",function(d){return d.r;})
                .style("fill",function(d){
                    var relationGraphNodes = vis.selectAll(".node").select("circle").attr("r", d.r).style("fill",function(d){
                        switch(d.group) {
                            case 'inheritedRes':
                                return color(1);
                                break;                          
                            case 'ownRes':
                                return color(2);
                                break;
                            case 'subClassRes':
                                return color(3);
                                break;
                            default:
                                return color(4);
                                break;
                        }
                    });  
                })
                .style("stroke-width",1).style("stroke","#a6a6a6");
                node.append("text").attr("dx",11).attr("dy",".35em").style("font-size","12px").style("fill","bslack").text(function(d){if(d.objectDisplayName!==undefined){return d.objectDisplayName;}else{return d.objectName;}});
                vis.style("opacity",1e-6).transition().duration(1000).style("opacity",1);

                function fade(opacity) {
                    return function(d) {
                        node.style("stroke-opacity",function(o){var thisOpacity=isConnected(d,o)?1:opacity;this.setAttribute('fill-opacity',thisOpacity);return thisOpacity;});
                        link.style("stroke-opacity",function(o){return o.source===d||o.target===d?1:opacity;});
                        linkText.style("stroke-opacity",function(o){return o.source===d||o.target===d?opacity:1;});
                    };
                }

                force.on("tick", function() {
                    link.attr("x1",function(d){return d.source.x;}).attr("y1",function(d){return d.source.y;}).attr("x2",function(d){return d.target.x;}).attr("y2",function(d){return d.target.y;});
                    linkText.attr("x",function(d){return((d.source.x+d.target.x)/ 2);}).attr("y",function(d){return((d.source.y+d.target.y)/ 2);});
					node.attr("transform",function(d){return"translate("+d.x+","+d.y+")";});										
                });

                //---Insert-------
                vis.append('defs')
                    .append('marker').attr({'id':'arrowhead','viewBox':'-0 -5 10 10','refX':25,'refY':0,'orient':'auto','markerWidth':6,'markerHeight':8,'xoverflow':'visible'})
                    .append('svg:path').attr('d','M 0,-5 L 10 ,0 L 0,5').attr('fill','#BDBDBD').attr('stroke','#BDBDBD').attr('stroke-opacity','0.1');
								//---End Insert---     
                function getLinkLabel(nodes, links, sourceId, targetId) {
                    var linkName = '';
                    links.forEach(function(link) {
                        if ((link.source == nodes[sourceId]) && (link.target == nodes[targetId])) {
                            linkName = link.label;
                        }
                    })
                    return linkName
                }
            }

            /**
             * [getD3ConceptRelationByConceptId description]
             * This function return d3ConceptRelation of a concept
             * @param  {[type]} d3ConceptRelations [description]
             * @param  {[type]} conceptId          [description]
             * @return {[type]}                    [description]
             */
            function getD3ConceptRelationByConceptId(d3ConceptRelations, conceptId) {
                var conceptIds = d3ConceptRelations.map(function(e) {
                        return e.conceptId; }),
                    idx = conceptIds.indexOf(conceptId);
                return (idx !== -1) ? d3ConceptRelations[idx].d3ConceptRelation : null;
            }

            /**
             * [queryConcepts2d3QueryGraph description]
             * This function convert queryConcepts to d3QueryGraph
             * @return {[type]} [description]
             */


            function queryConcepts2d3QueryGraph() {
                var rootQueryObject = $scope.rootQueryObject,
                    routeRelatedObjects = $scope.routeRelatedObjects;
                    
                var d3QueryGraph = { "nodes": [], "links": [] };

                if (rootQueryObject !== undefined) {
                    rootQueryObject.d3Id = 10000;
                    rootQueryObject.r = 15;
                    rootQueryObject.x = rootQueryObject.currentPosition.x;
                    rootQueryObject.y = rootQueryObject.currentPosition.y;
                }

                d3QueryGraph.nodes.push(rootQueryObject);
                for (var i = 0; i < routeRelatedObjects.length; i++) {
                    var routeRelatedObject = routeRelatedObjects[i];
                    if (routeRelatedObject.length > 0) {
                        if (routeRelatedObject[0].direction !== -1) 
                            d3QueryGraph.links.push({
                                "sourceId": rootQueryObject.conceptId,
                                "source": 0, 
                                "targetId": routeRelatedObject[0].conceptId,
                                "target": d3QueryGraph.nodes.length, 
                                "value": 10, 
                                "label": routeRelatedObject[0].linkLabel,
                                "group": i + 1 
                            })
                        else 
                            d3QueryGraph.links.push({
                                "sourceId": routeRelatedObject[0].conceptId,
                                "source": d3QueryGraph.nodes.length, 
                                "targetId": rootQueryObject.conceptId,
                                "target": 0,
                                "value": 10, 
                                "label": routeRelatedObject[0].linkLabel,
                                "group": i + 1 
                            })
                        for (var j = 0; j < routeRelatedObject.length; j++) {
                            var relatedObject = routeRelatedObject[j];
                            relatedObject.d3Id = 100 * i + j;
                            relatedObject.r = relatedObject.isProperty ? 8 : 12;
                            relatedObject.x = relatedObject.currentPosition.x;
                            relatedObject.y = relatedObject.currentPosition.y;
                            d3QueryGraph.nodes.push(relatedObject);                            
                            if (j < routeRelatedObject.length - 1) {
                                if (routeRelatedObject[j+1].direction !== -1)
                                    d3QueryGraph.links.push({ 
                                        "sourceId": relatedObject.conceptId,
                                        "source": d3QueryGraph.nodes.length - 1, 
                                        "targetId": routeRelatedObject[j+1].conceptId,
                                        "target": d3QueryGraph.nodes.length, 
                                        "label": routeRelatedObject[j+1].linkLabel,
                                        "value": 10, 
                                        "group": i + 1 })
                                else 
                                    d3QueryGraph.links.push({ 
                                        "sourceId": routeRelatedObject[j+1].conceptId,
                                        "source": d3QueryGraph.nodes.length, 
                                        "targetId": relatedObject.conceptId,
                                        "target": d3QueryGraph.nodes.length - 1, 
                                        "label": routeRelatedObject[j+1].linkLabel,
                                        "value": 10, 
                                        "group": i + 1 })
                            }
                        }
                    }
                }

                return d3QueryGraph;
            }

            // function queryConcepts2d3QueryGraph() {
            //     var rootQueryObject = $scope.rootQueryObject,
            //         routeRelatedObjects = $scope.routeRelatedObjects;
            //     var d3QueryGraph = { "nodes": [], "links": [] };

            //     if (rootQueryObject !== undefined) {
            //         rootQueryObject.d3Id = 10000;
            //         rootQueryObject.r = 15;
            //         rootQueryObject.x = rootQueryObject.currentPosition.x;
            //         rootQueryObject.y = rootQueryObject.currentPosition.y;
            //     }

            //     d3QueryGraph.nodes.push(rootQueryObject);
            //     console.log(d3QueryGraph.nodes);
            //     for (var i = 0; i < routeRelatedObjects.length; i++) {
            //         var routeRelatedObject = routeRelatedObjects[i];
            //         if (routeRelatedObject.length > 0) {
            //             d3QueryGraph.links.push({ "source": 0, "target": d3QueryGraph.nodes.length, "value": 10, "group": i + 1 });
            //             for (var j = 0; j < routeRelatedObject.length; j++) {
            //                 var relatedObject = routeRelatedObject[j];
            //                 relatedObject.d3Id = 100 * i + j;
            //                 relatedObject.r = 12;
            //                 relatedObject.x = relatedObject.currentPosition.x;
            //                 relatedObject.y = relatedObject.currentPosition.y;
            //                 d3QueryGraph.nodes.push(relatedObject);
            //                 if (j < routeRelatedObject.length - 1) {
            //                     d3QueryGraph.links.push({ "source": d3QueryGraph.nodes.length - 1, "target": d3QueryGraph.nodes.length, "value": 10, "group": i + 1 });
            //                 }
            //             }
            //         }
            //     }
            //     console.log(d3QueryGraph.links);
            //     return d3QueryGraph;
            // }

            /**
             * [queryConcepts2d3QueryGraph description]
             * This function convert queryConcepts to d3QueryGraph
             * @return {[type]} [description]
             */
            function queryConcepts2d3QueryGraphCheckExamType(listCheckExamTypeResult) {
                var rootQueryObject = $scope.rootQueryObject,
                    routeRelatedObjects = $scope.routeRelatedObjects;
                var d3QueryGraph = { "nodes": [], "links": [] };

                if (rootQueryObject !== undefined) {
                    rootQueryObject.d3Id = 10000;
                    rootQueryObject.x = rootQueryObject.currentPosition.x;
                    rootQueryObject.y = rootQueryObject.currentPosition.y;
                }
                for (var i = 0; i < listCheckExamTypeResult.length; i++) {
                    if (listCheckExamTypeResult[i].queryObjectIndex == -1){
                        rootQueryObject.r = 8;
                        rootQueryObject.color = "#848484";
                    }
                }

                d3QueryGraph.nodes.push(rootQueryObject);
                console.log(d3QueryGraph.nodes);
                for (var i = 0; i < routeRelatedObjects.length; i++) {
                    var routeRelatedObject = routeRelatedObjects[i];
                    if (routeRelatedObject.length > 0) {
                        d3QueryGraph.links.push({ "source": 0, "target": d3QueryGraph.nodes.length, "value": 10, "group": i + 1 });
                        for (var j = 0; j < routeRelatedObject.length; j++) {
                            var relatedObject = routeRelatedObject[j];
                            relatedObject.d3Id = 100 * i + j;
                            relatedObject.x = relatedObject.currentPosition.x;
                            relatedObject.y = relatedObject.currentPosition.y;
                            if (checkRelatedObjectInListCheckExamResult(listCheckExamTypeResult, i, j)) {
                                relatedObject.r = 8;
                                relatedObject.color = "#848484";
                            }
                            d3QueryGraph.nodes.push(relatedObject);
                            if (j < routeRelatedObject.length - 1) {
                                d3QueryGraph.links.push({ "source": d3QueryGraph.nodes.length - 1, "target": d3QueryGraph.nodes.length, "value": 10, "group": i + 1 });
                            }
                        }
                    }
                }
                function checkRelatedObjectInListCheckExamResult(listCheckExamTypeResult, routeIndexRelatedObject, queryObjectIndexRelatedObject){
                    var check = false;
                    for (var i = 0; i < listCheckExamTypeResult.length; i++) {
                        if ((listCheckExamTypeResult[i].routeIndex == routeIndexRelatedObject) && (listCheckExamTypeResult[i].queryObjectIndex == queryObjectIndexRelatedObject))  {
                            check = true;
                        }
                    }
                    return check;
                }
                console.log(d3QueryGraph.links);
                return d3QueryGraph;
            }

            /**
             * [updateD3RelationGraph description]
             * This function updates current relation graph. It highlight on the relation
             * graph the current clickedQueryObject of query graph and all nodes which 
             * has relation with it.
             * @param  {[type]} clickedQueryObject [description]
             * @return {[type]}                      [description]
             */
            function updateD3RelationGraph(clickedQueryObject) {
                $scope.highlightedRelationGraphConceptIds = [];
                $scope.highlightedRelationGraphConceptIds.push(clickedQueryObject.conceptId);
                displayD3RelationGraph($scope.d3RelationGraph);
                var linkedByIndex = {};
                $scope.d3RelationGraph.links.forEach(function(d) {
                    linkedByIndex[d.source.index + "," + d.target.index] = 1;
                });

                function isConnected(a, b) {
                    return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
                }
                var relationGraphNodes = d3.select("#d3RelationGraph").selectAll(".node[id='" + clickedQueryObject.conceptId + "']").select("circle").attr("r", 20).style("fill", "red").each(function(d) {
                    var opacity = 0.1;
                    var node = d3.select("#d3RelationGraph").selectAll(".node").style("stroke-opacity", function(o) {
                        var thisOpacity = isConnected(d, o) ? 1 : opacity;
                        if (isConnected(d, o))
                            $scope.highlightedRelationGraphConceptIds.push(o.conceptId);
                        this.setAttribute('fill-opacity', thisOpacity);
                        return thisOpacity;
                    });

                    var link = d3.select("#d3RelationGraph").selectAll(".link").style("stroke-opacity", function(o) {
                        return o.source === d || o.target === d ? 1 : opacity;
                    });

                    link = d3.select("#d3RelationGraph").selectAll(".link").select("text").attr('hidden', function(o) {
											return o.source === d || o.target === d ? null : true;
										});
										// link = d3.select("#d3RelationGraph").selectAll(".link").select("text").style("stroke-opacity", function(o) {
                    //     return o.source === d || o.target === d ? opacity : 1;
                    // });
                });
            }


            /**
             * [displayD3QueryGraph description]
             * @param  {[type]} d3GraphData [description]
             * @return {[type]}             [description]
             */
            function displayD3QueryGraph(d3QueryGraph) {
                d3.select("#d3QueryGraph").select("#idD3QueryGraph").remove();
                console.log("D3 Graph starts");

                var width = document.getElementById("queryGraph").clientWidth,
                    height = document.getElementById("queryGraph").clientHeight;

                var vis=d3.select("#d3QueryGraph").append("svg:svg").attr("id","idD3QueryGraph").attr("width",width).attr("height",height).attr("pointer-events","all").call(d3.behavior.zoom().on("zoom",redraw)).on("dblclick.zoom",null).append('svg:g');

                function redraw(){vis.attr("transform","translate("+d3.event.translate+")"+" scale("+d3.event.scale+")");}
                var color = d3.scale.category20();
                var force=d3.layout.force().charge(-600).linkDistance(10).size([width,height]).nodes(d3QueryGraph.nodes).links(d3QueryGraph.links).linkDistance(100).start();
                var link=vis.selectAll(".link").data(d3QueryGraph.links).enter().append("g").attr("class","link").append("line").style("marker-end","url(#arrowhead_01)").style("stroke",function(d){return color(d.group);}).style("stroke-width","3");
                var linkText=vis.selectAll(".link").append("text").attr("hidden",null).attr("fill","blue").style("font","normal 14px Arial").attr("dy",".35em").style("stroke-opacity","1").text(function(d){return d.label;});
                
                // var link=vis.selectAll(".link").data(d3RelationGraph.links).enter().append("g").attr("class","link").append("line").style("marker-end","url(#arrowhead)").style("stroke","#6E6E6E").style("stroke-width","1.5");
                // var linkText=vis.selectAll(".link").append("text").attr("fill","blue").attr("hidden",true).style("font","normal 14px Arial").attr("dy",".35em").style("stroke-opacity","1").text(function(d){return d.label;});
                
                
                var drag = force.drag()
                    .on("dragstart", function(d) {
                        d3.event.sourceEvent.stopPropagation();
                        if(d.d3Id==10000){$scope.rootQueryObject.currentPosition={'x':d.x,'y':d.y};}
                        else{console.log(d);var k=d.d3Id%100;var t=(d.d3Id-k)/100;$scope.routeRelatedObjects[t][k].currentPosition={'x':d.x,'y':d.y};}
                    });

                function clickRelatedObject(shiftKey, d, routeIndex, objectIndex) {
                    if (shiftKey) { // ctrClick detected: deleted related object from route of related object
                        console.log(d);
                        console.log('d3QueryGraph: ', $scope.d3QueryGraph);
                        $scope.routeRelatedObjects[routeIndex].splice(objectIndex, $scope.routeRelatedObjects[routeIndex].length);
                        $scope.d3QueryGraph = queryConcepts2d3QueryGraph();
                        displayD3QueryGraph($scope.d3QueryGraph);
                        $scope.$apply();
                    } else {
                        console.log(d);
                        console.log($scope.routeRelatedObjects);
                        console.log('d3QueryGraph: ', $scope.d3QueryGraph);
                        $scope.currentRouteRelatedObject = $scope.routeRelatedObjects[routeIndex];
                        var previousClickedNodeQueryGraphD3Id = "", previousClickedNodeQueryGraphColor = "";
                        if ($scope.clickedQueryObject !== undefined){
                            previousClickedNodeQueryGraphD3Id = $scope.clickedQueryObject.d3Id;
                            previousClickedNodeQueryGraphColor = $scope.clickedQueryObject.color;
                        }else{  
                            previousClickedNodeQueryGraphD3Id = d.d3Id;
                            previousClickedNodeQueryGraphColor = d.color;
                        }
                        $scope.clickedQueryObject = d;
                        $scope.d3RelationGraph = $scope.d3RelationGraphDict[d.conceptId];
                        console.log('current d3RelationGraph: ', $scope.d3RelationGraph);
                        displayD3RelationGraph($scope.d3RelationGraph);
                        $scope.currentSelectedAttrClickedQueryObject = $scope.clickedQueryObject.objectAttrs[0];
                        // $scope.d3ConceptRelation = getD3ConceptRelationByConceptId($scope.d3ConceptRelations, $scope.clickedQueryObject.conceptId);
                        // $scope.clickedQueryObjectLeafClassMapping = getOntoConceptLeafClassMapping($scope.clickedQueryObject); 				
                        updateD3RelationGraph(d);
                        var previousClickedNodeQueryGraph = d3.select("#d3QueryGraph").select(".node[id='" + previousClickedNodeQueryGraphD3Id + "']").select("circle").style("fill", previousClickedNodeQueryGraphColor);
                        var rootNodeQueryGraph = d3.select("#d3QueryGraph").select(".node[id='10000']").select("circle").style("fill", "red");
                        var clickedNodeQueryGraph = d3.select("#d3QueryGraph").select(".node[id='" + d.d3Id + "']").select("circle").style("fill", "#5cb85c");  
                        $scope.$apply();
                    }
                }

                function clickRootQueryObject(shiftKey, d) {
                    if (shiftKey) { //ctrlClick detected: remove rootQueryObject and all routes of related objects
                        console.log(d);
                        $scope.rootQueryObject = undefined;
                        $scope.clickedQueryObject = undefined;
                        $scope.routeRelatedObjects = [[]];
                        $scope.currentRouteRelatedObject = $scope.routeRelatedObjects[0];
                        $scope.d3QueryGraph = queryConcepts2d3QueryGraph();
                        displayD3QueryGraph($scope.d3QueryGraph);
                        $scope.$apply();
                    } else {
                        console.log('clicked rootQueryObject: ', d);
                        var previousClickedNodeQueryGraphD3Id = "", previousClickedNodeQueryGraphColor = "";
                        if ($scope.clickedQueryObject !== undefined){
                            previousClickedNodeQueryGraphD3Id = $scope.clickedQueryObject.d3Id;
                            previousClickedNodeQueryGraphColor = $scope.clickedQueryObject.color;
                        } else {
                            previousClickedNodeQueryGraphD3Id = d.d3Id;
                            previousClickedNodeQueryGraphColor = d.color;
                        }
                        $scope.clickedQueryObject = d;
                        $scope.currentSelectedAttrClickedQueryObject = $scope.clickedQueryObject.objectAttrs[0];
                        
                        $scope.d3RelationGraph = $scope.d3RelationGraphDict[d.conceptId];
                        console.log('current d3RelationGraph: ', $scope.d3RelationGraph);
                        // $scope.d3ConceptRelation = getD3ConceptRelationByConceptId($scope.d3ConceptRelations, $scope.clickedQueryObject.conceptId);
                        // //$scope.clickedQueryObjectLeafClassMapping = getOntoConceptLeafClassMapping($scope.clickedQueryObject);
                        displayD3RelationGraph($scope.d3RelationGraph);
                        updateD3RelationGraph(d);
                        $scope.$apply();
                        // var previousClickedNodeQueryGraph = d3.select("#d3QueryGraph").select(".node[id='" + previousClickedNodeQueryGraphD3Id + "']").select("circle").style("fill", previousClickedNodeQueryGraphColor);
                        // var rootNodeQueryGraph = d3.select("#d3QueryGraph").select(".node[id='10000']").select("circle").style("fill", "red");
                        // var clickedNodeQueryGraph = d3.select("#d3QueryGraph").select(".node[id='" + d.d3Id + "']").select("circle").style("fill", "#5cb85c");
                        // $scope.$apply();
                    }
                }

                var node = vis.selectAll(".node")
                    .data(d3QueryGraph.nodes)
                    .enter().append("g")
                    .attr("class","node").attr("name",function(d){return d.objectName;}).attr("id",function(d){return d.d3Id;}).attr("conceptId",function(d,i){return d.conceptId;})
                    .call(drag)
                    .on('dblclick',function(d){if(d.d3Id=="10000"){console.log("dblclick query Object");dblClickRootQueryObject();}else{console.log("dblclick related object");var objectIndex=(d.d3Id%100),routeIndex=(d.d3Id-objectIndex)/ 100;dblClickRelatedObject(routeIndex,objectIndex);}})
                    .on(('click'),function(d){if(d.d3Id=="10000"){console.log("click query Object");var shiftKey=d3.event.shiftKey;clickRootQueryObject(shiftKey,d);}else{console.log("click related object");var objectIndex=(d.d3Id%100),routeIndex=(d.d3Id-objectIndex)/ 100;var shiftKey=d3.event.shiftKey;clickRelatedObject(shiftKey,d,routeIndex,objectIndex);}});

                node.append("circle").attr("class","node").attr("r",function(d){var r=(d.r!==undefined)?d.r:12;return r;})
                        .style("fill",function(d){
                          var color=d.color;
                          // if($scope.clickedQueryObject!==undefined){color=(d==$scope.clickedQueryObject)?"#5cb85c":d.color;}
                  if(d.d3Id=="10000")color="red";
                  return color;
                })
                .style("stroke-width",1).style("stroke","black");

                node.append("text").attr("dx",12).attr("dy",".35em").style("fill","bslack").style("font-size","12px").style("font-weight","normal").text(function(d){return d.objectDisplayName;});
                vis.style("opacity",1e-6).transition().duration(1000).style("opacity",1);
                force.on("tick", function() {
                    link.attr("x1",function(d){return d.source.x;}).attr("y1",function(d){return d.source.y;}).attr("x2",function(d){return d.target.x;}).attr("y2",function(d){return d.target.y;});
                    linkText.attr("x",function(d){return((d.source.x+d.target.x)/ 2);}).attr("y",function(d){return((d.source.y+d.target.y)/ 2);});
                    node.attr("transform",function(d){return"translate("+d.x+","+d.y+")";});
                });

                //---Insert-------
                vis.append('defs').append('marker')
                    .attr({'id':'arrowhead_01','viewBox':'-0 -5 10 10','refX':25,'refY':0,'orient':'auto','markerWidth':4,'markerHeight':3,'xoverflow':'visible'})
                    .append('svg:path').attr('d','M 0,-5 L 10 ,0 L 0,5').attr('fill','blue').attr('stroke','blue');
                //---End Insert---     
            }

            /**
             * [displayD3AllResultGraph description]
             * This function displays the d3 graph of results (when users choose 
             * to obtain rootQueryObject and all relatedObjects)
             * @param  {[type]} d3AllResultGraph [description]
             * @return {[type]}                  [description]
             */
            function displayD3AllResultGraph(d3AllResultGraph) {
                d3.select("#d3AllResultGraph").select("#idD3AllResultGraph").remove();
                console.log("D3 all results starts");

                var width = document.getElementById("dataPanel").clientWidth,
                    height = document.getElementById("dataPanel").clientHeight;

                var vis=d3.select("#d3AllResultGraph").append("svg:svg").attr("id","idD3AllResultGraph").attr("width",width).attr("height",height).attr("pointer-events","all").call(d3.behavior.zoom().on("zoom",redraw)).on("dblclick.zoom",null).append('svg:g');

                function redraw(){vis.attr("transform","translate("+d3.event.translate+")"+" scale("+d3.event.scale+")");}
                var color = d3.scale.category20();
                var force=d3.layout.force().charge(-600).linkDistance(10).size([width,height]).nodes(d3AllResultGraph.nodes).links(d3AllResultGraph.links).linkDistance(100).start();
                var link=vis.selectAll(".link").data(d3AllResultGraph.links).enter().append("line").attr("class","link").style("marker-end","url(#arrowhead_01)").style("stroke",function(d){return color(d.group);}).style("stroke-width","3");
										
                var drag = force.drag()
                    .on("dragstart", function(d) {
                        d3.event.sourceEvent.stopPropagation();                       
                    });

                var node = vis.selectAll(".node")
                    .data(d3AllResultGraph.nodes)
                    .enter().append("g")
                    .attr("class","node").attr("name",function(d){return d.objectName;}).attr("id",function(d){return d.d3Id;}).attr("conceptId",function(d,i){return d.conceptId;})
                    .call(drag);
                    // .on('dblclick',function(d){if(d.d3Id=="10000"){console.log("dblclick query Object");dblClickRootQueryObject();}else{console.log("dblclick related object");var objectIndex=(d.d3Id%100),routeIndex=(d.d3Id-objectIndex)/ 100;dblClickRelatedObject(routeIndex,objectIndex);}})
                    // .on(('click'),function(d){if(d.d3Id=="10000"){console.log("click query Object");var shiftKey=d3.event.shiftKey;clickRootQueryObject(shiftKey,d);}else{console.log("click related object");var objectIndex=(d.d3Id%100),routeIndex=(d.d3Id-objectIndex)/ 100;var shiftKey=d3.event.shiftKey;clickRelatedObject(shiftKey,d,routeIndex,objectIndex);}});

                node.append("circle").attr("class","node").attr("r",function(d){var r=(d.r!==undefined)?d.r:12;return r;})
                .style("fill",function(d){
                    var color=d.color;
                    // if($scope.clickedQueryObject!==undefined){color=(d==$scope.clickedQueryObject)?"#5cb85c":d.color;}
                    if(d.d3Id=="10000")color="red";
                    return color;
                })
                .style("stroke-width",1).style("stroke","black");

                node.append("text").attr("dx",12).attr("dy",".35em").style("fill","bslack").style("font-size","12px").style("font-weight","normal").text(function(d){return d.objectName;});
                vis.style("opacity",1e-6).transition().duration(1000).style("opacity",1);
                force.on("tick", function() {
                    link.attr("x1",function(d){return d.source.x;}).attr("y1",function(d){return d.source.y;}).attr("x2",function(d){return d.target.x;}).attr("y2",function(d){return d.target.y;});
				    node.attr("transform",function(d){return"translate("+d.x+","+d.y+")";});
                });
                //---Insert-------
                vis.append('defs').append('marker')
                    .attr({'id':'arrowhead_01','viewBox':'-0 -5 10 10','refX':25,'refY':0,'orient':'auto','markerWidth':4,'markerHeight':3,'xoverflow':'visible'})
                    .append('svg:path').attr('d','M 0,-5 L 10 ,0 L 0,5').attr('fill','blue').attr('stroke','blue');
                //---End Insert---     
            }

            /**
             * [removeD3QueryGraph description]
             * This ngFunction remove the current Query Graph
             * @return {[type]} [description]
             */
            $scope.removeD3QueryGraph = function(){
                fnRemoveD3QueryGraph();
            };
            
            /**
             * [fnRemoveD3QueryGraph description]
             * This function remove the current d3 query graph
             * @return {[type]} [description]
             */
            function fnRemoveD3QueryGraph() {
                d3.select("#d3QueryGraph").select("#idD3QueryGraph").remove();
                $scope.rootQueryObject = undefined;
                $scope.routeRelatedObjects = [[]];
                $scope.clickedQueryObject = undefined;
                console.log("D3 Graph removed");
            }

            function updateD3QueryGraph(argument) {
            	$scope.d3QueryGraph = queryConcepts2d3QueryGraph();
            	displayD3QueryGraph($scope.d3QueryGraph);
            }

        /**
         * EXECUTING FUNCTIONs
         */
        
            // -------------------------------------------------------------------- // 
            // This function get all items with clickedRelatedObject's ObjectType
            // -------------------------------------------------------------------- //
            $scope.getDataClickedQueryObject = function(){
                console.log($scope.clickedQueryObject);
                executeQuery();
                function executeQuery(){
                var username = "infodba", password = "infodba";
                if (($scope.userAccount.username !== undefined) && ($scope.userAccount.password !== undefined)){
                    username = $scope.userAccount.username;
                    password = $scope.userAccount.password;
                }
                var executeXquery = [];
                var attrList = '("KTCId","item_id","object_type","object_name","last_mod_date")';
                executeXquery.push('xquery version "1.0";');
                executeXquery.push('declare namespace Teamcenter="java:com.cadesis.spike.plm.teamcenter10.xquery.TCExtension";');
                executeXquery.push('declare namespace local="local";');
                executeXquery.push('declare variable $ParametersNode external;');
                executeXquery.push('declare variable $teamcenter := Teamcenter:instance();');
                executeXquery.push('<elements>');
                executeXquery.push('{');
                executeXquery.push('    let $attrList := '+attrList);
                executeXquery.push('    let $query := <query query_name="Item - simple">');
                executeXquery.push('                    <param name="Type" value="'+$scope.clickedQueryObject.mappedDmObjectType+'"/>');
                executeXquery.push('                  </query>');
                executeXquery.push('    let $results := Teamcenter:Query($teamcenter, $query)');
                executeXquery.push('    let $quantity := if (fn:count($results) < 50) then fn:count($results) else 50');
                executeXquery.push('    for $i in (1 to $quantity)');
                executeXquery.push('    let $foundClasses := Teamcenter:getClassification($teamcenter, $results[$i], fn:false())');
                executeXquery.push('    return');
                executeXquery.push('        if (fn:empty($foundClasses))');
                executeXquery.push('        then(');
                executeXquery.push('                let $object :=');
                executeXquery.push('                    <object KTCId="{$results[$i]/@KTCId}" objectType="{$results[$i]/@object_type}" objectName="{$results[$i]/@object_name}" objectId="{$results[$i]/@item_id}">');
                executeXquery.push('                    </object>');
                executeXquery.push('                return $object');
                executeXquery.push('            )');
                executeXquery.push('        else(');
                executeXquery.push('                for $foundClass in $foundClasses');
                executeXquery.push('                let $object :=');
                executeXquery.push('                    <object KTCId="{$foundClass/@KTCId}" objectType="{$foundClass/@object_type}" objectName="{$foundClass/@object_name}" objectId="{$foundClass/@id}" tcClassId="{$foundClass/@cid}">');
                executeXquery.push('                    {');
                executeXquery.push('                      for $attr in $foundClass/ClassificationAttribute');
                executeXquery.push('                      return');
                executeXquery.push('                        <objectAttr attrName="{$attr/@name}" attrId="{$attr/@id}" attrValue="{$attr/@dbValue}">');
                executeXquery.push('                        </objectAttr>');
                executeXquery.push('                    }');
                executeXquery.push('                    </object>');
                executeXquery.push('                return $object');
                executeXquery.push('            )');
                executeXquery.push('}');
                executeXquery.push('</elements>');

                $http({
                        method  : 'POST',
                        url     : 'http://bio-mule-srv:8080/cadesis-spike-system-plm-teamcenter10/spike',
                        data    : $.param({
                                                    siTag:"Teamcenter10",
                                                    connectionMap: "KTCUrl=Ì;KTCUser="+username+";KTCPwd="+password+";KTCDisc=Disc1",
                                                    xqueryFileName: executeXquery.join("\r\n"),
                                                    outputMethod: "xml"
                                                }),
                        headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                    })
                    .success(function(data, status, headers, config) {
                        var blob = new Blob([executeXquery.join("\r\n")], {type: "text/plain;charset=utf-8"});
                        saveAs(blob, "executeXquery.xq");
                        console.log("xQuery Result"+data);
                        var jsonResultWithClassAttrValue = $.xml2json(data).object;

                        $scope.jsonGroupedResultWithClassAttrValue = jsonResultWithClassAttrValue2jsonGroupedResultWithClassAttrValue(jsonResultWithClassAttrValue);
                        writeFile("jsonGroupedResultWithClassAttrValue.json", JSON.stringify($scope.jsonGroupedResultWithClassAttrValue));

                        $scope.csvDataClickedQueryObject = jsonDataClickedQueryObject2csvDataClickedQueryObject($scope.jsonGroupedResultWithClassAttrValue);
                        writeFile("csvDataClickedQueryObject.csv", $scope.csvDataClickedQueryObject.join("\r\n"));
                    })
                    .error(function(data, status, headers, config){
                        console.log("error"+data);
                    });
                }
            };
  
            /**
             * [getClassifiedData description]
             * @return {[type]} [description]
             */
            $scope.getClassifiedData = function(){
                if (checkTcClassAttrOperator($scope.clickedQueryObject)) {
                    $window.alert("Sorry. This function accepts only '=' operator in conditions. Please remove or replace other operators to '='.");
                } else {
                    executeFindClassificationQuery($scope.clickedQueryObject);
                }

                function executeFindClassificationQuery(clickedQueryObject){
                    console.log(clickedQueryObject);
                    var queryContent = [];

                    queryContent.push('xquery version "1.0";');
                    queryContent.push('declare namespace TC="java:com.cadesis.spike.plm.teamcenter10.xquery.TCExtension";');
                    queryContent.push('declare namespace Utils="java:com.cadesis.spike.xqueryutils.XQueryUtilsExtension";');
                    queryContent.push('declare namespace local="local";');
                    queryContent.push('declare namespace functx = "http://www.functx.com";');

                    queryContent.push('declare variable $ParametersNode external;');
                    queryContent.push('declare variable $tc := TC:instance();');
                    queryContent.push('declare variable $utils := Utils:instance();');
                    queryContent.push('declare variable $lf := "&#xA;";');
                    queryContent.push('declare variable $sep := ";";');
                    queryContent.push('declare variable $s :="";');

                    queryContent.push('declare function local:main(){');
                    queryContent.push('    let $class :=   <Icm0 cid="'+clickedQueryObject.mappedTcClassId+'">');

                    if (clickedQueryObject.tcClassAttrs !== undefined) {
                        for (var i = 0; i < clickedQueryObject.tcClassAttrs.length; i++) {
                            var tempTcClassAttr = clickedQueryObject.tcClassAttrs[i];
                            if ((tempTcClassAttr.attrValue !== "") && (tempTcClassAttr.attrOperator == "="))
                                queryContent.push('                          <ClassificationAttribute id="'+tempTcClassAttr.attrId+'" dbValue="'+tempTcClassAttr.attrValue+'"/>');
                        }
                    }

                    queryContent.push('                    </Icm0>');
                    queryContent.push('    let $objects := TC:findClassification($tc, $class)');
                    queryContent.push('    let $listObjects := ');
                    queryContent.push('                <objects>');
                    queryContent.push('                    {');

                    var objectAttrConditions = []; 
                    if (clickedQueryObject.objectAttrs !== undefined) {
                        for (var i = 0; i < clickedQueryObject.objectAttrs.length; i++) {
                            var tempObjectAttr = clickedQueryObject.objectAttrs[i];
                            if ((tempObjectAttr.attrName == "name") && (tempObjectAttr.attrValue !== "") && (tempObjectAttr.attrOperator !== "=")){
                                objectAttrConditions.push('(@object_name' + tempObjectAttr.attrOperator + '"' + tempObjectAttr.attrValue + '")');
                            }
                            if ((tempObjectAttr.attrName == "name") && (tempObjectAttr.attrValue !== "") && (tempObjectAttr.attrOperator == "=")){
                                objectAttrConditions.push('fn:contains(./@object_name,"' + tempObjectAttr.attrValue + '")');
                            }
                            if ((tempObjectAttr.attrName == "id") && (tempObjectAttr.attrValue !== "") && (tempObjectAttr.attrOperator !== "=")){
                                objectAttrConditions.push("(@id" + tempObjectAttr.attrOperator + '"' +  tempObjectAttr.attrValue + '")');
                            }
                            if ((tempObjectAttr.attrName == "id") && (tempObjectAttr.attrValue !== "") && (tempObjectAttr.attrOperator == "=")){
                                objectAttrConditions.push('fn:contains(./@id,"' + tempObjectAttr.attrValue + '")');
                            }
                        }
                    }

                    if (objectAttrConditions.length > 0) {
                        queryContent.push('                        for $object in $objects['+objectAttrConditions.join(' and ')+']');
                    }else{
                        queryContent.push('                        for $object in $objects');
                    }
                    
                    queryContent.push('                            return');
                    queryContent.push('                                <object KTCId="{$object/@KTCId}" objectType="{$object/@object_type}" objectName="{$object/@object_name}" objectId="{$object/@id}">');
                    queryContent.push('                                    {');
                    queryContent.push('                                        for $attr in $object/ClassificationAttribute');
                    queryContent.push('                                        return');
                    queryContent.push('                                            <objectAttr attrName="{$attr/@name}" attrId="{$attr/@id}" attrValue="{fn:data($attr/@dbValue)}">');
                    queryContent.push('                                            </objectAttr>');
                    queryContent.push('                                    }');
                    queryContent.push('                                </object>');                  
                    queryContent.push('                    }');
                    queryContent.push('               </objects>');
                    queryContent.push('    return $listObjects');
                    queryContent.push('};');

                    queryContent.push('let $result := local:main()');
                    queryContent.push('return $result');

                    console.log(queryContent.join("\r\n"));
                    $http({
                            method  : 'POST',
                            url     : 'http://bio-mule-srv:8080/cadesis-spike-system-plm-teamcenter10/spike',
                            data    : $.param({
                                                        siTag:"Teamcenter10",
                                                        connectionMap: "KTCUrl=http://bio-tc-preprod:8080/tc;KTCUser=infodba;KTCPwd=infodba;KTCDisc=Disc1",
                                                        xqueryFileName: queryContent.join("\r\n"),
                                                        outputMethod: "xml"
                                                    }),
                            headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                        })
                        .success(function(data, status, headers, config) {
                            console.log(data);
                            var dataArray = data.split("\n");
                            console.log(dataArray);
                            if (dataArray[0] !== "<objects>"){
                                $window.alert("No data classified into this class");
                            }else{
                                var jsonFindClassificationResult = $.xml2json(data).object;
                                console.log(jsonFindClassificationResult);
                                if (jsonFindClassificationResult === undefined){
                                    $window.alert("No data classified into this class");
                                }else{
                                    if ((jsonFindClassificationResult !== undefined) && (jsonFindClassificationResult.length == undefined)) 
                                        jsonFindClassificationResult = [jsonFindClassificationResult];
                                    $scope.jsonFindClassificationResult = jsonFindClassificationResult; // Save result to scope (in order to make the querying as a process)

                                    var csvFindClassificationResult = jsonResult2csvResult(jsonFindClassificationResult);
                                    var blob = new Blob([csvFindClassificationResult.join("\r\n")], {type: "text/plain;charset=utf-8"});
                                    saveAs(blob, "csvFindClassificationResult.csv");           
                                }
                            }
                        })
                        .error(function(data, status, headers, config){
                            console.log("error"+data);
                        });
                }
            };

            /**
             * [checkTcClassAttrOperator description]
             * [Get data] funciton accepts only equal (=) opertaor. This function check if 
             * tcClassAttrs conditions contain other operators.
             * @param  {[type]} queryObject [description]
             * @return {[type]}             [description]
             */
            function checkTcClassAttrOperator(queryObject) {
                var isExistedUnEqualConditions = false;
                if (queryObject.tcClassAttrs !== undefined) {
                    for (var i = 0; i < queryObject.tcClassAttrs.length; i++) {
                        if ((queryObject.tcClassAttrs[i].attrValue !== "") && (queryObject.tcClassAttrs[i].attrOperator !== "=")) {
                            isExistedUnEqualConditions = true;
                        }
                    }
                }
                return isExistedUnEqualConditions;
            }

            $scope.getClassifiedData2 = function(){
                executeFindClassificationQuery($scope.clickedQueryObject);
                function executeFindClassificationQuery(clickedQueryObject){
                    console.log(clickedQueryObject);
                    var queryContent = [];

                    queryContent.push('xquery version "1.0";');
                    queryContent.push('declare namespace TC="java:com.cadesis.spike.plm.teamcenter10.xquery.TCExtension";');
                    queryContent.push('declare namespace Utils="java:com.cadesis.spike.xqueryutils.XQueryUtilsExtension";');
                    queryContent.push('declare namespace local="local";');
                    queryContent.push('declare namespace functx = "http://www.functx.com";');

                    queryContent.push('declare variable $ParametersNode external;');
                    queryContent.push('declare variable $tc := TC:instance();');
                    queryContent.push('declare variable $utils := Utils:instance();');
                    queryContent.push('declare variable $lf := "&#xA;";');
                    queryContent.push('declare variable $sep := ";";');
                    queryContent.push('declare variable $s :="";');

                    queryContent.push('declare function local:main(){');
                    queryContent.push('    let $class :=   <Icm0 cid="'+clickedQueryObject.mappedTcClassId+'">');
                    if (clickedQueryObject.tcClassAttrs !== undefined) {
                        for (var i = 0; i < clickedQueryObject.tcClassAttrs.length; i++) {
                            var tempTcClassAttr = clickedQueryObject.tcClassAttrs[i];
                            if ((tempTcClassAttr.attrValue !== "") && (tempTcClassAttr.attrOperator == "="))
                                queryContent.push('                          <ClassificationAttribute id="'+tempTcClassAttr.attrId+'" dbValue="'+tempTcClassAttr.attrValue+'"/>');
                        };
                    }
                    queryContent.push('                    </Icm0>');
                    queryContent.push('    let $objects := TC:findClassification($tc, $class)');
                    queryContent.push('    let $listObjects := ');
                    queryContent.push('                <objects>');
                    queryContent.push('                    {');
                    queryContent.push('                        for $object in $objects');
                    queryContent.push('                            return');
                    queryContent.push('                                <object KTCId="{$object/@KTCId}" objectType="{$object/@object_type}" objectName="{$object/@object_name}" objectId="{$object/@id}">');
                    queryContent.push('                                    {');
                    queryContent.push('                                        for $attr in $object/ClassificationAttribute');
                    queryContent.push('                                        return');
                    queryContent.push('                                            <objectAttr attrName="{$attr/@name}" attrId="{$attr/@id}" attrValue="{fn:data($attr/@dbValue)}">');
                    queryContent.push('                                            </objectAttr>');
                    queryContent.push('                                    }');
                    queryContent.push('                                </object>');                  
                    queryContent.push('                    }');
                    queryContent.push('               </objects>');
                    queryContent.push('    return $listObjects');
                    queryContent.push('};');

                    queryContent.push('let $result := local:main()');
                    queryContent.push('return $result');

                    console.log(queryContent.join("\r\n"));
                    $http({
                            method  : 'POST',
                            url     : 'http://bio-mule-srv:8080/cadesis-spike-system-plm-teamcenter10/spike',
                            data    : $.param({
                                                        siTag:"Teamcenter10",
                                                        connectionMap: "KTCUrl=http://bio-tc-preprod:8080/tc;KTCUser=infodba;KTCPwd=infodba;KTCDisc=Disc1",
                                                        xqueryFileName: queryContent.join("\r\n"),
                                                        outputMethod: "xml"
                                                    }),
                            headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                        })
                        .success(function(data, status, headers, config) {
                            console.log(data);
                            var jsonFindClassificationResult = $.xml2json(data).object;
                            if (jsonFindClassificationResult === undefined){
                                $window.alert("No result");
                            }else{
                                if ((jsonFindClassificationResult !== undefined) && (jsonFindClassificationResult.length == undefined)) 
                                    jsonFindClassificationResult = [jsonFindClassificationResult];
                                $scope.jsonFindClassificationResult = jsonFindClassificationResult; // Save result to scope (in order to make the querying as a process)

                                var csvFindClassificationResult = jsonResult2csvResult(jsonFindClassificationResult);
                                var blob = new Blob([csvFindClassificationResult.join("\r\n")], {type: "text/plain;charset=utf-8"});
                                saveAs(blob, "csvFindClassificationResult.csv");           
                            }
                        })
                        .error(function(data, status, headers, config){
                            console.log("error"+data);
                        });
                }
            };

            function getUserAccountValue(){
                var check = true;
                if (($scope.userAccount.username === "") || ($scope.userAccount.password === "")){
                    check = false;
                    $window.alert("Please verify user account"); 
                }
                if (($scope.userAccount.username !== undefined) && ($scope.userAccount.password === undefined)){
                    check = false;
                    $window.alert("Please enter password");
                }
                if (($scope.userAccount.username === undefined) && ($scope.userAccount.password !== undefined)){
                    check = false;
                    $window.alert("Please enter username");
                }
                return check;
            }

            $scope.generateSPARQL = function() {
                // getSPARQLQuery($scope.rootQueryObject, $scope.routeRelatedObjects);
                getSPARQLQuery2($scope.rootQueryObject, $scope.routeRelatedObjects);

                function getSPARQLQuery(rootQueryObject, routeRelatedObjects) {
                    var sparql_query = []
                    var returnedItems = getReturnedItems(rootQueryObject, routeRelatedObjects);
                    var conceptDeclarations = getConceptDeclarations(rootQueryObject, routeRelatedObjects);
                    var pairRelations = getPairRelations(rootQueryObject, routeRelatedObjects);
                    var filters = getFilters(rootQueryObject, routeRelatedObjects);
    
                    sparql_query.push('SELECT ' + returnedItems.join(' '));
                    sparql_query.push('{');
                    sparql_query.push(conceptDeclarations.join('\r\n'));                
                    sparql_query.push(pairRelations.join('\r\n'));
                    if (filters.length > 0) sparql_query.push('FILTER (' + filters.join(') && (') + ')');
                    sparql_query.push('}');
    
                    writeFile('output_sparql.text', sparql_query.join('\r\n'));    
                }

                // var sparql_query = ['SELECT ?docAddress'];

                // sparql_query.push('{ ?wkstp owl:Class stp:machining_workingstep .');
                // sparql_query.push('?mop owl:Class stp:machining_operation .');
                // sparql_query.push('?myTool owl:Class stp:machining_tool .');
                // sparql_query.push('?docRef owl:Class stp:document .');
                // sparql_query.push('?wkstp stp:machining_workingstep_has_operation ?mop .');
                // sparql_query.push('?mop stp:machining_operation_has_tool ?myTool .');
                // sparql_query.push('?myTool stp:machining_tool_has_id ?o .');
                // sparql_query.push('?wkstp stp:element_has_document_reference ?docRef .');
                // sparql_query.push('?docRef stp:document_has_name ?docAddress');
                // sparql_query.push('filter(?o = "%s"^^<http://www.w3.org/2001/XMLSchema#string>)');
                // sparql_query.push('}');

               
                function getConceptDeclarations(rootQueryObject, routeRelatedObjects) {
                    var selectedConceptNames = [];
                    var conceptDeclarations = [];
                    if (!rootQueryObject.isProperty) {
                        selectedConceptNames.push(rootQueryObject.objectDisplayName);                    
                        conceptDeclarations.push('?' + rootQueryObject.objectDisplayName + ' owl:Class stp:' + rootQueryObject.objectName + ' .');
                    }
                    routeRelatedObjects.forEach(function(routeRelatedObject) {
                        routeRelatedObject.forEach(function(relatedObject) {
                            if ((selectedConceptNames.indexOf(relatedObject.objectDisplayName) == -1) && (!relatedObject.isProperty))  {
                                selectedConceptNames.push(relatedObject.objectDisplayName);
                                conceptDeclarations.push('?' + relatedObject.objectDisplayName + ' owl:Class stp:' + relatedObject.objectName + ' .');
                            }
                        })
                    })
                    return conceptDeclarations;                    
                }

                function getPairRelations(rootQueryObject, routeRelatedObjects) {
                    var pairRelations = [];
                    for (var i = 0; i < routeRelatedObjects.length; i++) {
                        var routeRelatedObject = routeRelatedObjects[i];
                        if (routeRelatedObject.length > 0) {
                            var tempRelation = getRelationEx(rootQueryObject, routeRelatedObject[0])
                            if (pairRelations.indexOf(tempRelation) == -1) pairRelations.push(tempRelation);
                            
                            for (var j = 1; j < routeRelatedObject.length; j++) {
                                var relatedObject = routeRelatedObject[j];
                                var previousRelatedObject = routeRelatedObject[j-1];
                                var tempRelation = getRelationEx(routeRelatedObject[j-1], routeRelatedObject[j]);
                                if (pairRelations.indexOf(tempRelation) == -1) pairRelations.push(tempRelation);
                            }
                        }                        
                    }
                    return pairRelations;
                }

                function getRelationEx(node, nextNode) {
                    if ((nextNode.linkLabel == 'subClassOf') && (nextNode.direction !== -1))
                        return '?' + node.objectDisplayName + ' rdfs:' + nextNode.linkLabel + ' ?' + nextNode.objectDisplayName + ' .';
                    if ((nextNode.linkLabel == 'subClassOf') && (nextNode.direction == -1))
                        return ('?' + nextNode.objectDisplayName + ' rdfs:' + nextNode.linkLabel + ' ?' + node.objectDisplayName + ' .');
                    if ((nextNode.linkLabel !== 'subClassOf') && (nextNode.direction !== -1))
                        return ('?' + nextNode.objectDisplayName + ' stp:' + nextNode.linkLabel + ' ?' + node.objectDisplayName + ' .');
                    if ((nextNode.linkLabel !== 'subClassOf') && (nextNode.direction == -1))
                        return ('?' + node.objectDisplayName + ' stp:' + nextNode.linkLabel + ' ?' + nextNode.objectDisplayName + ' .');
                }

                function getReturnedItems(rootQueryObject, routeRelatedObjects) {
                    var returnedItems = [];
                    if (rootQueryObject.objectAttrs[0] !== undefined) 
                        if (rootQueryObject.objectAttrs[0].getValue)
                            returnedItems.push('?' + rootQueryObject.objectDisplayName);
                    routeRelatedObjects.forEach(function(routeRelatedObject) {
                        routeRelatedObject.forEach(function(relatedObject) {
                            if (relatedObject.objectAttrs[0] !== undefined)
                                if (relatedObject.objectAttrs[0].getValue)
                                    returnedItems.push('?' + relatedObject.objectDisplayName);
                        })
                    })
                    return returnedItems;
                }

                function getFilters(rootQueryObject, routeRelatedObjects) {
                    var filters = [];
                    if (rootQueryObject.objectAttrs[0] !== undefined) 
                        if (rootQueryObject.objectAttrs[0].attrValue !== '')
                        filters.push('?' + rootQueryObject.objectDisplayName + '= "' + rootQueryObject.objectAttrs[0].attrValue + '"^^<http://www.w3.org/2001/XMLSchema#string>' );
                    routeRelatedObjects.forEach(function(routeRelatedObject) {
                        routeRelatedObject.forEach(function(relatedObject) {
                            if (relatedObject.objectAttrs[0] !== undefined)
                                if (relatedObject.objectAttrs[0].attrValue !== '')
                                filters.push('?' + relatedObject.objectDisplayName + ' = "' + relatedObject.objectAttrs[0].attrValue + '"^^<http://www.w3.org/2001/XMLSchema#string>' );
                        })
                    })
                    return filters;
                }

                function getSPARQLQuery2(rootQueryObject, routeRelatedObjects) {
                    $scope.pairRelations = []; $scope.conceptDeclarations = {};
                    var sparql_query = []
                    var returnedItems = getReturnedItems(rootQueryObject, routeRelatedObjects);
                    
                    getConceptDeclarations2(rootQueryObject, routeRelatedObjects, $scope.conceptDeclarations);
                    getPairRelations2(rootQueryObject, routeRelatedObjects, $scope.pairRelations, $scope.conceptDeclarations);
                    var filters = getFilters(rootQueryObject, routeRelatedObjects);
                    
                    sparql_query.push('SELECT ' + returnedItems.join(' '));
                    sparql_query.push('{');
                    sparql_query.push(Object.values($scope.conceptDeclarations).join('\r\n'));                
                    sparql_query.push($scope.pairRelations.map(pairRelation => pairRelation.head + ' ' + pairRelation.relation + ' ' + pairRelation.tail + ' .').join('\r\n'));
                    if (filters.length > 0) sparql_query.push('FILTER (' + filters.join(') && (') + ')');
                    sparql_query.push('}');
    
                    writeFile('output_sparql.text', sparql_query.join('\r\n'));    
                }

                function getConceptDeclarations2(rootQueryObject, routeRelatedObjects, conceptDeclarations) {
                    var selectedConceptNames = [];
                    if (!rootQueryObject.isProperty) {
                        selectedConceptNames.push(rootQueryObject.objectDisplayName);                    
                        conceptDeclarations[rootQueryObject.objectDisplayName] = '?' + rootQueryObject.objectDisplayName + ' owl:Class stp:' + rootQueryObject.objectName + ' .';
                    }
                    routeRelatedObjects.forEach(function(routeRelatedObject) {
                        routeRelatedObject.forEach(function(relatedObject) {
                            if ((conceptDeclarations[relatedObject.objectDisplayName] === undefined) && (!relatedObject.isProperty)) {
                                selectedConceptNames.push(relatedObject.objectDisplayName);
                                conceptDeclarations[relatedObject.objectDisplayName] = '?' + relatedObject.objectDisplayName + ' owl:Class stp:' + relatedObject.objectName + ' .';
                            }
                        })
                    });                
                }
                
                function getPairRelations2(rootQueryObject, routeRelatedObjects, pairRelations, conceptDeclarations) {
                    for (var i = 0; i < routeRelatedObjects.length; i++) {
                        var routeRelatedObject = routeRelatedObjects[i];
                        if (routeRelatedObject.length > 0) {
                            var tempRelation = getRelationEx2(rootQueryObject, routeRelatedObject[0])
                            if (pairRelations.indexOf(tempRelation) == -1) pairRelations.push(tempRelation);
                            
                            for (var j = 1; j < routeRelatedObject.length; j++) {
                                var relatedObject = routeRelatedObject[j];
                                var previousRelatedObject = routeRelatedObject[j-1];
                                var tempRelation = getRelationEx2(routeRelatedObject[j-1], routeRelatedObject[j]);
                                if (pairRelations.indexOf(tempRelation) == -1) pairRelations.push(tempRelation);
                            }
                        }                        
                    }
                    removeSubClassOfRelation(pairRelations, conceptDeclarations);
                }

                function getRelationEx2(node, nextNode) {
                    if ((nextNode.linkLabel == 'subClassOf') && (nextNode.direction !== -1))
                        return {
                            'head': '?' + node.objectDisplayName,
                            'relation': 'rdfs:' + nextNode.linkLabel,
                            'tail': '?' + nextNode.objectDisplayName
                        }
                    if ((nextNode.linkLabel == 'subClassOf') && (nextNode.direction == -1))
                        return {
                            'head': '?' + nextNode.objectDisplayName,
                            'relation': 'rdfs:' + nextNode.linkLabel,
                            'tail': '?' + node.objectDisplayName
                        }                        
                    if ((nextNode.linkLabel !== 'subClassOf') && (nextNode.direction !== -1))
                        return {
                            'head': '?' + nextNode.objectDisplayName,
                            'relation': 'stp:' + nextNode.linkLabel,
                            'tail': '?' + node.objectDisplayName
                        }
                    if ((nextNode.linkLabel !== 'subClassOf') && (nextNode.direction == -1))
                        return {
                            'head': '?' + node.objectDisplayName,
                            'relation': 'stp:' + nextNode.linkLabel,
                            'tail': '?' + nextNode.objectDisplayName
                        }
                }

                function removeSubClassOfRelation(pairRelations, conceptDeclarations) {
                    var idxs = []
                    for (var i = 0; i < pairRelations.length; i++) {
                        if (pairRelations[i].relation == 'rdfs:subClassOf') {
                            idxs.push(i);
                            console.log(pairRelations);
                        }
                    }
                    if (idxs[0] !== undefined) {
                        var tempHead = pairRelations[idxs[0]].head;
                        var tempTail = pairRelations[idxs[0]].tail;
                        pairRelations.splice(idxs[0], 1);
                        delete conceptDeclarations[tempTail.slice(1)];
                        pairRelations.forEach(function(pairRelation) {
                            if (pairRelation.head == tempTail) {
                                pairRelation.head = tempHead;
                            }
                        })
                        removeSubClassOfRelation(pairRelations, conceptDeclarations)
                    }      
                }
                // function removeSubClassOfProps(rootQueryObject, routeRelatedObjects) {
                //     if 
                // }

                // var blob = new Blob([sparql_query.join("\r\n")], {type: "text/plain;charset=utf-8"});
                // saveAs(blob, "output_sparql.txt");                
            }

            $scope.queryExecuting = function(selectedQueryOption){
                $scope.t0 = performance.now();
                console.log($scope.t0);
                console.log($scope.rootQueryObject);
                console.log($scope.routeRelatedObjects);
                console.log($scope.userAccount);
                $scope.copiedRootQueryObject = $.extend({}, true, $scope.rootQueryObject);
                $scope.copiedRouteRelatedObjects = removeNonMappedDmObjectRelatedObject($scope.routeRelatedObjects);
                var listCheckExamTypeResult = checkExamTypeInQueryObjects($scope.copiedRootQueryObject, $scope.copiedRouteRelatedObjects);
                if (listCheckExamTypeResult.length === 0){
                    var check = getUserAccountValue();
                    if (check){
                        switch(selectedQueryOption.optionValue) {
                            case "onlyRootQueryObject":
                                switch($scope.resultWithClassif.optionValue) {
                                    case 1:
                                        getTxtQuery72($scope.copiedRootQueryObject, $scope.copiedRouteRelatedObjects); 
                                        break;
                                    case 2: 
                                        getTxtQuery7($scope.copiedRootQueryObject, $scope.copiedRouteRelatedObjects); 
                                        break;
                                }   
                                break;                          
                            case "getRelatedObjects":
                                getTxtQuery8($scope.copiedRootQueryObject, $scope.copiedRouteRelatedObjects);
                                $scope.t1 = performance.now();
                                console.log("Request execution time: " + ($scope.t1 - $scope.t0) + " ms.");
                                break;
                        }
                    }          
                }else{
                    $scope.d3QueryGraph = queryConcepts2d3QueryGraphCheckExamType(listCheckExamTypeResult);
                    displayD3QueryGraph($scope.d3QueryGraph);
                    $window.alert("Please selected the type of exam in at highlighted node");
                }
            };

            function checkExamTypeInQueryObjects(rootQueryObject, routeRelatedObjects) {
                var listCheckExamTypeResult = [];
                for (var i = 0; i < routeRelatedObjects.length; i++) {
                    for (var j = 0; j < routeRelatedObjects[i].length; j++) {
                        var checkExamTypeResult = {};
                        if (j === 0) {
                            checkExamTypeResult = checkExamType(rootQueryObject, routeRelatedObjects[i][0], i, 0);
                            if (checkExamTypeResult.routeIndex !== undefined) {
                                listCheckExamTypeResult.push(checkExamTypeResult);
                            } 
                        }else{
                            checkExamTypeResult = checkExamType(routeRelatedObjects[i][j-1], routeRelatedObjects[i][j], i, j);
                            if (checkExamTypeResult.routeIndex !== undefined) {
                                listCheckExamTypeResult.push(checkExamTypeResult);
                            }
                        }

                    }
                }
                return listCheckExamTypeResult;
                function checkExamType(primaryQueryObject, secondaryQueryObject, routeIndex, secondaryQueryObjectIndex) {
                    var tempCheckExamTypeResult = {};
                    if ((primaryQueryObject.mappedDmObjectType == "GIN4_StudySub") && ($scope.listCheckExamTypeDmObjectTypes.indexOf(secondaryQueryObject.mappedDmObjectType) !== -1)) {
                        // todo 
                        if (secondaryQueryObject.examType === undefined){
                            tempCheckExamTypeResult = {"routeIndex": routeIndex, "queryObjectIndex": secondaryQueryObjectIndex};
                        }
                    }else{
                        if ((secondaryQueryObject.mappedDmObjectType == "GIN4_StudySub") && ($scope.listCheckExamTypeDmObjectTypes.indexOf(primaryQueryObject.mappedDmObjectType) !== -1)) {
                            if (primaryQueryObject.examType === undefined) {
                                tempCheckExamTypeResult = {"routeIndex": routeIndex, "queryObjectIndex": secondaryQueryObjectIndex - 1};
                            }
                        }
                    }
                    return tempCheckExamTypeResult;
                }
            }   

            /**
             * [removeNonMappedDmObjectRelatedObject description]
             * This function remove all related objects which are mapped 
             * to any classes in the classification. This is used in the case of busOnto ontology.
             * @param  {[type]} routeRelatedObjects [description]
             * @return {[type]}                     [description]
             */
            function removeNonMappedDmObjectRelatedObject(routeRelatedObjects) {
                var tempRouteRelatedObjects = [];
                for (var i = 0; i < routeRelatedObjects.length; i++) {
                    var tempRouteRelatedObject = [];
                    for (var j = 0; j < routeRelatedObjects[i].length; j++) {
                        if (routeRelatedObjects[i][j].mappedDmObjectType !== "") {
                            tempRouteRelatedObject.push(routeRelatedObjects[i][j]);
                        }
                    }
                    tempRouteRelatedObjects.push(tempRouteRelatedObject);
                }
                return tempRouteRelatedObjects;
            }

            /**
             * [saveQuery description]
             * This function save the current query with the name entered by 
             * @param  {[type]} savedQueryName [description]
             * @return {[type]}                [description]
             */
            $scope.saveQuery = function(savedQueryName) {
                console.log(savedQueryName);
                if (savedQueryName === undefined) {
                    $window.alert("Please enter a name for the saved query.");
                }else{
                    var queryObjects = [];
                    for (var i = 0; i < $scope.routeRelatedObjects.length; i++) {
                        queryObjects.push($scope.routeRelatedObjects[i]);
                    }
                    queryObjects.push([$scope.rootQueryObject]);
                    writeFile(savedQueryName + ".txt", JSON.stringify(queryObjects));
                }
            };

            function getTxtQuery7(rootQueryObject, routeRelatedObjects){
                var username = "infodba", password = "infodba";
                if (($scope.userAccount.username !== undefined) && ($scope.userAccount.password !== undefined)){
                    username = $scope.userAccount.username;
                    password = $scope.userAccount.password;
                }
                // if ($scope.jsonFindClassificationResult == undefined)
                //  getClassifiedData();

                // var queryObjects = [];
                // for (var i = 0; i < routeRelatedObjects.length; i++) {
                //     var route = routeRelatedObjects[i];
                //     queryObjects.push(route);
                // }
                // var arrayQueryObject = [];
                // arrayQueryObject.push(rootQueryObject);
                // queryObjects.push(arrayQueryObject);
                
                // var blob = new Blob([JSON.stringify(queryObjects)], {type: "text/plain;charset=utf-8"});
                // saveAs(blob, $scope.queryName+ ".txt");

                $scope.queryConditions = [];
                var txtQueryContent = [];
                var today = new Date().toJSON().slice(0,10);
                var hours = new Date().toTimeString().slice(0,8);
                var queryObjectType = rootQueryObject.mappedDmObjectType;
                var queryClause = getQueryClause(rootQueryObject, queryObjectType, routeRelatedObjects); 
                $scope.queryName = getQueryName(rootQueryObject, routeRelatedObjects, today, hours);

                txtQueryContent.push('<plmxml_bus:PLMXMLBusinessTypes xmlns="http://www.plmxml.org/Schemas/PLMXMLSchema"');
                txtQueryContent.push(' xmlns:plmxml_bus="http://www.plmxml.org/Schemas/PLMXMLBusinessSchema"');
                txtQueryContent.push('schemaVersion="6" language="en-us" date="'+today+'" languages="en-us fr-fr de-de it-it es-es pt-br" time="'+hours+'" author="Teamcenter V10000.1.0.20130604.00 - infodba@IMC--2012094184(-2012094184)">');
                txtQueryContent.push('<plmxml_bus:SavedQueryDef id="id1" nameRef="#id2" name="'+$scope.queryName+'" queryFlag="0" queryClass="'+queryObjectType+'">');
                txtQueryContent.push('<plmxml_bus:QueryClause id="id3" stringValue="'+queryClause+'"><plmxml_bus:Description label="QueryTest"/></plmxml_bus:QueryClause></plmxml_bus:SavedQueryDef>');
                txtQueryContent.push('<plmxml_bus:Text id="id2" primary="en-us"></plmxml_bus:Text></plmxml_bus:PLMXMLBusinessTypes>');
            

                var blob = new Blob([txtQueryContent.join("\r\n")], {type: "text/plain;charset=utf-8"});
                saveAs(blob, $scope.queryName+"_importQB.txt");
                importQuery2QB(txtQueryContent.join("\r\n").split("{").join("&#123;").split("}").join("&#125;")); // in xquery file, we have to use "&#123"; for "{" and "&#125;" for "}"
               
                return txtQueryContent.join("\n");
                function getQueryName(rootQueryObject, routeRelatedObjects, today, hours){
                    var queryName = rootQueryObject.mappedDmObjectType;
                    for (var i = 0; i < routeRelatedObjects.length; i++) {
                        var length = routeRelatedObjects[i].length;
                        if (length !== 0)
                            queryName = queryName + "_" + routeRelatedObjects[i][length-1].mappedDmObjectType;
                    }
                    return queryName+"_"+today.replace(/-/g,"")+hours.replace(/:/g,"");
                }
                function getQueryClause(rootQueryObject,queryObjectType,routeRelatedObjects){
                    var conditionExpression = [];
                    var listPath = $scope.listPath;
                    getRootQueryObjectCondition(conditionExpression, rootQueryObject, "0");
                    for (var i = 0; i < routeRelatedObjects.length; i++) {
                        var routeRelatedObject = routeRelatedObjects[i];
                        var routePath = [];
                        for (var j = 0; j < routeRelatedObject.length; j++) {
                            var relatedObject = routeRelatedObject[j];
                            var foundPath = (j === 0) ? getPath(listPath, rootQueryObject, relatedObject) : getPath(listPath, routeRelatedObject[j-1], relatedObject);
                            routePath.push(foundPath);
                            var relatedObjectPosition = i+""+j;
                            getRelatedObjectCondition(conditionExpression, relatedObject, relatedObjectPosition, routePath.join("."));
                        }
                    }

                    var queryClause = "SELECT qid FROM " + queryObjectType + " WHERE" + conditionExpression.join(" AND ");
                    return queryClause;
                }
                function getRelatedObjectCondition(conditionExpression, relatedObject, relatedObjectPosition, route){
                    for (var i = 0; i < relatedObject.objectAttrs.length; i++) {
                        var attr = relatedObject.objectAttrs[i];
                        if ((attr.attrOperator !== "") && (attr.attrValue !== undefined)){
                            switch(attr.attrOrigin){
                                case "default":
                                    conditionExpression.push(" &quot;"+route+"."+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrName)+" = }&quot;");
                                    break;
                                case "master":
                                    conditionExpression.push(" &quot;"+route+"."+relatedObject.mappedDmObjectType+"MasterS:IMAN_master_form"+"."+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrName)+" = }&quot;");
                                    break;
                                default:
                                    conditionExpression.push(" &quot;"+route+"."+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrName)+" = }&quot;");
                            }
                            $scope.queryConditions.push({"attrName":standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrName),"attrOperator":attr.attrOperator,"attrValue":attr.attrValue});
                        } 
                    }
                    if (relatedObject.mappedTcClassId !== ""){
                        var tcClassAttrs = relatedObject.tcClassAttrs;
                        if (tcClassAttrs !== undefined){
                            for (var i = 0; i < tcClassAttrs.length; i++) {
                                var attr = tcClassAttrs[i];
                                if ((attr.attrOperator !== "") && (attr.attrValue !== undefined)){
                                    conditionExpression.push(" &quot;"+route+"."+"&lt;"+attr.attrParentId+"&gt;:IMAN_classification"+"."+attr.attrId+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrParentName+"."+attr.attrName)+" = }&quot;");
                                    $scope.queryConditions.push({"attrName":standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrParentName+"."+attr.attrName),"attrOperator":attr.attrOperator,"attrValue":attr.attrValue});
                                }
                            }
                        }
                    }
                } 
                function getRootQueryObjectCondition(conditionExpression, rootQueryObject, queryObjectPosition){
                    var attrs = rootQueryObject.objectAttrs;
                    for (var i = 0; i < attrs.length; i++) {
                        var attr = attrs[i];
                        if ((attr.attrOperator !== "") && (attr.attrValue !== undefined)){
                            switch(attr.attrOrigin) {
                                case "default":
                                    conditionExpression.push(" &quot;"+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrName)+" = }&quot;");
                                    break;
                                case "master":
                                    conditionExpression.push(" &quot;"+queryObjectType+"MasterS:IMAN_master_form"+"."+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrName)+" = }&quot;");
                                    break;
                                default:
                                    conditionExpression.push(" &quot;"+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrName)+" = }&quot;");
                            }
                            $scope.queryConditions.push({"attrName":standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrName),"attrOperator":attr.attrOperator,"attrValue":attr.attrValue});
                        }
                    }
                    if (rootQueryObject.mappedTcClassId !== ""){
                        var tcClassAttrs = rootQueryObject.tcClassAttrs;
                        if (tcClassAttrs !== undefined){
                            for (var i = 0; i < tcClassAttrs.length; i++) {
                                var attr = tcClassAttrs[i];
                                if ((attr.attrOperator !== "") && (attr.attrValue !== undefined)){
                                    conditionExpression.push(" &quot;&lt;"+attr.attrParentId+"&gt;:IMAN_classification"+"."+attr.attrId+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrParentName+"."+attr.attrName)+" = }&quot;");
                                    $scope.queryConditions.push({"attrName":standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrParentName+"."+attr.attrName),"attrOperator":attr.attrOperator,"attrValue":attr.attrValue});
                                }
                            }
                        }
                    }
                }
                
                function getPath2(listPath, sourceConcept, targetConcept){
                    var foundPath = "";
                    if ((sourceConcept.mappedDmObjectType == "GIN4_StudySub") && (targetConcept.mappedDmObjectType == "GIN4_Acquisition")){
                        switch(targetConcept.acquisitionType) {
                            case "Imaging":
                                foundPath = "GIN4_ExamRes:GIN4_rel_ExamResIMA.GIN4_Acquisition:GIN4_rel_Acquisition";
                                break;
                            case "Genetic":
                                foundPath = "GIN4_ExamRes:GIN4_rel_ExamResGEN.GIN4_Acquisition:GIN4_rel_Acquisition";
                                break;
                            case "Psychology":
                                foundPath = "GIN4_ExamRes:GIN4_rel_ExamResBEH.GIN4_Acquisition:GIN4_rel_Acquisition";
                                break;
                            case undefined:
                                foundPath = "GIN4_ExamRes:GIN4_rel_ExamResIMA.GIN4_Acquisition:GIN4_rel_Acquisition";
                                break;
                        }
                    }else{
                        if ((sourceConcept.mappedDmObjectType == "GIN4_Acquisition") && (targetConcept.mappedDmObjectType == "GIN4_StudySub")) {
                            switch(sourceConcept.acquisitionType) {
                                case "Imaging":
                                    foundPath = "GIN4_ExamRes&lt;-GIN4_rel_Acquisition.GIN4_StudySub&lt;-GIN4_rel_ExamResIMA";
                                    break;
                                case "Genetic":
                                    foundPath = "GIN4_ExamRes&lt;-GIN4_rel_Acquisition.GIN4_StudySub&lt;-GIN4_rel_ExamResGEN";
                                    break;
                                case "Psychology":
                                    foundPath = "GIN4_ExamRes&lt;-GIN4_rel_Acquisition.GIN4_StudySub&lt;-GIN4_rel_ExamResBEH";
                                    break;
                                case undefined:
                                    foundPath = "GIN4_ExamRes&lt;-GIN4_rel_Acquisition.GIN4_StudySub&lt;-GIN4_rel_ExamResIMA";
                                    break;
                            }
                        }else{
                            for (var i = 0; i < listPath.length; i++) {
                                var path = listPath[i];
                                if ((path.sourceObjectType == sourceConcept.mappedDmObjectType) && (path.targetObjectType == targetConcept.mappedDmObjectType)) {
                                    foundPath = path.path;
                                }
                            }
                        }
                    }
                    return foundPath;
                }

                function importQuery2QB(txtQueryContent){
                    $http.get("data/importQuery2QB_template.xq").success(function(data){
                        var xQueryContent = [];
                        xQueryContent.push(data);
                        xQueryContent.push("let $plmxml := "+txtQueryContent);
                        xQueryContent.push('return if(Teamcenter:importFromPLMXML($teamcenter,$plmxml)) then $plmxml else "ERROR"');
                        $http({
                            method  : 'POST',
                            url     : 'http://bio-mule-srv:8080/cadesis-spike-system-plm-teamcenter10/spike',
                            data    : $.param({
                                                        siTag:"Teamcenter10",
                                                        connectionMap: "KTCUrl=http://bio-tc-preprod:8080/tc;KTCUser="+username+";KTCPwd="+password+";KTCDisc=Disc1",
                                                        xqueryFileName: xQueryContent.join("\r\n"),
                                                        outputMethod: "xml"
                                                    }),
                            headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                        })
                        .success(function(data, status, headers, config) {
                            console.log("result"+data);
                            executeQuery();
                        })
                        .error(function(data, status, headers, config){
                            console.log("error"+data);
                        });
                        var blob = new Blob([xQueryContent.join("\r\n")], {type: "text/plain;charset=utf-8"});
                        saveAs(blob, "outputXQuery.xq");
                    });
                }

                function executeQuery(){
                    var executeXquery = [];
                    var attrList = '("KTCId","item_id","object_type","object_name","last_mod_date")';
                    executeXquery.push('xquery version "1.0";');
                    executeXquery.push('declare namespace Teamcenter="java:com.cadesis.spike.plm.teamcenter10.xquery.TCExtension";');
                    executeXquery.push('declare namespace local="local";');
                    executeXquery.push('declare variable $ParametersNode external;');
                    executeXquery.push('declare variable $teamcenter := Teamcenter:instance();');
                    executeXquery.push('<elements>');
                    executeXquery.push('{');
                    executeXquery.push('    let $attrList := '+attrList);
                    executeXquery.push('    let $query := <query query_name="'+$scope.queryName+'">');
                    for (var i = 0; i < $scope.queryConditions.length; i++) {
                        var condition = $scope.queryConditions[i];
                        if (condition.attrValue !== "")
                            executeXquery.push('                    <param name="'+condition.attrName+'" value="'+condition.attrValue+'"/>');
                    }
                    executeXquery.push('                  </query>');
                    executeXquery.push('    let $results := Teamcenter:Query($teamcenter, $query)');
                    executeXquery.push('    for $i in (1 to fn:count($results))');
                    executeXquery.push('    let $foundClasses := Teamcenter:getClassification($teamcenter, $results[$i], fn:false())');
                    executeXquery.push('    return');
                    executeXquery.push('        if (fn:empty($foundClasses))');
                    executeXquery.push('        then(');
                    executeXquery.push('                let $object :=');
                    executeXquery.push('                    <object KTCId="{$results[$i]/@KTCId}" objectType="{$results[$i]/@object_type}" objectName="{$results[$i]/@object_name}" objectId="{$results[$i]/@item_id}">');
                    executeXquery.push('                    </object>');
                    executeXquery.push('                return $object');
                    executeXquery.push('            )');
                    executeXquery.push('        else(');
                    executeXquery.push('                for $foundClass in $foundClasses');
                    executeXquery.push('                let $object :=');
                    executeXquery.push('                    <object KTCId="{$foundClass/@KTCId}" objectType="{$foundClass/@object_type}" objectName="{$foundClass/@object_name}" objectId="{$foundClass/@id}" tcClassId="{$foundClass/@cid}">');
                    executeXquery.push('                    {');
                    executeXquery.push('                      for $attr in $foundClass/ClassificationAttribute');
                    executeXquery.push('                      return');
                    executeXquery.push('                        <objectAttr attrName="{$attr/@name}" attrId="{$attr/@id}" attrValue="{$attr/@dbValue}">');
                    executeXquery.push('                        </objectAttr>');
                    executeXquery.push('                    }');
                    executeXquery.push('                    </object>');
                    executeXquery.push('                return $object');
                    executeXquery.push('            )');
                    executeXquery.push('}');
                    executeXquery.push('</elements>');

                    $http({
                            method  : 'POST',
                            url     : 'http://bio-mule-srv:8080/cadesis-spike-system-plm-teamcenter10/spike',
                            data    : $.param({
                                                        siTag:"Teamcenter10",
                                                        connectionMap: "KTCUrl=http://bio-tc-preprod:8080/tc;KTCUser="+username+";KTCPwd="+password+";KTCDisc=Disc1",
                                                        xqueryFileName: executeXquery.join("\r\n"),
                                                        outputMethod: "xml"
                                                    }),
                            headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                        })
                        .success(function(data, status, headers, config) {
                            var blob = new Blob([executeXquery.join("\r\n")], {type: "text/plain;charset=utf-8"});
                            saveAs(blob, "executeXquery.xq");
                            console.log("xQuery Result"+data);
                            var jsonResultWithClassAttrValue = $.xml2json(data).object;
                            if (jsonResultWithClassAttrValue === undefined){
                                $window.alert("No result");
                            }else{
                                jsonResultWithClassAttrValue = (jsonResultWithClassAttrValue.length === undefined) ? [jsonResultWithClassAttrValue] : jsonResultWithClassAttrValue;
                                $scope.jsonGroupedResultWithClassAttrValue = jsonResultWithClassAttrValue2jsonGroupedResultWithClassAttrValue(jsonResultWithClassAttrValue);
                                $scope.listGridResultWithClassAttrValue = jsonGroupedResultWithClassAttrValue2listGridResultWithClassAttrValue($scope.jsonGroupedResultWithClassAttrValue);
                                $scope.listGridResultWithClassAttrValueTableData = [];
                                var blob = new Blob([JSON.stringify($scope.jsonGroupedResultWithClassAttrValue)], {type: "text/plain;charset=utf-8"});
                                saveAs(blob, "jsonGroupedResultWithClassAttrValue.json");

                                var csvListGridResult = [];
                                if ($scope.listGridResultWithClassAttrValue.length !== 0){
                                    csvListGridResult = gridResultWithClassAttrValue2csvListGridResult($scope.listGridResultWithClassAttrValue);
                                }
                                var blob = new Blob([csvListGridResult.join("\r\n")], {type: "text/plain;charset=utf-8"});
                                saveAs(blob, "classified_results.csv");
                                
                                $scope.t1 = performance.now();
                                console.log("Request execution time: " + ($scope.t1 - $scope.t0) + " ms.");

                                if ($scope.rootQueryObject.mappedTcClassId === ""){
                                    for (var i = 0; i < $scope.listGridResultWithClassAttrValue.length; i++) {
                                        var tcClassId = $scope.listGridResultWithClassAttrValue[i].tcClassId;
                                        var tcClassName = $scope.listGridResultWithClassAttrValue[i].tcClassName;
                                        $scope.listGridResultWithClassAttrValueTableData.push({
                                            "tcClassId":tcClassId,
                                            "tcClassName":tcClassName,
                                            "gridTable":{
                                                data: "listGridResultWithClassAttrValue["+i+"].tableData",
                                                enablePinning:true,
                                                columnDefs:"listGridResultWithClassAttrValue["+i+"].colDefs",
                                                jqueryUIDraggable:true
                                            }
                                        });
                                    }
                                }else{
                                    for (var i = 0; i < $scope.listGridResultWithClassAttrValue.length; i++) {
                                        var tcClassId = $scope.listGridResultWithClassAttrValue[i].tcClassId;
                                        var tcClassName = $scope.listGridResultWithClassAttrValue[i].tcClassName;
                                        if (tcClassId == $scope.rootQueryObject.mappedTcClassId)
                                            $scope.listGridResultWithClassAttrValueTableData.push({
                                                "tcClassId":tcClassId,
                                                "tcClassName":tcClassName,
                                                "gridTable":{
                                                    data: "listGridResultWithClassAttrValue["+i+"].tableData",
                                                    enablePinning:true,
                                                    columnDefs:"listGridResultWithClassAttrValue["+i+"].colDefs",
                                                    jqueryUIDraggable:true
                                                }
                                            });
                                    }
                                }
                                console.log($scope.listGridResultWithClassAttrValue);                               
                            }

                            /*$scope.finalTableQueryResult = jsonResult2tableResult($scope.finalJsonQueryResult);

                            // getSelectedAttrValues($scope.KTCIds, $scope.rootQueryObject, $scope.routeRelatedObjects);
                            
                            $scope.gridClassAssociatedDataTable = {
                                data:"finalTableQueryResult.tableData",
                                enablePinning:true,
                                columnDefs:"finalTableQueryResult.colDefs",
                                jqueryUIDraggable:true
                            }

                            var modalInstance = $modal.open({
                              templateUrl: 'myModalContent.html',
                              controller: 'ModalInstanceCtrl',
                              size: "large",
                              resolve: {
                                resultTableData: function () {
                                  return $scope.jsonResultArray;
                                }
                              }
                            });*/

                        })
                        .error(function(data, status, headers, config){
                            console.log("error"+data);
                        });
                }
            }      

            function getTxtQuery72(rootQueryObject, routeRelatedObjects){
                var username = "infodba", password = "infodba";
                if (($scope.userAccount.username !== undefined) && ($scope.userAccount.password !== undefined)){
                    username = $scope.userAccount.username;
                    password = $scope.userAccount.password;
                }
                // if ($scope.jsonFindClassificationResult == undefined)
                //  getClassifiedData();

                // var queryObjects = [];
                // for (var i = 0; i < routeRelatedObjects.length; i++) {
                //     var route = routeRelatedObjects[i];
                //     queryObjects.push(route);
                // }
                // var arrayQueryObject = [];
                // arrayQueryObject.push(rootQueryObject);
                // queryObjects.push(arrayQueryObject);
                
                // var blob = new Blob([JSON.stringify(queryObjects)], {type: "text/plain;charset=utf-8"});
                // saveAs(blob, $scope.queryName+ ".txt");

                $scope.queryConditions = [];
                var txtQueryContent = [];
                var today = new Date().toJSON().slice(0,10);
                var hours = new Date().toTimeString().slice(0,8);
                var queryObjectType = rootQueryObject.mappedDmObjectType;
                var queryClause = getQueryClause(rootQueryObject, queryObjectType, routeRelatedObjects); 
                $scope.queryName = getQueryName(rootQueryObject, routeRelatedObjects, today, hours);

                txtQueryContent.push('<plmxml_bus:PLMXMLBusinessTypes xmlns="http://www.plmxml.org/Schemas/PLMXMLSchema"');
                txtQueryContent.push(' xmlns:plmxml_bus="http://www.plmxml.org/Schemas/PLMXMLBusinessSchema"');
                txtQueryContent.push('schemaVersion="6" language="en-us" date="'+today+'" languages="en-us fr-fr de-de it-it es-es pt-br" time="'+hours+'" author="Teamcenter V10000.1.0.20130604.00 - infodba@IMC--2012094184(-2012094184)">');
                txtQueryContent.push('<plmxml_bus:SavedQueryDef id="id1" nameRef="#id2" name="'+$scope.queryName+'" queryFlag="0" queryClass="'+queryObjectType+'">');
                txtQueryContent.push('<plmxml_bus:QueryClause id="id3" stringValue="'+queryClause+'"><plmxml_bus:Description label="QueryTest"/></plmxml_bus:QueryClause></plmxml_bus:SavedQueryDef>');
                txtQueryContent.push('<plmxml_bus:Text id="id2" primary="en-us"></plmxml_bus:Text></plmxml_bus:PLMXMLBusinessTypes>');
            

                var blob = new Blob([txtQueryContent.join("\r\n")], {type: "text/plain;charset=utf-8"});
                saveAs(blob, $scope.queryName+"_importQB.txt");
                importQuery2QB(txtQueryContent.join("\r\n").split("{").join("&#123;").split("}").join("&#125;")); // in xquery file, we have to use "&#123"; for "{" and "&#125;" for "}"
               
                return txtQueryContent.join("\n");
                function getQueryName(rootQueryObject, routeRelatedObjects, today, hours){
                    var queryName = rootQueryObject.mappedDmObjectType;
                    for (var i = 0; i < routeRelatedObjects.length; i++) {
                        var length = routeRelatedObjects[i].length;
                        if (length !== 0)
                            queryName = queryName + "_" + routeRelatedObjects[i][length-1].mappedDmObjectType;
                    }
                    return queryName+"_"+today.replace(/-/g,"")+hours.replace(/:/g,"");
                }
                function getQueryClause(rootQueryObject,queryObjectType,routeRelatedObjects){
                    var conditionExpression = [];
                    var listPath = $scope.listPath;
                    getRootQueryObjectCondition(conditionExpression, rootQueryObject, "0");
                    for (var i = 0; i < routeRelatedObjects.length; i++) {
                        var routeRelatedObject = routeRelatedObjects[i];
                        var routePath = [];
                        for (var j = 0; j < routeRelatedObject.length; j++) {
                            var relatedObject = routeRelatedObject[j];
                            var foundPath = (j === 0) ? getPath(listPath, rootQueryObject, relatedObject) : getPath(listPath, routeRelatedObject[j-1], relatedObject);
                            routePath.push(foundPath);
                            var relatedObjectPosition = i+""+j;
                            getRelatedObjectCondition(conditionExpression, relatedObject, relatedObjectPosition, routePath.join("."));
                        }
                    }

                    var queryClause = "SELECT qid FROM " + queryObjectType + " WHERE" + conditionExpression.join(" AND ");
                    return queryClause;
                }
                function getRelatedObjectCondition(conditionExpression, relatedObject, relatedObjectPosition, route){
                    for (var i = 0; i < relatedObject.objectAttrs.length; i++) {
                        var attr = relatedObject.objectAttrs[i];
                        if ((attr.attrOperator !== "") && (attr.attrValue !== undefined)){
                            switch(attr.attrOrigin){
                                case "default":
                                    conditionExpression.push(" &quot;"+route+"."+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrName)+" = }&quot;");
                                    break;
                                case "master":
                                    conditionExpression.push(" &quot;"+route+"."+relatedObject.mappedDmObjectType+"MasterS:IMAN_master_form"+"."+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrName)+" = }&quot;");
                                    break;
                                default:
                                    conditionExpression.push(" &quot;"+route+"."+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrName)+" = }&quot;");
                            }
                            $scope.queryConditions.push({"attrName":standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrName),"attrOperator":attr.attrOperator,"attrValue":attr.attrValue});
                        } 
                    }
                    if (relatedObject.mappedTcClassId !== ""){
                        var tcClassAttrs = relatedObject.tcClassAttrs;
                        if (tcClassAttrs !== undefined){
                            for (var i = 0; i < tcClassAttrs.length; i++) {
                                var attr = tcClassAttrs[i];
                                if ((attr.attrOperator !== "") && (attr.attrValue !== undefined)){
                                    conditionExpression.push(" &quot;"+route+"."+"&lt;"+attr.attrParentId+"&gt;:IMAN_classification"+"."+attr.attrId+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrParentName+"."+attr.attrName)+" = }&quot;");
                                    $scope.queryConditions.push({"attrName":standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrParentName+"."+attr.attrName),"attrOperator":attr.attrOperator,"attrValue":attr.attrValue});
                                }
                            }
                        }
                    }
                } 
                function getRootQueryObjectCondition(conditionExpression, rootQueryObject, queryObjectPosition){
                    var attrs = rootQueryObject.objectAttrs;
                    for (var i = 0; i < attrs.length; i++) {
                        var attr = attrs[i];
                        if ((attr.attrOperator !== "") && (attr.attrValue !== undefined)){
                            switch(attr.attrOrigin) {
                                case "default":
                                    conditionExpression.push(" &quot;"+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrName)+" = }&quot;");
                                    break;
                                case "master":
                                    conditionExpression.push(" &quot;"+queryObjectType+"MasterS:IMAN_master_form"+"."+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrName)+" = }&quot;");
                                    break;
                                default:
                                    conditionExpression.push(" &quot;"+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrName)+" = }&quot;");
                            }
                            $scope.queryConditions.push({"attrName":standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrName),"attrOperator":attr.attrOperator,"attrValue":attr.attrValue});
                        }
                    }
                    if (rootQueryObject.mappedTcClassId !== ""){
                        var tcClassAttrs = rootQueryObject.tcClassAttrs;
                        if (tcClassAttrs !== undefined){
                            for (var i = 0; i < tcClassAttrs.length; i++) {
                                var attr = tcClassAttrs[i];
                                if ((attr.attrOperator !== "") && (attr.attrValue !== undefined)){
                                    conditionExpression.push(" &quot;&lt;"+attr.attrParentId+"&gt;:IMAN_classification"+"."+attr.attrId+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrParentName+"."+attr.attrName)+" = }&quot;");
                                    $scope.queryConditions.push({"attrName":standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrParentName+"."+attr.attrName),"attrOperator":attr.attrOperator,"attrValue":attr.attrValue});
                                }
                            }
                        }
                    }
                }
                
                function getPath2(listPath, sourceConcept, targetConcept){
                    var foundPath = "";
                    if ((sourceConcept.mappedDmObjectType == "GIN4_StudySub") && (targetConcept.mappedDmObjectType == "GIN4_Acquisition")){
                        switch(targetConcept.acquisitionType) {
                            case "Imaging":
                                foundPath = "GIN4_ExamRes:GIN4_rel_ExamResIMA.GIN4_Acquisition:GIN4_rel_Acquisition";
                                break;
                            case "Genetic":
                                foundPath = "GIN4_ExamRes:GIN4_rel_ExamResGEN.GIN4_Acquisition:GIN4_rel_Acquisition";
                                break;
                            case "Psychology":
                                foundPath = "GIN4_ExamRes:GIN4_rel_ExamResBEH.GIN4_Acquisition:GIN4_rel_Acquisition";
                                break;
                            case undefined:
                                foundPath = "GIN4_ExamRes:GIN4_rel_ExamResIMA.GIN4_Acquisition:GIN4_rel_Acquisition";
                                break;
                        }
                    }else{
                        if ((sourceConcept.mappedDmObjectType == "GIN4_Acquisition") && (targetConcept.mappedDmObjectType == "GIN4_StudySub")) {
                            switch(sourceConcept.acquisitionType) {
                                case "Imaging":
                                    foundPath = "GIN4_ExamRes&lt;-GIN4_rel_Acquisition.GIN4_StudySub&lt;-GIN4_rel_ExamResIMA";
                                    break;
                                case "Genetic":
                                    foundPath = "GIN4_ExamRes&lt;-GIN4_rel_Acquisition.GIN4_StudySub&lt;-GIN4_rel_ExamResGEN";
                                    break;
                                case "Psychology":
                                    foundPath = "GIN4_ExamRes&lt;-GIN4_rel_Acquisition.GIN4_StudySub&lt;-GIN4_rel_ExamResBEH";
                                    break;
                                case undefined:
                                    foundPath = "GIN4_ExamRes&lt;-GIN4_rel_Acquisition.GIN4_StudySub&lt;-GIN4_rel_ExamResIMA";
                                    break;
                            }
                        }else{
                            for (var i = 0; i < listPath.length; i++) {
                                var path = listPath[i];
                                if ((path.sourceObjectType == sourceConcept.mappedDmObjectType) && (path.targetObjectType == targetConcept.mappedDmObjectType)) {
                                    foundPath = path.path;
                                }
                            }
                        }
                    }
                    return foundPath;
                }

                function importQuery2QB(txtQueryContent){
                    $http.get("data/importQuery2QB_template.xq").success(function(data){
                        var xQueryContent = [];
                        xQueryContent.push(data);
                        xQueryContent.push("let $plmxml := "+txtQueryContent);
                        xQueryContent.push('return if(Teamcenter:importFromPLMXML($teamcenter,$plmxml)) then $plmxml else "ERROR"');
                        $http({
                            method  : 'POST',
                            url     : 'http://bio-mule-srv:8080/cadesis-spike-system-plm-teamcenter10/spike',
                            data    : $.param({
                                                        siTag:"Teamcenter10",
                                                        connectionMap: "KTCUrl=http://bio-tc-preprod:8080/tc;KTCUser="+username+";KTCPwd="+password+";KTCDisc=Disc1",
                                                        xqueryFileName: xQueryContent.join("\r\n"),
                                                        outputMethod: "xml"
                                                    }),
                            headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                        })
                        .success(function(data, status, headers, config) {
                            console.log("result"+data);
                            executeQuery();
                        })
                        .error(function(data, status, headers, config){
                            console.log("error"+data);
                        });
                        var blob = new Blob([xQueryContent.join("\r\n")], {type: "text/plain;charset=utf-8"});
                        saveAs(blob, "outputXQuery.xq");
                    });
                }

                // This function get only results IDs.
                function executeQuery(){
                    var executeXquery = [];
                    var attrList = '("KTCId","item_id","object_type","object_name","last_mod_date")';
                    executeXquery.push('xquery version "1.0";');
                    executeXquery.push('declare namespace Teamcenter="java:com.cadesis.spike.plm.teamcenter10.xquery.TCExtension";');
                    executeXquery.push('declare namespace local="local";');
                    executeXquery.push('declare variable $ParametersNode external;');
                    executeXquery.push('declare variable $teamcenter := Teamcenter:instance();');
                    executeXquery.push('<elements>');
                    executeXquery.push('{');
                    executeXquery.push('    let $attrList := '+attrList);
                    executeXquery.push('    let $query := <query query_name="'+$scope.queryName+'">');
                    for (var i = 0; i < $scope.queryConditions.length; i++) {
                        var condition = $scope.queryConditions[i];
                        if (condition.attrValue !== "")
                            executeXquery.push('                    <param name="'+condition.attrName+'" value="'+condition.attrValue+'"/>');
                    }
                    executeXquery.push('                  </query>');
                    executeXquery.push('    let $results := Teamcenter:Query($teamcenter, $query)');
                    executeXquery.push('    for $i in (1 to fn:count($results))');
                    executeXquery.push('    return <object KTCId="{$results[$i]/@KTCId}" objectType="{$results[$i]/@object_type}" objectName="{$results[$i]/@object_name}" objectId="{$results[$i]/@item_id}"></object>');
                    executeXquery.push('}');
                    executeXquery.push('</elements>');

                    $http({
                            method  : 'POST',
                            url     : 'http://bio-mule-srv:8080/cadesis-spike-system-plm-teamcenter10/spike',
                            data    : $.param({
                                                        siTag:"Teamcenter10",
                                                        connectionMap: "KTCUrl=http://bio-tc-preprod:8080/tc;KTCUser="+username+";KTCPwd="+password+";KTCDisc=Disc1",
                                                        xqueryFileName: executeXquery.join("\r\n"),
                                                        outputMethod: "xml"
                                                    }),
                            headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                        })
                        .success(function(data, status, headers, config) {
                            var blob = new Blob([executeXquery.join("\r\n")], {type: "text/plain;charset=utf-8"});
                            saveAs(blob, "executeXquery.xq");
                            console.log("xQuery Result"+data);

                            var jsonResult = $.xml2json(data).object;
                                if (jsonResult === undefined){
                                    $window.alert("No result");
                                } else {
                                    // save json result into .txt file
                                    var blob = new Blob([JSON.stringify(jsonResult)], {type: "text/plain;charset=utf-8"});
                                    saveAs(blob, $scope.queryName+ "_results.txt");
                                    $window.alert(JSON.stringify(jsonResult));           

                                    // convert json result to .csv result
                                    jsonResult = (jsonResult.length === undefined) ? [jsonResult] : jsonResult;
                                    $scope.jsonGroupedResultWithClassAttrValue = jsonResultWithClassAttrValue2jsonGroupedResultWithClassAttrValue(jsonResult);
                                    $scope.listGridResultWithClassAttrValue = jsonGroupedResultWithClassAttrValue2listGridResultWithClassAttrValue($scope.jsonGroupedResultWithClassAttrValue);
                                    $scope.listGridResultWithClassAttrValueTableData = [];
                                    var blob = new Blob([JSON.stringify($scope.jsonGroupedResultWithClassAttrValue)], {type: "text/plain;charset=utf-8"});
                                    saveAs(blob, "jsonGroupedResultWithClassAttrValue.json");

                                    var csvListGridResult = [];
                                    if ($scope.listGridResultWithClassAttrValue.length !== 0){
                                        csvListGridResult = gridResultWithClassAttrValue2csvListGridResult($scope.listGridResultWithClassAttrValue);
                                    }
                                    var blob = new Blob([csvListGridResult.join("\r\n")], {type: "text/plain;charset=utf-8"});
                                    saveAs(blob, $scope.queryName+"_results.csv");      

                                }

                            $scope.t1 = performance.now();
                            console.log("Time to get only results Ids: " + ($scope.t1 - $scope.t0) + " ms.");
                          
                        })
                        .error(function(data, status, headers, config){
                            console.log("error"+data);
                        });
                }
            }      

            /**
             * [getTxtQuery8 description]
             * This function is used to get results with related object attributes
             * values. The idea here is, for each related object with existion defined
             * condition, we create a query in QueryBuilder to get all 
             * foundRelatedObjectIds, after that, we combine these Ids to have final 
             * results.
             * @return {[type]} [description]
             */
            function getTxtQuery8(rootQueryObject, routeRelatedObjects){
                // if ($scope.jsonFindClassificationResult == undefined)
                //  getClassifiedData();
                var username = "infodba", password = "infodba";
                if (($scope.userAccount.username !== undefined) && ($scope.userAccount.password !== undefined)){
                    username = $scope.userAccount.username;
                    password = $scope.userAccount.password;
                }
                
                // var queryObjects = [];
                // for (var i = 0; i < routeRelatedObjects.length; i++) {
                //     var route = routeRelatedObjects[i];
                //     queryObjects.push(route);
                // }
                // var arrayQueryObject = [];
                // arrayQueryObject.push(rootQueryObject);
                // queryObjects.push(arrayQueryObject);
                // var blob = new Blob([JSON.stringify(queryObjects)], {type: "text/plain;charset=utf-8"});
                // saveAs(blob, $scope.queryName+ ".txt");

                $scope.queryConditions = [];
                var txtQueryContent = [];
                var today = new Date().toJSON().slice(0,10);
                var hours = new Date().toTimeString().slice(0,8);
                var queryObjectType = rootQueryObject.mappedDmObjectType;
                var queryClause = getQueryClause(rootQueryObject, queryObjectType, routeRelatedObjects); 
                $scope.queryName = getQueryName(rootQueryObject, routeRelatedObjects, today, hours);



                txtQueryContent.push('<plmxml_bus:PLMXMLBusinessTypes xmlns="http://www.plmxml.org/Schemas/PLMXMLSchema"');
                txtQueryContent.push(' xmlns:plmxml_bus="http://www.plmxml.org/Schemas/PLMXMLBusinessSchema"');
                txtQueryContent.push('schemaVersion="6" language="en-us" date="'+today+'" languages="en-us fr-fr de-de it-it es-es pt-br" time="'+hours+'" author="Teamcenter V10000.1.0.20130604.00 - infodba@IMC--2012094184(-2012094184)">');
                txtQueryContent.push('<plmxml_bus:SavedQueryDef id="id1" nameRef="#id2" name="'+$scope.queryName+'" queryFlag="0" queryClass="'+queryObjectType+'">');
                txtQueryContent.push('<plmxml_bus:QueryClause id="id3" stringValue="'+queryClause+'"><plmxml_bus:Description label="QueryTest"/></plmxml_bus:QueryClause></plmxml_bus:SavedQueryDef>');
                txtQueryContent.push('<plmxml_bus:Text id="id2" primary="en-us"></plmxml_bus:Text></plmxml_bus:PLMXMLBusinessTypes>');
            

                var blob = new Blob([txtQueryContent.join("\r\n")], {type: "text/plain;charset=utf-8"});
                saveAs(blob, $scope.queryName+"_importQB.txt");
                $scope.queryRouteObject  = {
                    "queryName": $scope.queryName,
                    "conceptName":rootQueryObject.objectName,
                    "shortQueryName":$scope.rootQueryObject.mappedDmObjectType+"", // without today and hours
                    "queryConditions":[],
                    "conditionExpression":[],
                    "txtQueryContent":txtQueryContent.join("\r\n").split("{").join("&#123;").split("}").join("&#125;")  
                };
                // importQuery2QB(txtQueryContent.join("\r\n").split("{").join("&#123;").split("}").join("&#125;")); // in xquery file, we have to use "&#123"; for "{" and "&#125;" for "}"
                $scope.queryRouteRelatedObjects = [];
                
                getQueryRouteRelatedObjects(routeRelatedObjects, today, hours);
                
                importQueryRelatedObjectImportList2QB(getRelatedObjectQueryImportList($scope.queryRouteRelatedObjects));

                return txtQueryContent.join("\n");

                function getQueryName(rootQueryObject, routeRelatedObjects, today, hours){
                    var queryName = rootQueryObject.mappedDmObjectType;
                    for (var i = 0; i < routeRelatedObjects.length; i++) {
                        var length = routeRelatedObjects[i].length;
                        if (length !== 0)
                            queryName = queryName + "_" + routeRelatedObjects[i][length-1].mappedDmObjectType;
                    }
                    return queryName+"_"+today.replace(/-/g,"")+hours.replace(/:/g,"");
                }

                function getQueryRouteRelatedObjects(routeRelatedObjects, today, hours){
                    for (var i = 0; i < routeRelatedObjects.length; i++) {
                        $scope.queryRouteRelatedObjects.push([]);
                        var routeRelatedObject = routeRelatedObjects[i];
                        var routePath = [];
                        for (var j = 0; j < routeRelatedObject.length; j++) {
                            $scope.queryRouteRelatedObjects[i].push({});
                            var relatedObject = routeRelatedObject[j], relatedObjectPosition = i+""+j;
                            $scope.queryRouteRelatedObjects[i][j] = {
                                "queryName": "",
                                "conceptName":relatedObject.objectName,
                                "shortQueryName":"", // without today and hours
                                "queryConditions":[],
                                "conditionExpression":[],
                                "txtQueryContent":""                        
                            };
                            getQueryRelatedObjectCondition($scope.queryRouteRelatedObjects[i][j].conditionExpression, $scope.queryRouteRelatedObjects[i][j].queryConditions, relatedObject, relatedObjectPosition);
                            if ($scope.queryRouteRelatedObjects[i][j].conditionExpression.length !== 0){
                                $scope.queryRouteRelatedObjects[i][j].queryName = relatedObject.mappedDmObjectType+"_"+relatedObjectPosition+"_"+today.replace(/-/g,"")+hours.replace(/:/g,"");
                                $scope.queryRouteRelatedObjects[i][j].shortQueryName = relatedObject.mappedDmObjectType+"_"+relatedObjectPosition;
                                var txtQueryContent = getTxtQueryContentRelatedObject($scope.queryRouteRelatedObjects[i][j], relatedObject, today, hours);
                                $scope.queryRouteRelatedObjects[i][j].txtQueryContent = txtQueryContent;
                            }                   
                        }
                    }
                }

                function getResultsQueryRouteRelatedObjects(queryRouteRelatedObjects){
                    for (var i = 0; i < queryRouteRelatedObjects.length; i++) {
                        var queryRouteRelatedObject = queryRouteRelatedObjects[i];
                        for (var j = 0; j < queryRouteRelatedObject.length; j++) {
                            var queryRelatedObject = queryRouteRelatedObject[j];
                            if (queryRelatedObject.queryConditions.length !== 0){
                                importQueryRelatedObject2QB(queryRelatedObject);
                            }
                        }
                    }
                }

                function getRelatedObjectQueryImportList(queryRouteRelatedObjects){
                    var queryRelatedObjectImportList = [];
                    for (var i = 0; i < queryRouteRelatedObjects.length; i++) {
                        var queryRouteRelatedObject = queryRouteRelatedObjects[i];
                        for (var j = 0; j < queryRouteRelatedObject.length; j++) {
                            var queryRelatedObject = queryRouteRelatedObject[j];
                            if (queryRelatedObject.queryConditions.length !== 0){
                                queryRelatedObjectImportList.push(queryRelatedObject);
                            }
                        }
                    }
                    return queryRelatedObjectImportList;    
                }

                function importQueryRelatedObjectImportList2QB(queryRelatedObjectImportList){
                    $http.get("data/importQuery2QB_template.xq").success(function(data){
                        var xQueryContent = [];
                        xQueryContent.push(data);
                        xQueryContent.push("let $plmxml := "+queryRelatedObjectImportList[0].txtQueryContent);
                        xQueryContent.push('return if(Teamcenter:importFromPLMXML($teamcenter,$plmxml)) then $plmxml else "ERROR"');
                        $http({
                            method  : 'POST',
                            url     : 'http://bio-mule-srv:8080/cadesis-spike-system-plm-teamcenter10/spike',
                            data    : $.param({
                                                        siTag:"Teamcenter10",
                                                        connectionMap: "KTCUrl=http://bio-tc-preprod:8080/tc;KTCUser="+username+";KTCPwd="+password+";KTCDisc=Disc1",
                                                        xqueryFileName: xQueryContent.join("\r\n"),
                                                        outputMethod: "xml"
                                                    }),
                            headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                        })
                        .success(function(data, status, headers, config) {
                            console.log("result"+data);
                            queryRelatedObjectImportList.splice(0,1);
                            if (queryRelatedObjectImportList.length > 0){
                                importQueryRelatedObjectImportList2QB(queryRelatedObjectImportList);
                            }else{
                                console.log("Start to execute the final query");
                                importQueryRootObject2QB($scope.queryRouteObject.txtQueryContent);
                            }
                        })
                        .error(function(data, status, headers, config){
                            console.log("error"+data);
                        });
                    });
                }
                function importQueryRelatedObject2QB(queryRelatedObject){
                    $http.get("data/importQuery2QB_template.xq").success(function(data){
                        var xQueryContent = [];
                        xQueryContent.push(data);
                        xQueryContent.push("let $plmxml := "+queryRelatedObject.txtQueryContent);
                        xQueryContent.push('return if(Teamcenter:importFromPLMXML($teamcenter,$plmxml)) then $plmxml else "ERROR"');
                        $http({
                            method  : 'POST',
                            url     : 'http://bio-mule-srv:8080/cadesis-spike-system-plm-teamcenter10/spike',
                            data    : $.param({
                                                        siTag:"Teamcenter10",
                                                        connectionMap: "KTCUrl=http://bio-tc-preprod:8080/tc;KTCUser="+username+";KTCPwd="+password+";KTCDisc=Disc1",
                                                        xqueryFileName: xQueryContent.join("\r\n"),
                                                        outputMethod: "xml"
                                                    }),
                            headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                        })
                        .success(function(data, status, headers, config) {
                            console.log("result"+data);
                            // executeQueryRelatedObject(queryRelatedObject);
                        })
                        .error(function(data, status, headers, config){
                            console.log("error"+data);
                        });
                        var blob = new Blob([xQueryContent.join("\r\n")], {type: "text/plain;charset=utf-8"});
                        saveAs(blob, queryRelatedObject.queryName+"outputXQuery.xq");
                    });
                }
                function executeQueryRelatedObject(queryRelatedObject){
                    var executeXqueryRelatedObject = [];
                    executeXqueryRelatedObject.push('xquery version "1.0";');
                    executeXqueryRelatedObject.push('declare namespace Teamcenter="java:com.cadesis.spike.plm.teamcenter10.xquery.TCExtension";');
                    executeXqueryRelatedObject.push('declare namespace local="local";');
                    executeXqueryRelatedObject.push('declare variable $ParametersNode external;');
                    executeXqueryRelatedObject.push('declare variable $teamcenter := Teamcenter:instance();');
                    executeXqueryRelatedObject.push('<elements>');
                    executeXqueryRelatedObject.push('{');
                    executeXqueryRelatedObject.push('    let $query := <query query_name="'+queryRelatedObject.queryName+'">');
                    for (var i = 0; i < queryRelatedObject.queryConditions.length; i++) {
                        var condition = queryRelatedObject.queryConditions[i];
                        if (condition.attrValue !== "")
                            executeXqueryRelatedObject.push('                   <param name="'+condition.attrName+'" value="'+condition.attrValue+'"/>');
                    }
                    executeXqueryRelatedObject.push('                 </query>');
                    executeXqueryRelatedObject.push('    let $results := Teamcenter:Query($teamcenter, $query)');
                    executeXqueryRelatedObject.push('    for $i in (1 to fn:count($results))');
                    executeXqueryRelatedObject.push('    let $object :=');
                    executeXqueryRelatedObject.push('        <object KTCId="{$results[$i]/@KTCId}" objectId="{$results[$i]/@item_id}">');
                    executeXqueryRelatedObject.push('        </object>');
                    executeXqueryRelatedObject.push('    return $object');
                    executeXqueryRelatedObject.push('}');
                    executeXqueryRelatedObject.push('</elements>');

                    $http({
                            method  : 'POST',
                            url     : 'http://bio-mule-srv:8080/cadesis-spike-system-plm-teamcenter10/spike',
                            data    : $.param({
                                                        siTag:"Teamcenter10",
                                                        connectionMap: "KTCUrl=http://bio-tc-preprod:8080/tc;KTCUser="+username+";KTCPwd="+password+";KTCDisc=Disc1",
                                                        xqueryFileName: executeXqueryRelatedObject.join("\r\n"),
                                                        outputMethod: "xml"
                                                    }),
                            headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                        })
                        .success(function(data, status, headers, config) {
                            var blob = new Blob([executeXqueryRelatedObject.join("\r\n")], {type: "text/plain;charset=utf-8"});
                            saveAs(blob, "executeXqueryRelatedObject.xq");
                            console.log("xQuery Result"+data);
                            var jsonRelatedObjectResults = $.xml2json(data).object;
                            if (jsonRelatedObjectResults === undefined){
                                $window.alert("No result");
                            }else{
                                queryRelatedObject.results = jsonRelatedObjectResults;
                                $window.alert(JSON.stringify(jsonRelatedObjectResults));                            
                            }
                        })
                        .error(function(data, status, headers, config){
                            console.log("error"+data);
                            var blob = new Blob([executeXqueryRelatedObject.join("\r\n")], {type: "text/plain;charset=utf-8"});
                            saveAs(blob, "executeXqueryRelatedObject.xq");
                        })
                }

                function createRelatedObjectFunctionList(queryRouteRelatedObjects){
                    var functionList = [];
                    for (var i = 0; i < queryRouteRelatedObjects.length; i++) {
                        var queryRouteRelatedObject = queryRouteRelatedObjects[i];
                        for (var j = 0; j < queryRouteRelatedObject.length; j++) {
                            var queryRelatedObject = queryRouteRelatedObject[j];    
                            if (queryRelatedObject.queryConditions.length !== 0){
                                var newFunction = [];
                                newFunction.push('declare function local:'+queryRelatedObject.shortQueryName+'(){');
                                newFunction.push('    let $query := ');
                                newFunction.push('      <query query_name="'+queryRelatedObject.queryName+'">');
                                for (var k = 0; k < queryRelatedObject.queryConditions.length; k++) {
                                    var condition = queryRelatedObject.queryConditions[k];
                                    if (condition.attrValue !== "")
                                        newFunction.push('          <param name="'+condition.attrName+'" value="'+condition.attrValue+'"/>');
                                }
                                newFunction.push('      </query>');
                                newFunction.push('    let $results := ');
                                newFunction.push('      <elements>');
                                newFunction.push('      {');
                                newFunction.push('          let $foundObjects := Teamcenter:Query($teamcenter, $query)');
                                newFunction.push('          for $i in (1 to fn:count($foundObjects))');
                                newFunction.push('          let $foundObject :=');
                                newFunction.push('              <object KTCId="{$foundObjects[$i]/@KTCId}" objectId="{$foundObjects[$i]/@item_id}">');
                                newFunction.push('              </object>');
                                newFunction.push('          return $foundObject');
                                newFunction.push('      }');
                                newFunction.push('      </elements>');
                                newFunction.push('    return $results');
                                newFunction.push('};')
                                functionList.push(newFunction.join("\r\n"));
                            }
                        }
                    }
                    return functionList;
                }

                function createFoundRelatedObjectsList(queryRouteRelatedObjects){
                    var foundRelatedObjectsList = [];
                    for (var i = 0; i < queryRouteRelatedObjects.length; i++) {
                        var queryRouteRelatedObject = queryRouteRelatedObjects[i];
                        for (var j = 0; j < queryRouteRelatedObject.length; j++) {
                            var queryRelatedObject = queryRouteRelatedObject[j];
                            if (queryRelatedObject.queryConditions.length !== 0){
                                foundRelatedObjectsList.push('    let $foundAll'+queryRelatedObject.shortQueryName+'KTCIds := local:'+queryRelatedObject.shortQueryName+'()/object/@KTCId');
                            }
                        }
                    }
                    return foundRelatedObjectsList;
                }

                // -------------------------------------------------------------------- // 
                // This function gets only KTCIds.
                // -------------------------------------------------------------------- //
                function createXqFoundRelatedObjects2(rootQueryObject, queryRouteObject, routeRelatedObjects, queryRouteRelatedObjects){
                    var listPath = $scope.listPath;
                    var previousObject = rootQueryObject;
                    var xqFoundRelatedObjects = [];
                    // var returnRelatedObjectList = [];
                    for (var i = 0; i < queryRouteRelatedObjects.length; i++) {
                        var previousObject = rootQueryObject;
                        var previousQueryObject = queryRouteObject;
                        var previousCurrentObjectXQueryPath = [];
                        var queryRouteRelatedObject = queryRouteRelatedObjects[i];
                        for (var j = 0; j < queryRouteRelatedObject.length; j++) {
                            var queryRelatedObject = queryRouteRelatedObject[j];
                            var relatedObject = routeRelatedObjects[i][j];
                            if (queryRelatedObject.queryConditions.length !== 0){
                                var currentObject = relatedObject;
                                var currentQueryObject = queryRelatedObject;

                                var foundPath = (j === 0) ? getPath(listPath, rootQueryObject, relatedObject) : getPath(listPath, routeRelatedObjects[i][j-1], relatedObject);
                                previousCurrentObjectXQueryPath.push(path2xQueryPath(foundPath));

                                var xqFoundRelatedObject = [];
                                if (previousQueryObject == queryRouteObject){
                                    xqFoundRelatedObject.push('         \r\n');
                                    xqFoundRelatedObject.push('         let $found'+currentQueryObject.shortQueryName+'s := $found'+previousQueryObject.shortQueryName+'/'+previousCurrentObjectXQueryPath.join('/')+'[fn:exists(fn:index-of($foundAll'+currentQueryObject.shortQueryName+'KTCIds,./@KTCId'+'))]');
                                    xqFoundRelatedObject.push('         let $found'+currentQueryObject.shortQueryName+'KTCIds :=');
                                    xqFoundRelatedObject.push('             <'+currentQueryObject.shortQueryName+'KTCIds>');
                                    xqFoundRelatedObject.push('             {');
                                    xqFoundRelatedObject.push('                 fn:data($found'+currentQueryObject.shortQueryName+'s/@KTCId)');
                                    xqFoundRelatedObject.push('             }');
                                    xqFoundRelatedObject.push('             </'+currentQueryObject.shortQueryName+'KTCIds>');
                                    xqFoundRelatedObject.push('         ');
                                    xqFoundRelatedObject.push('         let $returnRelatedObjectList :='); 
                                    xqFoundRelatedObject.push('                     if (fn:empty(functx:value-intersect($returnRelatedObjectKTCIds,fn:string($found'+currentQueryObject.shortQueryName+'KTCIds))))');
                                    xqFoundRelatedObject.push('                     then ($returnRelatedObjectList, $found'+currentQueryObject.shortQueryName+'KTCIds)'); 
                                    xqFoundRelatedObject.push('                     else ($returnRelatedObjectList)'); 
                                    xqFoundRelatedObject.push('         let $returnRelatedObjectKTCIds :='); 
                                    xqFoundRelatedObject.push('                     if (fn:empty(functx:value-intersect($returnRelatedObjectKTCIds,fn:string($found'+currentQueryObject.shortQueryName+'KTCIds))))');
                                    xqFoundRelatedObject.push('                     then ($returnRelatedObjectKTCIds,fn:string( $found'+currentQueryObject.shortQueryName+'KTCIds))'); 
                                    xqFoundRelatedObject.push('                     else ($returnRelatedObjectKTCIds)'); 
                                }else{
                                    xqFoundRelatedObject.push('         \r\n');
                                    xqFoundRelatedObject.push('         let $found'+currentQueryObject.shortQueryName+'s :=');
                                    xqFoundRelatedObject.push('             for $found'+previousQueryObject.shortQueryName+' in $found'+previousQueryObject.shortQueryName+'s');
                                    xqFoundRelatedObject.push('             return $found'+previousQueryObject.shortQueryName+'/'+previousCurrentObjectXQueryPath.join('/')+'[fn:exists(fn:index-of($foundAll'+currentQueryObject.shortQueryName+'KTCIds,./@KTCId'+'))]');
                                    xqFoundRelatedObject.push('         let $found'+currentQueryObject.shortQueryName+'KTCIds :=');
                                    xqFoundRelatedObject.push('             <'+currentQueryObject.shortQueryName+'KTCIds>');
                                    xqFoundRelatedObject.push('             {');
                                    xqFoundRelatedObject.push('                 fn:data($found'+currentQueryObject.shortQueryName+'s/@KTCId)');
                                    xqFoundRelatedObject.push('             }');
                                    xqFoundRelatedObject.push('             </'+currentQueryObject.shortQueryName+'KTCIds>');
                                    xqFoundRelatedObject.push('         ');
                                    xqFoundRelatedObject.push('         let $returnRelatedObjectList :='); 
                                    xqFoundRelatedObject.push('                     if (fn:empty(functx:value-intersect($returnRelatedObjectKTCIds,fn:string($found'+currentQueryObject.shortQueryName+'KTCIds))))');
                                    xqFoundRelatedObject.push('                     then ($returnRelatedObjectList, $found'+currentQueryObject.shortQueryName+'KTCIds)'); 
                                    xqFoundRelatedObject.push('                     else ($returnRelatedObjectList)');
                                    xqFoundRelatedObject.push('         let $returnRelatedObjectKTCIds :='); 
                                    xqFoundRelatedObject.push('                     if (fn:empty(functx:value-intersect($returnRelatedObjectKTCIds,fn:string($found'+currentQueryObject.shortQueryName+'KTCIds))))');
                                    xqFoundRelatedObject.push('                     then ($returnRelatedObjectKTCIds,fn:string( $found'+currentQueryObject.shortQueryName+'KTCIds))'); 
                                    xqFoundRelatedObject.push('                     else ($returnRelatedObjectKTCIds)'); 

                                }


                                /*xqFoundRelatedObject.push('           <'+currentQueryObject.shortQueryName+'s>');
                                xqFoundRelatedObject.push('         {');
                                xqFoundRelatedObject.push('             let $found'+queryRelatedObject.shortQueryName+'KTCIds := $found'+previousQueryObject.shortQueryName+'/'+previousCurrentObjectXQueryPath.join('/')+'[fn:exists(fn:index-of($foundAll'+currentQueryObject.shortQueryName+'KTCIds,./@KTCId'+'))]/@KTCId');
                                xqFoundRelatedObject.push('             return fn:data($found'+queryRelatedObject.shortQueryName+'KTCIds)');
                                xqFoundRelatedObject.push('         }');
                                xqFoundRelatedObject.push('         </'+currentQueryObject.shortQueryName+'s>');*/

                                xqFoundRelatedObjects.push(xqFoundRelatedObject.join('\r\n'));
                                previousQueryObject = queryRelatedObject;
                                previousCurrentObjectXQueryPath = [];
                                // returnRelatedObjectList.push("$found"+queryRelatedObject.shortQueryName+"KTCIds"); 
                            }else{
                                var foundPath = (j === 0) ? getPath(listPath, rootQueryObject, relatedObject) : getPath(listPath, routeRelatedObjects[i][j-1], relatedObject);
                                previousCurrentObjectXQueryPath.push(path2xQueryPath(foundPath));
                            }
                        }
                    }
                    // xqFoundRelatedObjects.push('         return('+returnRelatedObjectList.join(',')+')');
                    return xqFoundRelatedObjects;
                }

                // -------------------------------------------------------------------- // 
                // This function get all classified information related to found object.
                // -------------------------------------------------------------------- //
                function createXqFoundRelatedObjects(rootQueryObject, queryRouteObject, routeRelatedObjects, queryRouteRelatedObjects){
                    var listPath = $scope.listPath;
                    var previousObject = rootQueryObject;
                    var xqFoundRelatedObjects = [];
                    // var returnRelatedObjectList = [];
                    for (var i = 0; i < queryRouteRelatedObjects.length; i++) {
                        var previousObject = rootQueryObject;
                        var previousQueryObject = queryRouteObject;
                        var previousCurrentObjectXQueryPath = [];
                        var queryRouteRelatedObject = queryRouteRelatedObjects[i];
                        for (var j = 0; j < queryRouteRelatedObject.length; j++) {
                            var queryRelatedObject = queryRouteRelatedObject[j];
                            var relatedObject = routeRelatedObjects[i][j];
                            if (queryRelatedObject.queryConditions.length !== 0){
                                var currentObject = relatedObject;
                                var currentQueryObject = queryRelatedObject;

                                var foundPath = (j === 0) ? getPath(listPath, rootQueryObject, relatedObject) : getPath(listPath, routeRelatedObjects[i][j-1], relatedObject);
                                previousCurrentObjectXQueryPath.push(path2xQueryPath(foundPath));

                                var xqFoundRelatedObject = [];
                                var path2rootQueryObject = previousQueryObject.shortQueryName+'/'+previousCurrentObjectXQueryPath.join('/');
                                if (previousQueryObject == queryRouteObject){                                    
                                    xqFoundRelatedObject.push('         \r\n');
                                    xqFoundRelatedObject.push('         let $found'+currentQueryObject.shortQueryName+'s := $found'+previousQueryObject.shortQueryName+'/'+previousCurrentObjectXQueryPath.join('/')+'[fn:exists(fn:index-of($foundAll'+currentQueryObject.shortQueryName+'KTCIds,./@KTCId'+'))]');
                                    xqFoundRelatedObject.push('         let $returnFound'+currentQueryObject.shortQueryName+' :='); //+currentQueryObject.shortQueryName+'TCs :=');
                                    xqFoundRelatedObject.push('             for $found'+currentQueryObject.shortQueryName+' in $found'+currentQueryObject.shortQueryName+'s');
                                    xqFoundRelatedObject.push('             return if (fn:exists(fn:index-of($returnRelatedObjectKTCIds,$found'+currentQueryObject.shortQueryName+'/@KTCId)))');
                                    xqFoundRelatedObject.push('             then ()');
                                    xqFoundRelatedObject.push('             else (');
                                    xqFoundRelatedObject.push('                 let $returnRelatedObjectKTCIds := fn:insert-before($returnRelatedObjectKTCIds,0,fn:data($found'+currentQueryObject.shortQueryName+'/@KTCId))');             
                                    xqFoundRelatedObject.push('                 let $foundClasses := Teamcenter:getClassification($teamcenter, $found'+currentQueryObject.shortQueryName+', fn:false())');
                                    xqFoundRelatedObject.push('                 return');
                                    xqFoundRelatedObject.push('                     if (fn:empty($foundClasses))');
                                    xqFoundRelatedObject.push('                     then(');
                                    xqFoundRelatedObject.push('                         let $relatedObject :=');
                                    xqFoundRelatedObject.push('                             <relatedObject path2rootQueryObject="'+path2rootQueryObject+'" conceptName="'+currentQueryObject.conceptName+'" KTCId="{$found'+currentQueryObject.shortQueryName+'/@KTCId}" objectType="{$found'+currentQueryObject.shortQueryName+'/@object_type}" objectName="{$found'+currentQueryObject.shortQueryName+'/@object_name}" objectId="{$found'+currentQueryObject.shortQueryName+'/@item_id}">');
                                    xqFoundRelatedObject.push('                             </relatedObject>');
                                    xqFoundRelatedObject.push('                         return $relatedObject');
                                    xqFoundRelatedObject.push('                     )');
                                    xqFoundRelatedObject.push('                     else(');
                                    xqFoundRelatedObject.push('                         for $foundClass in $foundClasses');
                                    xqFoundRelatedObject.push('                         let $relatedObject :=');
                                    xqFoundRelatedObject.push('                             <relatedObject path2rootQueryObject="'+path2rootQueryObject+'" conceptName="'+currentQueryObject.conceptName+'" KTCId="{$foundClass/@KTCId}" objectName="{$foundClass/@object_name}" objectId="{$foundClass/@id}" tcClassId="{$foundClass/@cid}">');
                                    xqFoundRelatedObject.push('                             {');
                                    xqFoundRelatedObject.push('                                 for $attr in $foundClass/ClassificationAttribute');
                                    xqFoundRelatedObject.push('                                 return');
                                    xqFoundRelatedObject.push('                                     <objectAttr attrName="{$attr/@name}" attrId="{$attr/@id}" attrValue="{$attr/@dbValue}">');
                                    xqFoundRelatedObject.push('                                     </objectAttr>');
                                    xqFoundRelatedObject.push('                             }');
                                    xqFoundRelatedObject.push('                             </relatedObject>');
                                    xqFoundRelatedObject.push('                         return $relatedObject');
                                    xqFoundRelatedObject.push('                     )');
                                    xqFoundRelatedObject.push('             )');
                                    xqFoundRelatedObject.push('         let $returnRelatedObjectList := fn:insert-before($returnRelatedObjectList,0,$returnFound'+currentQueryObject.shortQueryName+')');
                                }else{
                                    xqFoundRelatedObject.push('         \r\n');
                                    xqFoundRelatedObject.push('         let $found'+currentQueryObject.shortQueryName+'s :=');
                                    xqFoundRelatedObject.push('             for $found'+previousQueryObject.shortQueryName+' in $found'+previousQueryObject.shortQueryName+'s');
                                    xqFoundRelatedObject.push('             return $found'+previousQueryObject.shortQueryName+'/'+previousCurrentObjectXQueryPath.join('/')+'[fn:exists(fn:index-of($foundAll'+currentQueryObject.shortQueryName+'KTCIds,./@KTCId'+'))]');
                                    xqFoundRelatedObject.push('         let $returnFound'+currentQueryObject.shortQueryName+' :='); //+currentQueryObject.shortQueryName+'TCs :=');
                                    xqFoundRelatedObject.push('             for $found'+currentQueryObject.shortQueryName+' in $found'+currentQueryObject.shortQueryName+'s');
                                    xqFoundRelatedObject.push('             return if (fn:exists(fn:index-of($returnRelatedObjectKTCIds,$found'+currentQueryObject.shortQueryName+'/@KTCId)))');
                                    xqFoundRelatedObject.push('             then ()');
                                    xqFoundRelatedObject.push('             else (');
                                    xqFoundRelatedObject.push('                 let $returnRelatedObjectKTCIds := fn:insert-before($returnRelatedObjectKTCIds,0,fn:data($found'+currentQueryObject.shortQueryName+'/@KTCId))');             
                                    xqFoundRelatedObject.push('                 let $foundClasses := Teamcenter:getClassification($teamcenter, $found'+currentQueryObject.shortQueryName+', fn:false())');
                                    xqFoundRelatedObject.push('                 return');
                                    xqFoundRelatedObject.push('                     if (fn:empty($foundClasses))');
                                    xqFoundRelatedObject.push('                     then(');
                                    xqFoundRelatedObject.push('                         let $relatedObject :=');
                                    xqFoundRelatedObject.push('                             <relatedObject path2rootQueryObject="'+path2rootQueryObject+'" conceptName="'+currentQueryObject.conceptName+'" KTCId="{$found'+currentQueryObject.shortQueryName+'/@KTCId}" objectType="{$found'+currentQueryObject.shortQueryName+'/@object_type}" objectName="{$found'+currentQueryObject.shortQueryName+'/@object_name}" objectId="{$found'+currentQueryObject.shortQueryName+'/@item_id}">');
                                    xqFoundRelatedObject.push('                             </relatedObject>');
                                    xqFoundRelatedObject.push('                         return $relatedObject');
                                    xqFoundRelatedObject.push('                     )');
                                    xqFoundRelatedObject.push('                     else(');
                                    xqFoundRelatedObject.push('                         for $foundClass in $foundClasses');
                                    xqFoundRelatedObject.push('                         let $relatedObject :=');
                                    xqFoundRelatedObject.push('                             <relatedObject path2rootQueryObject="'+path2rootQueryObject+'" conceptName="'+currentQueryObject.conceptName+'" KTCId="{$foundClass/@KTCId}" objectName="{$foundClass/@object_name}" objectId="{$foundClass/@id}" tcClassId="{$foundClass/@cid}">');
                                    xqFoundRelatedObject.push('                             {');
                                    xqFoundRelatedObject.push('                                 for $attr in $foundClass/ClassificationAttribute');
                                    xqFoundRelatedObject.push('                                 return');
                                    xqFoundRelatedObject.push('                                     <objectAttr attrName="{$attr/@name}" attrId="{$attr/@id}" attrValue="{$attr/@dbValue}">');
                                    xqFoundRelatedObject.push('                                     </objectAttr>');
                                    xqFoundRelatedObject.push('                             }');
                                    xqFoundRelatedObject.push('                             </relatedObject>');
                                    xqFoundRelatedObject.push('                         return $relatedObject');
                                    xqFoundRelatedObject.push('                     )');
                                    xqFoundRelatedObject.push('             )');
                                    xqFoundRelatedObject.push('         let $returnRelatedObjectList := fn:insert-before($returnRelatedObjectList,0,$returnFound'+currentQueryObject.shortQueryName+')');
                                }

                                xqFoundRelatedObjects.push(xqFoundRelatedObject.join('\r\n'));
                                previousQueryObject = queryRelatedObject;
                                previousCurrentObjectXQueryPath = [];
                                // returnRelatedObjectList.push("$found"+queryRelatedObject.shortQueryName+"KTCIds"); 
                            }else{
                                var foundPath = (j === 0) ? getPath(listPath, rootQueryObject, relatedObject) : getPath(listPath, routeRelatedObjects[i][j-1], relatedObject);
                                previousCurrentObjectXQueryPath.push(path2xQueryPath(foundPath));
                            }
                        }
                    }
                    // xqFoundRelatedObjects.push('         return('+returnRelatedObjectList.join(',')+')');
                    return xqFoundRelatedObjects;
                }

                function path2xQueryPath(path){
                    var xQueryPaths = [];
                    var subPaths = path.split(".");
                    for (var i = 0; i < subPaths.length; i++) {
                        var subPath = subPaths[i];
                        if (subPath.indexOf("&lt;-") !== -1){
                            var splitSubPaths = subPath.split("&lt;-");
                            xQueryPaths.push("B_"+splitSubPaths[1]+"/"+splitSubPaths[0]);
                        }else{
                            var splitSubPaths = subPath.split(":");
                            xQueryPaths.push("F_"+splitSubPaths[1]+"/"+splitSubPaths[0]);
                        }
                    }
                    return xQueryPaths.join('/');
                }

                function getQueryClause(rootQueryObject,queryObjectType,routeRelatedObjects){
                    var conditionExpression = [];
                    var listPath = $scope.listPath;
                    getRootQueryObjectCondition(conditionExpression, rootQueryObject, "0");
                    for (var i = 0; i < routeRelatedObjects.length; i++) {
                        var routeRelatedObject = routeRelatedObjects[i];
                        var routePath = [];
                        for (var j = 0; j < routeRelatedObject.length; j++) {
                            var relatedObject = routeRelatedObject[j];
                            var foundPath = (j === 0) ? getPath(listPath, rootQueryObject, relatedObject) : getPath(listPath, routeRelatedObject[j-1], relatedObject);
                            routePath.push(foundPath);
                            var relatedObjectPosition = i+""+j;
                            getRelatedObjectCondition(conditionExpression, relatedObject, relatedObjectPosition, routePath.join("."));
                        }
                    }

                    var queryClause = "SELECT qid FROM " + queryObjectType + " WHERE" + conditionExpression.join(" AND ");
                    return queryClause;
                }

                function getTxtQueryContentRelatedObject(queryRelatedObject,relatedObject, today, hours){
                    var txtQueryContentRelatedObject = [];
                    var relatedObjectQueryClause = "SELECT qid FROM " + relatedObject.mappedDmObjectType + " WHERE" + queryRelatedObject.conditionExpression.join(" AND ");
                    txtQueryContentRelatedObject.push('<plmxml_bus:PLMXMLBusinessTypes xmlns="http://www.plmxml.org/Schemas/PLMXMLSchema"');
                    txtQueryContentRelatedObject.push(' xmlns:plmxml_bus="http://www.plmxml.org/Schemas/PLMXMLBusinessSchema"');
                    txtQueryContentRelatedObject.push('schemaVersion="6" language="en-us" date="'+today+'" languages="en-us fr-fr de-de it-it es-es pt-br" time="'+hours+'" author="Teamcenter V10000.1.0.20130604.00 - infodba@IMC--2012094184(-2012094184)">');
                    txtQueryContentRelatedObject.push('<plmxml_bus:SavedQueryDef id="id1" nameRef="#id2" name="'+queryRelatedObject.queryName+'" queryFlag="0" queryClass="'+relatedObject.mappedDmObjectType+'">');
                    txtQueryContentRelatedObject.push('<plmxml_bus:QueryClause id="id3" stringValue="'+relatedObjectQueryClause+'"><plmxml_bus:Description label="QueryTest"/></plmxml_bus:QueryClause></plmxml_bus:SavedQueryDef>');
                    txtQueryContentRelatedObject.push('<plmxml_bus:Text id="id2" primary="en-us"></plmxml_bus:Text></plmxml_bus:PLMXMLBusinessTypes>');
                

                    var blob = new Blob([txtQueryContentRelatedObject.join("\r\n")], {type: "text/plain;charset=utf-8"});
                    saveAs(blob, queryRelatedObject.queryName+"_importQB.txt");
                    // importQuery2QB(txtQueryContentRelatedObject.join("\r\n").split("{").join("&#123;").split("}").join("&#125;")); // in xquery file, we have to use "&#123"; for "{" and "&#125;" for "}"
                    return txtQueryContentRelatedObject.join("\n").split("{").join("&#123;").split("}").join("&#125;");;
                }


                function getRootQueryObjectCondition(conditionExpression, rootQueryObject, queryObjectPosition){
                    var attrs = rootQueryObject.objectAttrs;
                    for (var i = 0; i < attrs.length; i++) {
                        var attr = attrs[i];
                        if ((attr.attrOperator !== "") && (attr.attrValue !== undefined)){
                            switch(attr.attrOrigin) {
                                case "default":
                                    conditionExpression.push(" &quot;"+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrName)+" = }&quot;");
                                    break;
                                case "master":
                                    conditionExpression.push(" &quot;"+queryObjectType+"MasterS:IMAN_master_form"+"."+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrName)+" = }&quot;");
                                    break;
                                default:
                                    conditionExpression.push(" &quot;"+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrName)+" = }&quot;");
                            }
                            $scope.queryConditions.push({"attrName":standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrName),"attrOperator":attr.attrOperator,"attrValue":attr.attrValue});
                        }
                    }
                    var tcClassAttrs = rootQueryObject.tcClassAttrs;
                    if (tcClassAttrs !== undefined){
                        for (var i = 0; i < tcClassAttrs.length; i++) {
                            var attr = tcClassAttrs[i];
                            if ((attr.attrOperator !== "") && (attr.attrValue !== undefined)){
                                conditionExpression.push(" &quot;&lt;"+attr.attrParentId+"&gt;:IMAN_classification"+"."+attr.attrId+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrParentName+"."+attr.attrName)+" = }&quot;");
                                $scope.queryConditions.push({"attrName":standizeName(rootQueryObject.objectName+queryObjectPosition+"."+attr.attrParentName+"."+attr.attrName),"attrOperator":attr.attrOperator,"attrValue":attr.attrValue});
                            }
                        }
                    }
                }

                function getRelatedObjectCondition(conditionExpression, relatedObject, relatedObjectPosition, route){
                    for (var i = 0; i < relatedObject.objectAttrs.length; i++) {
                        var attr = relatedObject.objectAttrs[i];
                        if ((attr.attrOperator !== "") && (attr.attrValue !== undefined)){
                            switch(attr.attrOrigin){
                                case "default":
                                    conditionExpression.push(" &quot;"+route+"."+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrName)+" = }&quot;");
                                    break;
                                case "master":
                                    conditionExpression.push(" &quot;"+route+"."+relatedObject.mappedDmObjectType+"MasterS:IMAN_master_form"+"."+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrName)+" = }&quot;");
                                    break;
                                default:
                                    conditionExpression.push(" &quot;"+route+"."+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrName)+" = }&quot;");
                            }
                            $scope.queryConditions.push({"attrName":standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrName),"attrOperator":attr.attrOperator,"attrValue":attr.attrValue});
                        } 
                    }
                    var tcClassAttrs = relatedObject.tcClassAttrs;
                    if (tcClassAttrs !== undefined){
                        for (var i = 0; i < tcClassAttrs.length; i++) {
                            var attr = tcClassAttrs[i];
                            if ((attr.attrOperator !== "") && (attr.attrValue !== undefined)){
                                conditionExpression.push(" &quot;"+route+"."+"&lt;"+attr.attrParentId+"&gt;:IMAN_classification"+"."+attr.attrId+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrParentName+"."+attr.attrName)+" = }&quot;");
                                $scope.queryConditions.push({"attrName":standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrParentName+"."+attr.attrName),"attrOperator":attr.attrOperator,"attrValue":attr.attrValue});
                            }
                        }
                    }
                }

                function getCurrentRelatedObjectCondition(conditionExpression, currentRelatedObjectConditions, currentRelatedObject, currentRelatedObjectPosition){
                    var attrs = currentRelatedObject.currentRelatedObjectAttrs;
                    for (var i = 0; i < attrs.length; i++) {
                        var attr = attrs[i];
                        if ((attr.attrOperator !== "") && (attr.attrValue !== undefined)){
                            switch(attr.attrOrigin) {
                                case "default":
                                    conditionExpression.push(" &quot;"+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(currentRelatedObject.currentRelatedObjectName+currentRelatedObjectPosition+"."+attr.attrName)+" = }&quot;");
                                    break;
                                case "master":
                                    conditionExpression.push(" &quot;"+currentRelatedObjectType+"MasterS:IMAN_master_form"+"."+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(currentRelatedObject.currentRelatedObjectName+currentRelatedObjectPosition+"."+attr.attrName)+" = }&quot;");
                                    break;
                                default:
                                    conditionExpression.push(" &quot;"+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(currentRelatedObject.currentRelatedObjectName+currentRelatedObjectPosition+"."+attr.attrName)+" = }&quot;");
                            }
                            currentRelatedObjectConditions.push({"attrName":standizeName(currentRelatedObject.currentRelatedObjectName+currentRelatedObjectPosition+"."+attr.attrName),"attrOperator":attr.attrOperator,"attrValue":attr.attrValue});
                        }
                    }
                    var tcClassAttrs = currentRelatedObject.tcClassAttrs;
                    if (tcClassAttrs !== undefined){
                        for (var i = 0; i < tcClassAttrs.length; i++) {
                            var attr = tcClassAttrs[i];
                            if ((attr.attrOperator !== "") && (attr.attrValue !== undefined)){
                                conditionExpression.push(" &quot;&lt;"+attr.attrParentId+"&gt;:IMAN_classification"+"."+attr.attrId+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(attr.currentRelatedObjectName+currentRelatedObjectPosition+"."+attr.attrParentName+"."+attr.attrName)+" = }&quot;");
                                currentRelatedObjectConditions.push({"attrName":standizeName(currentRelatedObject.currentRelatedObjectName+currentRelatedObjectPosition+"."+attr.attrParentName+"."+attr.attrName),"attrOperator":attr.attrOperator,"attrValue":attr.attrValue});
                            }
                        }
                    }
                }

                function getQueryRelatedObjectCondition(conditionExpression, relatedObjectConditions, relatedObject, relatedObjectPosition){
                    var attrs = relatedObject.objectAttrs;
                    for (var i = 0; i < attrs.length; i++) {
                        var attr = attrs[i];
                        if ((attr.attrOperator !== "") && (attr.attrValue !== undefined)){
                            switch(attr.attrOrigin) {
                                case "default":
                                    conditionExpression.push(" &quot;"+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrName)+" = }&quot;");
                                    break;
                                case "master":
                                    conditionExpression.push(" &quot;"+relatedObject.mappedDmObjectType+"MasterS:IMAN_master_form"+"."+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrName)+" = }&quot;");
                                    break;
                                default:
                                    conditionExpression.push(" &quot;"+attr.attrTCName+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrName)+" = }&quot;");
                            }
                            relatedObjectConditions.push({"attrName":standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrName),"attrOperator":attr.attrOperator,"attrValue":attr.attrValue});
                        }
                    }
                    var tcClassAttrs = relatedObject.tcClassAttrs;
                    if (tcClassAttrs !== undefined){
                        for (var i = 0; i < tcClassAttrs.length; i++) {
                            var attr = tcClassAttrs[i];
                            if ((attr.attrOperator !== "") && (attr.attrValue !== undefined)){
                                conditionExpression.push(" &quot;&lt;"+attr.attrParentId+"&gt;:IMAN_classification"+"."+attr.attrId+"&quot; "+convertOperator(attr.attrOperator)+" &quot;${"+standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrParentName+"."+attr.attrName)+" = }&quot;");
                                relatedObjectConditions.push({"attrName":standizeName(relatedObject.objectName+relatedObjectPosition+"."+attr.attrParentName+"."+attr.attrName),"attrOperator":attr.attrOperator,"attrValue":attr.attrValue});
                            }
                        }
                    }
                }

                // function getPath(listPath, sourceConcept, targetConcept){
                //     var foundPath = "";
                //     if ((sourceConcept.mappedDmObjectType == "GIN4_StudySub") && (targetConcept.mappedDmObjectType == "GIN4_Acquisition")){
                //         switch(targetConcept.acquisitionType) {
                //             case "Imaging":
                //                 foundPath = "GIN4_ExamRes:GIN4_rel_ExamResIMA.GIN4_Acquisition:GIN4_rel_Acquisition";
                //                 break;
                //             case "Genetic":
                //                 foundPath = "GIN4_ExamRes:GIN4_rel_ExamResGEN.GIN4_Acquisition:GIN4_rel_Acquisition";
                //                 break;
                //             case "Psychology":
                //                 foundPath = "GIN4_ExamRes:GIN4_rel_ExamResBEH.GIN4_Acquisition:GIN4_rel_Acquisition";
                //                 break;
                //             case undefined:
                //                 foundPath = "GIN4_ExamRes:GIN4_rel_ExamResIMA.GIN4_Acquisition:GIN4_rel_Acquisition";
                //                 break;
                //         }
                //     }else{
                //         if ((sourceConcept.mappedDmObjectType == "GIN4_Acquisition") && (targetConcept.mappedDmObjectType == "GIN4_StudySub")) {
                //             switch(sourceConcept.acquisitionType) {
                //                 case "Imaging":
                //                     foundPath = "GIN4_ExamRes&lt;-GIN4_rel_Acquisition.GIN4_StudySub&lt;-GIN4_rel_ExamResIMA";
                //                     break;
                //                 case "Genetic":
                //                     foundPath = "GIN4_ExamRes&lt;-GIN4_rel_Acquisition.GIN4_StudySub&lt;-GIN4_rel_ExamResGEN";
                //                     break;
                //                 case "Psychology":
                //                     foundPath = "GIN4_ExamRes&lt;-GIN4_rel_Acquisition.GIN4_StudySub&lt;-GIN4_rel_ExamResBEH";
                //                     break;
                //                 case undefined:
                //                     foundPath = "GIN4_ExamRes&lt;-GIN4_rel_Acquisition.GIN4_StudySub&lt;-GIN4_rel_ExamResIMA";
                //                     break;
                //             }
                //         }else{
                //             for (var i = 0; i < listPath.length; i++) {
                //                 var path = listPath[i];
                //                 if ((path.sourceObjectType == sourceConcept.mappedDmObjectType) && (path.targetObjectType == targetConcept.mappedDmObjectType)) {
                //                     foundPath = path.path;
                //                 }
                //             }
                //         }
                //     }
                //     return foundPath;
                // }
        
                function importQuery2QB(txtQueryContent){
                    $http.get("data/importQuery2QB_template.xq").success(function(data){
                        var xQueryContent = [];
                        xQueryContent.push(data);
                        xQueryContent.push("let $plmxml := "+txtQueryContent);
                        xQueryContent.push('return if(Teamcenter:importFromPLMXML($teamcenter,$plmxml)) then $plmxml else "ERROR"');
                        $http({
                            method  : 'POST',
                            url     : 'http://bio-mule-srv:8080/cadesis-spike-system-plm-teamcenter10/spike',
                            data    : $.param({
                                                        siTag:"Teamcenter10",
                                                        connectionMap: "KTCUrl=http://bio-tc-preprod:8080/tc;KTCUser="+username+";KTCPwd="+password+";KTCDisc=Disc1",
                                                        xqueryFileName: xQueryContent.join("\r\n"),
                                                        outputMethod: "xml"
                                                    }),
                            headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                        })
                        .success(function(data, status, headers, config) {
                            console.log("result"+data);
                            executeQuery();
                        })
                        .error(function(data, status, headers, config){
                            console.log("error"+data);
                        });
                        var blob = new Blob([xQueryContent.join("\r\n")], {type: "text/plain;charset=utf-8"});
                        saveAs(blob, "outputXQuery.xq");
                    });
                }

                function importQueryRootObject2QB(txtQueryContent){
                    $http.get("data/importQuery2QB_template.xq").success(function(data){
                        var xQueryContent = [];
                        xQueryContent.push(data);
                        xQueryContent.push("let $plmxml := "+txtQueryContent);
                        xQueryContent.push('return if(Teamcenter:importFromPLMXML($teamcenter,$plmxml)) then $plmxml else "ERROR"');
                        $http({
                            method  : 'POST',
                            url     : 'http://bio-mule-srv:8080/cadesis-spike-system-plm-teamcenter10/spike',
                            data    : $.param({
                                                        siTag:"Teamcenter10",
                                                        connectionMap: "KTCUrl=http://bio-tc-preprod:8080/tc;KTCUser="+username+";KTCPwd="+password+";KTCDisc=Disc1",
                                                        xqueryFileName: xQueryContent.join("\r\n"),
                                                        outputMethod: "xml"
                                                    }),
                            headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                        })
                        .success(function(data, status, headers, config) {
                            console.log("result"+data);
                            executeQuery82();
                        })
                        .error(function(data, status, headers, config){
                            console.log("error"+data);
                        });
                        var blob = new Blob([xQueryContent.join("\r\n")], {type: "text/plain;charset=utf-8"});
                        saveAs(blob, "outputXQuery.xq");
                    });
                }
                function executeQuery(){
                    var executeXquery = [];
                    var attrList = '("KTCId","item_id","object_type","object_name","last_mod_date")';
                    executeXquery.push('xquery version "1.0";');
                    executeXquery.push('declare namespace Teamcenter="java:com.cadesis.spike.plm.teamcenter10.xquery.TCExtension";');
                    executeXquery.push('declare namespace local="local";');
                    executeXquery.push('declare variable $ParametersNode external;');
                    executeXquery.push('declare variable $teamcenter := Teamcenter:instance();');
                    executeXquery.push('<elements>');
                    executeXquery.push('{');
                    executeXquery.push('    let $attrList := '+attrList);
                    executeXquery.push('    let $query := <query query_name="'+$scope.queryName+'">');
                    for (var i = 0; i < $scope.queryConditions.length; i++) {
                        var condition = $scope.queryConditions[i];
                        if (condition.attrValue !== "")
                            executeXquery.push('                    <param name="'+condition.attrName+'" value="'+condition.attrValue+'"/>');
                    }
                    executeXquery.push('                  </query>');
                    executeXquery.push('    let $results := Teamcenter:Query($teamcenter, $query)');
                    executeXquery.push('    for $i in (1 to fn:count($results))');
                    executeXquery.push('    let $foundClasses := Teamcenter:getClassification($teamcenter, $results[$i], fn:false())');
                    executeXquery.push('    return');
                    executeXquery.push('        if (fn:empty($foundClasses))');
                    executeXquery.push('        then(');
                    executeXquery.push('                let $object :=');
                    executeXquery.push('                    <object KTCId="{$results[$i]/@KTCId}" objectType="{$results[$i]/@object_type}" objectName="{$results[$i]/@object_name}" objectId="{$results[$i]/@item_id}">');
                    executeXquery.push('                    </object>');
                    executeXquery.push('                return $object');
                    executeXquery.push('            )');
                    executeXquery.push('        else(');
                    executeXquery.push('                for $foundClass in $foundClasses');
                    executeXquery.push('                let $object :=');
                    executeXquery.push('                    <object KTCId="{$foundClass/@KTCId}" objectType="{$foundClass/@object_type}" objectName="{$foundClass/@object_name}" objectId="{$foundClass/@id}" tcClassId="{$foundClass/@cid}">');
                    executeXquery.push('                    {');
                    executeXquery.push('                      for $attr in $foundClass/ClassificationAttribute');
                    executeXquery.push('                      return');
                    executeXquery.push('                        <objectAttr attrName="{$attr/@name}" attrId="{$attr/@id}" attrValue="{$attr/@dbValue}">');
                    executeXquery.push('                        </objectAttr>');
                    executeXquery.push('                    }');
                    executeXquery.push('                    </object>');
                    executeXquery.push('                return $object');
                    executeXquery.push('            )');
                    executeXquery.push('}');
                    executeXquery.push('</elements>');

                    $http({
                            method  : 'POST',
                            url     : 'http://bio-mule-srv:8080/cadesis-spike-system-plm-teamcenter10/spike',
                            data    : $.param({
                                                        siTag:"Teamcenter10",
                                                        connectionMap: "KTCUrl=http://bio-tc-preprod:8080/tc;KTCUser="+username+";KTCPwd="+password+";KTCDisc=Disc1",
                                                        xqueryFileName: executeXquery.join("\r\n"),
                                                        outputMethod: "xml"
                                                    }),
                            headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                        })
                        .success(function(data, status, headers, config) {
                            var blob = new Blob([executeXquery.join("\r\n")], {type: "text/plain;charset=utf-8"});
                            saveAs(blob, "executeXquery.xq");
                            console.log("xQuery Result"+data);
                            var jsonResultWithClassAttrValue = $.xml2json(data).object;
                            if (jsonResultWithClassAttrValue == undefined){
                                $window.alert("No result")
                            }else{
                                jsonResultWithClassAttrValue = (jsonResultWithClassAttrValue.length == undefined) ? [jsonResultWithClassAttrValue] : jsonResultWithClassAttrValue;
                                $scope.jsonGroupedResultWithClassAttrValue = jsonResultWithClassAttrValue2jsonGroupedResultWithClassAttrValue(jsonResultWithClassAttrValue);
                                $scope.listGridResultWithClassAttrValue = jsonGroupedResultWithClassAttrValue2listGridResultWithClassAttrValue($scope.jsonGroupedResultWithClassAttrValue);
                                $scope.listGridResultWithClassAttrValueTableData = [];
                                var blob = new Blob([JSON.stringify($scope.jsonGroupedResultWithClassAttrValue)], {type: "text/plain;charset=utf-8"});
                                saveAs(blob, "jsonGroupedResultWithClassAttrValue.xq");

                                if ($scope.rootQueryObject.mappedTcClassId == ""){
                                    for (var i = 0; i < $scope.listGridResultWithClassAttrValue.length; i++) {
                                        var tcClassId = $scope.listGridResultWithClassAttrValue[i].tcClassId;
                                        var tcClassName = $scope.listGridResultWithClassAttrValue[i].tcClassName;
                                        $scope.listGridResultWithClassAttrValueTableData.push({
                                            "tcClassId":tcClassId,
                                            "tcClassName":tcClassName,
                                            "gridTable":{
                                                data: "listGridResultWithClassAttrValue["+i+"].tableData",
                                                enablePinning:true,
                                                columnDefs:"listGridResultWithClassAttrValue["+i+"].colDefs",
                                                jqueryUIDraggable:true
                                            }
                                        });
                                    };
                                }else{
                                    for (var i = 0; i < $scope.listGridResultWithClassAttrValue.length; i++) {
                                        var tcClassId = $scope.listGridResultWithClassAttrValue[i].tcClassId;
                                        var tcClassName = $scope.listGridResultWithClassAttrValue[i].tcClassName;
                                        if (tcClassId == $scope.rootQueryObject.mappedTcClassId)
                                            $scope.listGridResultWithClassAttrValueTableData.push({
                                                "tcClassId":tcClassId,
                                                "tcClassName":tcClassName,
                                                "gridTable":{
                                                    data: "listGridResultWithClassAttrValue["+i+"].tableData",
                                                    enablePinning:true,
                                                    columnDefs:"listGridResultWithClassAttrValue["+i+"].colDefs",
                                                    jqueryUIDraggable:true
                                                }
                                            });
                                    };
                                }
                                console.log($scope.listGridResultWithClassAttrValue);                               
                            }
                        })
                        .error(function(data, status, headers, config){
                            console.log("error"+data);
                        });
                }

                function executeQuery82(){
                    var functionList = createRelatedObjectFunctionList($scope.queryRouteRelatedObjects);
                    var foundRelatedObjectsList = createFoundRelatedObjectsList($scope.queryRouteRelatedObjects);
                    var executeXquery = [];
                    var attrList = '("KTCId","item_id","object_type","object_name","last_mod_date")';
                    var xqFoundRelatedObjects = createXqFoundRelatedObjects($scope.rootQueryObject, $scope.queryRouteObject, $scope.copiedRouteRelatedObjects, $scope.queryRouteRelatedObjects);
                    executeXquery.push('xquery version "1.0";');
                    executeXquery.push('declare namespace functx = "http://www.functx.com";');
                    executeXquery.push('declare namespace Teamcenter="java:com.cadesis.spike.plm.teamcenter10.xquery.TCExtension";');
                    executeXquery.push('declare namespace local="local";');
                    executeXquery.push('declare variable $ParametersNode external;');
                    executeXquery.push('declare variable $teamcenter := Teamcenter:instance();');
                    executeXquery.push('\r\n');
                    executeXquery.push('declare function functx:value-intersect($arg1, $arg2){');
                    executeXquery.push('    distinct-values($arg1[.=$arg2])');
                    executeXquery.push('};');
                    executeXquery.push('\r\n');
                    executeXquery.push(functionList.join('\r\n\r\n'));
                    executeXquery.push('\r\n');
                    executeXquery.push('<elements>');
                    executeXquery.push('{');
                    executeXquery.push(foundRelatedObjectsList.join('\r\n'));
                    executeXquery.push('\r\n');
                    executeXquery.push('    let $attrList := '+attrList);
                    executeXquery.push('    let $query := ');
                    executeXquery.push('        <query query_name="'+$scope.queryName+'">');
                    for (var i = 0; i < $scope.queryConditions.length; i++) {
                        var condition = $scope.queryConditions[i];
                        if (condition.attrValue !== "")
                            executeXquery.push('            <param name="'+condition.attrName+'" value="'+condition.attrValue+'"/>');
                    }
                    executeXquery.push('        </query>');
                    executeXquery.push('    let $found'+$scope.queryRouteObject.shortQueryName+'s := Teamcenter:Query($teamcenter, $query)');
                    if ($scope.returnResultNumber.value !== ""){
                        executeXquery.push('    let $returnResultNumber :=');
                        executeXquery.push('        if (fn:count($found'+$scope.queryRouteObject.shortQueryName+'s) < '+$scope.returnResultNumber.value+')');
                        executeXquery.push('        then (fn:count($found'+$scope.queryRouteObject.shortQueryName+'s))');
                        executeXquery.push('        else ('+$scope.returnResultNumber.value+')');
                        executeXquery.push('    for $found'+$scope.queryRouteObject.shortQueryName+' in fn:subsequence($found'+$scope.queryRouteObject.shortQueryName+'s,1,$returnResultNumber)');
                    }else{
                        executeXquery.push('    for $found'+$scope.queryRouteObject.shortQueryName+' in $found'+$scope.queryRouteObject.shortQueryName+'s');
                    }
                    executeXquery.push('    return');
                    executeXquery.push('        <object conceptName="'+$scope.queryRouteObject.conceptName+'" KTCId="{$found'+$scope.queryRouteObject.shortQueryName+'/@KTCId}" objectType="{$found'+$scope.queryRouteObject.shortQueryName+'/@object_type}" objectName="{$found'+$scope.queryRouteObject.shortQueryName+'/@object_name}" objectId="{$found'+$scope.queryRouteObject.shortQueryName+'/@item_id}">');
                    executeXquery.push('        {');
                    executeXquery.push('            let $returnRelatedObjectKTCIds := ()');
                    executeXquery.push('            let $returnRelatedObjectList := ()');
                    executeXquery.push(xqFoundRelatedObjects.join('\r\n'));
                    executeXquery.push('            return $returnRelatedObjectList');
                    executeXquery.push('        }');
                    executeXquery.push('        </object>');
                    executeXquery.push('}');
                    executeXquery.push('</elements>');

                    var blob = new Blob([executeXquery.join("\r\n")], {type: "text/plain;charset=utf-8"});
                    saveAs(blob, "final_execute_xQuery.xq");

                    $http({
                            method  : 'POST',
                            url     : 'http://bio-mule-srv:8080/cadesis-spike-system-plm-teamcenter10/spike',
                            data    : $.param({
                                                        siTag:"Teamcenter10",
                                                        connectionMap: "KTCUrl=http://bio-tc-preprod:8080/tc;KTCUser="+username+";KTCPwd="+password+";KTCDisc=Disc1",
                                                        xqueryFileName: executeXquery.join("\r\n"),
                                                        outputMethod: "xml"
                                                    }),
                            headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
                        })
                        .success(function(data, status, headers, config) {
                            var blob = new Blob([executeXquery.join("\r\n")], {type: "text/plain;charset=utf-8"});
                            saveAs(blob, "executeXquery.xq");
                            console.log("xQuery Result"+data);
                            var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
                            saveAs(blob, "final_results.xml");
                            
                            $scope.t1 = performance.now();
                            console.log("Request execution time: " + ($scope.t1 - $scope.t0) + " ms.");
                            
                            var jsonResult = $.xml2json(data).object;
                            var jsonResultArray = (jsonResult.length !== undefined) ? (jsonResult) : [jsonResult];
                            alignJsonResult(jsonResultArray);
                            var gridTableResult = jsonResult2gridTableResult(jsonResultArray);
                            var blob = new Blob([gridTableResult.join("\r\n")], {type: "text/plain;charset=utf-8"});
                            saveAs(blob, "grid_query_result.csv");

                            /*var jsonResultWithClassAttrValue = $.xml2json(data).object;
                            if (jsonResultWithClassAttrValue == undefined){
                                $window.alert("No result")
                            }else{
                                jsonResultWithClassAttrValue = (jsonResultWithClassAttrValue.length == undefined) ? [jsonResultWithClassAttrValue] : jsonResultWithClassAttrValue;
                                $scope.jsonGroupedResultWithClassAttrValue = jsonResultWithClassAttrValue2jsonGroupedResultWithClassAttrValue(jsonResultWithClassAttrValue);
                                $scope.listGridResultWithClassAttrValue = jsonGroupedResultWithClassAttrValue2listGridResultWithClassAttrValue($scope.jsonGroupedResultWithClassAttrValue);
                                $scope.listGridResultWithClassAttrValueTableData = [];
                                var blob = new Blob([JSON.stringify($scope.jsonGroupedResultWithClassAttrValue)], {type: "text/plain;charset=utf-8"});
                                saveAs(blob, "jsonGroupedResultWithClassAttrValue.xq");

                                if ($scope.rootQueryObject.mappedTcClassId == ""){
                                    for (var i = 0; i < $scope.listGridResultWithClassAttrValue.length; i++) {
                                        var tcClassId = $scope.listGridResultWithClassAttrValue[i].tcClassId;
                                        var tcClassName = $scope.listGridResultWithClassAttrValue[i].tcClassName;
                                        $scope.listGridResultWithClassAttrValueTableData.push({
                                            "tcClassId":tcClassId,
                                            "tcClassName":tcClassName,
                                            "gridTable":{
                                                data: "listGridResultWithClassAttrValue["+i+"].tableData",
                                                enablePinning:true,
                                                columnDefs:"listGridResultWithClassAttrValue["+i+"].colDefs",
                                                jqueryUIDraggable:true
                                            }
                                        });
                                    };
                                }else{
                                    for (var i = 0; i < $scope.listGridResultWithClassAttrValue.length; i++) {
                                        var tcClassId = $scope.listGridResultWithClassAttrValue[i].tcClassId;
                                        var tcClassName = $scope.listGridResultWithClassAttrValue[i].tcClassName;
                                        if (tcClassId == $scope.rootQueryObject.mappedTcClassId)
                                            $scope.listGridResultWithClassAttrValueTableData.push({
                                                "tcClassId":tcClassId,
                                                "tcClassName":tcClassName,
                                                "gridTable":{
                                                    data: "listGridResultWithClassAttrValue["+i+"].tableData",
                                                    enablePinning:true,
                                                    columnDefs:"listGridResultWithClassAttrValue["+i+"].colDefs",
                                                    jqueryUIDraggable:true
                                                }
                                            });
                                    };
                                }
                                console.log($scope.listGridResultWithClassAttrValue);                               
                            }*/

                            /*$scope.finalTableQueryResult = jsonResult2tableResult($scope.finalJsonQueryResult);

                            // getSelectedAttrValues($scope.KTCIds, $scope.rootQueryObject, $scope.routeRelatedObjects);
                            
                            $scope.gridClassAssociatedDataTable = {
                                data:"finalTableQueryResult.tableData",
                                enablePinning:true,
                                columnDefs:"finalTableQueryResult.colDefs",
                                jqueryUIDraggable:true
                            }

                            var modalInstance = $modal.open({
                              templateUrl: 'myModalContent.html',
                              controller: 'ModalInstanceCtrl',
                              size: "large",
                              resolve: {
                                resultTableData: function () {
                                  return $scope.jsonResultArray;
                                }
                              }
                            });*/

                        })
                        .error(function(data, status, headers, config){
                            console.log("error"+data);
                        });
                };
            };  

            function getPath(listPath, sourceConcept, targetConcept){
                var foundPath = "";
                if ((sourceConcept.mappedDmObjectType == "GIN4_StudySub") && ($scope.listCheckExamTypeDmObjectTypes.indexOf(targetConcept.mappedDmObjectType) !== -1)) {
                    for (var i = 0; i < listPath.length; i++) {
                        var path = listPath[i];
                        if ((path.sourceObjectType == sourceConcept.mappedDmObjectType) && (path.targetObjectType == targetConcept.mappedDmObjectType) && (path.relationName == targetConcept.examType)){
                            foundPath = path.path;
                        }
                    }
                }else{
                    if (($scope.listCheckExamTypeDmObjectTypes.indexOf(sourceConcept.mappedDmObjectType) !== -1) && (targetConcept.mappedDmObjectType == "GIN4_StudySub")) {
                        for (var i = 0; i < listPath.length; i++) {
                            var path = listPath[i];
                            if ((path.sourceObjectType == sourceConcept.mappedDmObjectType) && (path.targetObjectType == targetConcept.mappedDmObjectType) && (path.relationName == sourceConcept.examType)){
                                foundPath = path.path;
                            }
                        }
                    }else{
                        for (var i = 0; i < listPath.length; i++) {
                            var path = listPath[i];
                            if ((path.sourceObjectType == sourceConcept.mappedDmObjectType) && (path.targetObjectType == targetConcept.mappedDmObjectType)) {
                                foundPath = path.path;
                            }
                        }
                    }
                }
                return foundPath;
            }
            function standizeName(name){
                var standardName = name.split(" ").join("");
                standardName = standardName.split("-").join("");
                standardName = standardName.split("_").join("");
                return standardName;
            }

            /*
             * [jsonResultWithClassAttrValue2jsonGroupedResultWithClassAttrValue description]
             * This function groups results with class attribute value
             * @param  {[type]} jsonResultWithClassAttrValue [description]
             * @return {[type]}                              [description]
             */
            function jsonResultWithClassAttrValue2jsonGroupedResultWithClassAttrValue(jsonResultWithClassAttrValue){
                var tcClassIds = [], jsonGroupedResultWithClassAttrValue = [], unClassifiedObjects = [];
                for (var i = 0; i < jsonResultWithClassAttrValue.length; i++) {
                    var objectData = jsonResultWithClassAttrValue[i];
                    if (objectData.tcClassId !== undefined){ // && (objectData.objectAttr !== undefined)){
                        if (tcClassIds.indexOf(objectData.tcClassId) == -1)
                            tcClassIds.push(objectData.tcClassId);
                    }else{
                        var newObjectData = {};
                        newObjectData["objectId"] = jsonResultWithClassAttrValue[i].objectId;
                        newObjectData["objectName"] = jsonResultWithClassAttrValue[i].objectName;
                        unClassifiedObjects.push(newObjectData);
                    }
                };
                if (unClassifiedObjects.length !== 0){
                    jsonGroupedResultWithClassAttrValue.push({
                        "tcClassId":"",
                        "tcClassName": "",
                        "classifiedObjects":unClassifiedObjects,
                        "listAttrNames":["objectId", "objectName"]
                    })
                };
                for (var i = 0; i < tcClassIds.length; i++) {
                    var tempClassifiedObjects = [];
                    var listAttrNames = ["objectId", "objectName"], addedListAttrNames = false;
                    for (var j = 0; j < jsonResultWithClassAttrValue.length; j++) {
                        if (jsonResultWithClassAttrValue[j].tcClassId == tcClassIds[i]){
                            var objectData = jsonResultWithClassAttrValue[j], newObjectData = {};
                            newObjectData["objectId"] = objectData.objectId;
                            newObjectData["objectName"] = objectData.objectName;
                            if (objectData.objectAttr !== undefined){
                                for (var k = 0; k < objectData.objectAttr.length; k++) {
                                    var attr = objectData.objectAttr[k];
                                    newObjectData[attr.attrName] = attr.attrValue;
                                    if (!addedListAttrNames) listAttrNames.push(attr.attrName);
                                };
                                addedListAttrNames = true;
                            };
                            tempClassifiedObjects.push(newObjectData);
                        }
                    };
                    var idxLeafClassId = $scope.allLeafClassIds.indexOf(tcClassIds[i]);
                    if ((idxLeafClassId !== -1) && (tempClassifiedObjects.length !== 0)){
                        var tcClassName = (idxLeafClassId !== -1) ? $scope.allLeafClasses[idxLeafClassId].name : "";
                        jsonGroupedResultWithClassAttrValue.push({
                            "tcClassId":tcClassIds[i],
                            "tcClassName": tcClassName,
                            "classifiedObjects":tempClassifiedObjects,
                            "listAttrNames":listAttrNames
                        })
                    }
                };
                return jsonGroupedResultWithClassAttrValue;
            }

            function jsonDataClickedQueryObject2csvDataClickedQueryObject(jsonDataClickedQueryObject) {
                var csvDataClickedQueryObject = [];
                for (var i = 0; i < jsonDataClickedQueryObject.length; i++) {
                    var tempJsonDataClickedQueryObject = jsonDataClickedQueryObject[i];
                    var tempListAttrNames = tempJsonDataClickedQueryObject.listAttrNames;
                    csvDataClickedQueryObject.push(tempListAttrNames.join(","));
                    for (var j = 0; j < tempJsonDataClickedQueryObject.classifiedObjects.length; j++) {
                        var tempRow = [];
                        for (var k = 0; k < tempListAttrNames.length; k++) {
                            tempRow.push(tempJsonDataClickedQueryObject.classifiedObjects[j][tempListAttrNames[k]]);
                        }
                        csvDataClickedQueryObject.push(tempRow.join(","));
                    }
                    csvDataClickedQueryObject.push("\r\n");
                }
                return csvDataClickedQueryObject;
            };

            function jsonResult2csvResult(jsonResult){
                var lines = [], headLine = [];
                headLine.push("KTCId");
                headLine.push("Type");
                headLine.push("Id");
                headLine.push("Name");
                if ((jsonResult.length !== undefined) && (jsonResult.length !== 0))
                    if ((jsonResult[0].objectAttr !== undefined) && (jsonResult[0].objectAttr.length !== undefined))
                        for (var i = 0; i < jsonResult[0].objectAttr.length; i++) {
                            headLine.push(jsonResult[0].objectAttr[i].attrName);
                        };
                lines.push(headLine.join(","));
                for (var i = 0; i < jsonResult.length; i++) {
                    var object = jsonResult[i];
                    var line = [];

                    line.push(object.KTCId);
                    (object.objectType !== undefined) ? line.push(object.objectType) : line.push(object.object_type);
                    (object.objectId !== undefined) ? line.push(object.objectId) : line.push(object.item_id);
                    (object.objectName !== undefined) ? line.push(object.objectName) : line.push(object.object_name);

                    if ((object.objectAttr !== undefined) && (object.objectAttr.length !== undefined))
                        for (var j = 0; j < object.objectAttr.length; j++) {
                            line.push(object.objectAttr[j].attrValue);
                        };
                    lines.push(line.join(','));
                };
                return lines;
            }


            /**
             * [jsonGroupedResultWithClassAttrValue2listGridResultWithClassAttrValue description]
             * This function convets groupedResultWithClassAttrValue to 
             * gridResultWithClassAttrValue
             * @param  {[type]} jsonGroupedResultWithClassAttrValue [description]
             * @return {[type]}                                     [description]
             */
            function jsonGroupedResultWithClassAttrValue2listGridResultWithClassAttrValue(jsonGroupedResultWithClassAttrValue){
                var listGridResultWithClassAttrValue = [];
                for (var i = 0; i < jsonGroupedResultWithClassAttrValue.length; i++) {
                    var table = jsonGroupedResultWithClassAttrValue[i], tableData = [], colDefs = [];
                    var tcClassName = jsonGroupedResultWithClassAttrValue[i].tcClassName;
                    var tcClassId = jsonGroupedResultWithClassAttrValue[i].tcClassId;
                    for (var j = 0; j < table.listAttrNames.length; j++) {
                        if ((table.listAttrNames[j] == "objectName") || (table.listAttrNames[j] == "objectId")){
                            colDefs.push({field: table.listAttrNames[j], width: 100, pinned: true});
                        }else{
                            colDefs.push({field: table.listAttrNames[j], width: 100});
                        }
                    };
                    for (var k = 0; k < table.classifiedObjects.length; k++) {
                        var tableRow = {};
                        for (var j = 0; j < table.listAttrNames.length; j++) {
                            tableRow[table.listAttrNames[j]] = table.classifiedObjects[k][table.listAttrNames[j]];
                        };
                        tableData.push(tableRow);
                    };
                    listGridResultWithClassAttrValue.push({"tcClassId":tcClassId, "tcClassName":tcClassName, "tableData": tableData, "colDefs": colDefs});
                };
                return listGridResultWithClassAttrValue;
            };

            
            /**
             * [gridResultWithClassAttrValue2csvListGridResult description]
             * Convert gridResultWithClassAttrValueTableData to csvListGridResult
             * @param  {[type]} gridResultWithClassAttrValue [description]
             * @return {[type]}                              [description]
             */
            function gridResultWithClassAttrValue2csvListGridResult(gridResultWithClassAttrValue){
                var csvListGridResult = [];
                for (var i = 0; i < gridResultWithClassAttrValue.length; i++) {
                    var tempHeadline = gridResultWithClassAttrValue[i].colDefs.map(function(e){return e.field;});
                    // add column tcClassName in headLine
                    if ((gridResultWithClassAttrValue[i].tcClassName !== undefined) && (gridResultWithClassAttrValue[i].tcClassName !== "")){
                        tempHeadline.splice(1, 0, "tcClassName");
                    }

                    csvListGridResult.push(tempHeadline.join(","));
                    for (var j = 0; j < gridResultWithClassAttrValue[i].tableData.length; j++) {
                        var tempRow = [];
                        angular.forEach(Object.keys(gridResultWithClassAttrValue[i].tableData[j]),function(key){
                            tempRow.push(gridResultWithClassAttrValue[i].tableData[j][key]);
                        });
                        // add tcClassName value into each rows
                        if ((gridResultWithClassAttrValue[i].tcClassName !== undefined) && (gridResultWithClassAttrValue[i].tcClassName !== "")) { 
                            tempRow.splice(1, 0, gridResultWithClassAttrValue[i].tcClassName);
                        }
                        csvListGridResult.push(tempRow.join(","));
                    };                    
                    csvListGridResult.push("\n");
                };
                return csvListGridResult;
            }
        /**
         * OTHER FUNCTIONS
         */
            
            function getAllLeafClasses(classifTree, allLeafClasses) {
                if (classifTree.node == undefined) {
                    allLeafClasses.push(classifTree);
                }   
                if (classifTree.node !== undefined) {
                    for (var i = 0; i < classifTree.node.length; i++) {
                        getAllLeafClasses(classifTree.node[i], allLeafClasses);
                    }
                }
            }

            function alignJsonResult(jsonResult) {
                for (var i = 0; i < jsonResult.length; i++) {
                    if (jsonResult[i].relatedObject !== undefined){
                        jsonResult[i].relatedObject = (jsonResult[i].relatedObject.length === undefined) ? [jsonResult[i].relatedObject] : jsonResult[i].relatedObject;
                        
                        for (var j = 0; j < jsonResult[i].relatedObject.length; j++) {
                            var tempRelatedObject = jsonResult[i].relatedObject[j];
                            var relatedObjectNameArray = tempRelatedObject.objectName.split("_");
                            if (tempRelatedObject.objectAttr !== undefined){
                                for (var l = 0; l < tempRelatedObject.objectAttr.length; l++) {
                                    tempRelatedObject.objectAttr[l].attrName = relatedObjectNameArray.slice(0, 2).join("_")+"_"+tempRelatedObject.objectAttr[l].attrName;
                                }
                                tempRelatedObject.objectAttr.sort(compare);
                            }                       
                        }
                    }
                }
                return jsonResult;  
            }

            function compare(a,b) {
                if (a.attrName < b.attrName)
                    return -1;
                else if (a.attrName > b.attrName)
                    return 1;
                else 
                    return 0;
            }

            function convertOperator(operator){
                var convertedOperator = "";
                switch(operator){
                    case "=":
                        convertedOperator = "=";
                        break;
                    case "<=":
                        convertedOperator = "&lt;=";
                        break;
                    case ">=":
                        convertedOperator = "&gt;=";
                        break;
                    case "contains":
                        convertedOperator = "contains";
                        break;   
                    case "!=":
                        convertedOperator = "!=";
                        break;
                    case "<":
                        convertedOperator = "&lt;";
                        break;   
                    case ">":
                        convertedOperator = "&gt;";
                        break;      
                    default:
                        convertedOperator = "=";                                             
                }
                return convertedOperator;
            } 
        
            /**
             * [jsonResult2gridTableResult description]
             * This function convert jsonresult into gridTableResult where
             * foundObjects are seperated.
             * @param  {[type]} jsonResult [description]
             * @return {[type]}            [description]
             */
            function jsonResult2gridTableResult(jsonResult){
                var gridTableResult = [];
                for (var i = 0; i < jsonResult.length; i++) {
                    var tempRootObject = jsonResult[i];
                    var newHeader = [tempRootObject.conceptName+".name", tempRootObject.conceptName+".id", " "];
                    var newRow = [tempRootObject.objectName, tempRootObject.objectId, " "];
                    if (tempRootObject.relatedObject !== undefined){
                        for (var j = 0; j < tempRootObject.relatedObject.length; j++) {
                            var tempRelatedObject = tempRootObject.relatedObject[j];
                            newHeader.push(tempRelatedObject.conceptName+".name");
                            newHeader.push(tempRelatedObject.conceptName+".id");
                            newRow.push(tempRelatedObject.objectName);
                            newRow.push(tempRelatedObject.objectId);
                            if (tempRelatedObject.objectAttr !== undefined){
                                for (var k = 0; k < tempRelatedObject.objectAttr.length; k++) {
                                    var objectAttr = tempRelatedObject.objectAttr[k];
                                    newHeader.push(objectAttr.attrName);
                                    newRow.push(objectAttr.attrValue);
                                }
                            }
                            newHeader.push(" ");
                            newRow.push(" ");
                        }
                    }
                    gridTableResult.push(newHeader.join(","));
                    gridTableResult.push(newRow.join(","));
                    gridTableResult.push("\r\n");
                }
                return gridTableResult;
            }   

            function plmxlmClassif2jsonExportedClassif(plmxlmClassifConcent) {
                var plmxlmClassifArray = plmxlmClassifConcent.split("\n"); 
                for (var i = 0; i < plmxlmClassifArray.length; i++) {
                    if (plmxlmClassifArray[i].indexOf('<InClassAdminPackage xmlns="http://www.ugs.com/in-CLASS/1.0"') !== -1) {
                        plmxlmClassifArray[i] = '<InClassAdminPackage>';
                    }
                }
                var plmxlmClassif = plmxlmClassifArray.join("\r\n");
                return $.xml2json(plmxlmClassif);
            } 

            function jsonExportedClassif2classifTree(jsonExportedClassif) {
                $scope.classes = jsonExportedClassif.ClassPackage; // get classes
                $scope.attributes = jsonExportedClassif.ICSDictionaryAttribute; // get attribute dictionary

                var attributeTypes = [];
                for (var i = 0; i < $scope.attributes.length; i++) {
                    if (attributeTypes.indexOf(Object.keys($scope.attributes[i].Format)[0]) == -1) attributeTypes.push(Object.keys($scope.attributes[i].Format)[0]);
                }
                console.log(attributeTypes);
                $scope.attributeIds = $scope.attributes.map(function(e){return e.attributeId;});
                $scope.attributeNames = $scope.attributes.map(function(e){return e.Name;});

                for (var k = 0; k < $scope.classes.length; k++) {
                    if ($scope.classes[k].classId == $scope.classifTreeRootClassId){
                        $scope.classifTree = {
                            "name": $scope.classes[k].ICSClass.Name,
                            "id": $scope.classes[k].classId,
                            "title": $scope.classes[k].ICSClass.Name
                        };
                    }
                }
                console.log($scope.classes);
                classes2classifTree($scope.classes, $scope.classifTree);
            } 

            function classes2classifTree(classes, node){
                for (var i = 0; i < classes.length; i++) {
                    if (classes[i].ICSClass.Parent == node.id){
                        if (node.node === undefined) node.node = [];
                        var newNode = {};
                        newNode.name = classes[i].ICSClass.Name;
                        newNode.id = classes[i].classId;
                        newNode.title = classes[i].ICSClass.Name;
                        var newAttributes = [];
                        if (classes[i].ICSClass.Attribute !== undefined) {
                            for (var j = 0; j < classes[i].ICSClass.Attribute.length; j++) {
                                var attrId = classes[i].ICSClass.Attribute[j].attributeId;
                                var idxId = $scope.attributeIds.indexOf(attrId);
                                var attrName = $scope.attributes[idxId].Name;
                                newAttributes.push({
                                    "name":attrName,
                                    "id":attrId
                                });
                            }
                        }
                        if (newAttributes.length !== 0) newNode.attribute = newAttributes;
                        node.node.push(newNode);
                        getTreeFromClasses(classes, node.node[node.node.length-1]);
                    }
                }
            }

            function getTreeFromClasses(classes, node){
                for (var i = 0; i < classes.length; i++) {
                    if (classes[i].ICSClass.Parent == node.id){
                        if (node.node === undefined) node.node = [];
                        var newNode = {};
                        newNode.name = classes[i].ICSClass.Name;
                        newNode.id = classes[i].classId;
                        newNode.title = classes[i].ICSClass.Name;
                        var newAttributes = [];
                        if (classes[i].ICSClass.Attribute !== undefined) {
                            for (var j = 0; j < classes[i].ICSClass.Attribute.length; j++) {
                                var attrId = classes[i].ICSClass.Attribute[j].attributeId;
                                var idxId = $scope.attributeIds.indexOf(attrId);
                                var attrName = $scope.attributes[idxId].Name;
                                newAttributes.push({
                                    "name":attrName,
                                    "id":attrId
                                });
                            }
                        }
                        if (newAttributes.length !== 0) newNode.attribute = newAttributes;
                        node.node.push(newNode);
                        getTreeFromClasses(classes, node.node[node.node.length-1]);
                    }
                }
            }
            $scope.fnDisplayD3RelationGraph = function() {
                displayD3RelationGraph($scope.d3RelationGraph);
            };

            function getListConceptFromTree(conceptTree, listConcept) {
            	var copyConcept = jQuery.extend(true, {}, conceptTree);
            	delete copyConcept.node;
            	listConcept.push(copyConcept);
            	if (conceptTree.node !== undefined) {
            		for (var i = 0; i < conceptTree.node.length; i++) {
	            		getListConceptFromTree(conceptTree.node[i], listConcept);
	            	}
            	}
            }

            function findConceptByConceptId(listConcept, conceptId) {
            	var foundConcept = {};
            	for (var i = 0; i < listConcept.length; i++) {
            		if (listConcept[i].id == conceptId) {
            			foundConcept = jQuery.extend(true, {}, listConcept[i]);
            			break;
            		}
            	}
            	return foundConcept;
            }

            function writeFile(fileName, fileContent) {
                var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
                saveAs(blob, fileName);
            }
        });
    }
    app.controller('ModalInstanceCtrl2', function controller($rootScope, $scope, $modalInstance, attrValueResultTableData){
        $scope.colDefs  = [];
        $scope.resultTable = {
            data:'attrValueResultTableData',
            columnDefs: 'colDefs',
            jqueryUIDraggable: true
        };
        $scope.$watch('attrValueResultTableData',function(){
            $scope.colDefs  = [];
            console.log($rootScope.attrValueResultTableData[0]);
            angular.forEach(Object.keys($rootScope.attrValueResultTableData[0]),function(key){
                $scope.colDefs.push({field: key});
            });
        });
        $rootScope.attrValueResultTableData = attrValueResultTableData;
        console.log($rootScope.attrValueResultTableData);
        $scope.ok = function () {
            $modalInstance.dismiss('ok');
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        
        $scope.saveSelectedAttrValue = function(){
            var blob = new Blob([jsonResult2csv($rootScope.attrValueResultTableData)], {type: "text/plain;charset=utf-8"});
            saveAs(blob, "selectedAttrValue.csv");
        }

        function jsonResult2csv(attrValueResultTableData){
            var csv = [], headLine = [];
            angular.forEach(Object.keys(attrValueResultTableData[0]),function(key){
                headLine.push(key);
            });
            console.log(headLine);
            csv.push(headLine.join(','));
            for (var i in attrValueResultTableData){
                var row = [];
                for (var j in attrValueResultTableData[i]){
                    row.push(attrValueResultTableData[i][j]);
                }
                console.log(row);
                csv.push(row);
                console.log(csv);
            }
            return csv.join('\n');
        }
    });
}(this.angular));
