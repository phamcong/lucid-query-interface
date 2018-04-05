(function(angular) {
	'use strict';
	var app = angular.module("vaquero");

	app.directive('onReadFile', function ($parse) {
		return {
			restrict: 'A',
			scope: false,
			link: function(scope, element, attrs) {
				var fn = $parse(attrs.onReadFile);
				
				element.on('change', function(onChangeEvent) {
					var reader = new FileReader();
					
					reader.onload = function(onLoadEvent) {
						scope.$apply(function() {
							fn(scope, {$fileContent:onLoadEvent.target.result});
						});
					};
					reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
				});
			}
		};
	});

	app.controller('testController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
		$scope.classifTreeRootClassId = "ICM";
		$scope.ontoConceptTreeModel = {"items": []};
		$scope.classifTreeModel = {"items": []};

		$scope.readXmlResultFile = function($fileContent){
			$scope.xmlResult = $fileContent;
			$scope.jsonResult = $.xml2json($scope.xmlResult);
			writeFile("jsonResult.json", JSON.stringify($scope.jsonResult));
		};

		$scope.alignmentXmlResult = function() {
			for (var k = 0; k < $scope.jsonResult.object.length; k++) {
				if ($scope.jsonResult.object[k].relatedObject !== undefined)
					if ($scope.jsonResult.object[k].relatedObject.length === undefined)
						$scope.jsonResult.object[k].relatedObject = [$scope.jsonResult.object[k].relatedObject];
			}

			var foundObjects = $scope.jsonResult.object;

			for (var i = 0; i < foundObjects.length; i++) {
				if (foundObjects[i].relatedObject !== undefined){
					for (var j = 0; j < foundObjects[i].relatedObject.length; j++) {
						var tempRelatedObject = foundObjects[i].relatedObject[j];
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
			$scope.gridTableResult = jsonResult2gridTableResult($scope.jsonResult.object);
			writeFile("alignedJsonResult.json", JSON.stringify($scope.jsonResult));
			writeFile("alignedGridTableResult.csv", $scope.gridTableResult.join("\r\n"));
			console.log($scope.gridTableResult.join("\r\n"));
		};

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

		function compare(a,b) {
			if (a.attrName < b.attrName)
				return -1;
			else if (a.attrName > b.attrName)
				return 1;
			else 
				return 0;
		}

		function writeFile(fileName, fileContent) {
			var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
			saveAs(blob, fileName);
		}
	}]);
}( this.angular));