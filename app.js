'use strict';

var app = angular.module("brotApp", ["firebase"]);

app.factory("firebaseRef", function ($location) {
    var firebasePrefix = $location.path().substring(1);
    var firebaseUrl = "https://" + firebasePrefix + ".firebaseio.com";
    var ref = new Firebase(firebaseUrl);
    return ref;
})

app.factory("syncObject", function ($firebaseObject, firebaseRef) {
    var syncObject = $firebaseObject(firebaseRef);
    return syncObject;
});

app.controller("brotCtrl", function ($scope, syncObject, firebaseRef) {
    syncObject.$bindTo($scope, "data");

    $scope.isInEditMode = false;

    $scope.toggle = function (item) {
        item.isAvailable = !item.isAvailable;
    };

    $scope.edit = function () {
        $scope.isInEditMode = true;
    };

    $scope.back = function () {
        $scope.isInEditMode = false;
    };

    $scope.add = function () {
        var newItemRef = firebaseRef.push();
        $scope.data[newItemRef.key()] = {"name": "", "isAvailable": false};
    };

    $scope.delete = function (item) {
        for (var d in $scope.data) {
            if ($scope.data[d] === item) {
                delete $scope.data[d];
                return;
            }
        }
    };
});