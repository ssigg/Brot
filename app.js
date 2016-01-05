'use strict';

var app = angular.module("brotApp", ["firebase"]);

app.controller("brotCtrl", function ($scope, $location, $firebaseObject) {
    var firebasePrefix = $location.path().substring(1);
    var firebaseUrl = "https://" + firebasePrefix + ".firebaseio.com";
    var ref = new Firebase(firebaseUrl);

    // download the data into a local object
    var syncObject = $firebaseObject(ref);

    // synchronize the object with a three-way data binding
    // click on `index.html` above to see it used in the DOM!
    syncObject.$bindTo($scope, "data");

    $scope.toggle = function (item) {
        item.isAvailable = !item.isAvailable;
    };

    $scope.isInEditMode = false;

    $scope.edit = function() {
        $scope.isInEditMode = true;
    };

    $scope.back = function() {
        $scope.isInEditMode = false;
    };

    $scope.add = function() {
        var newItemRef = ref.push();
        newItemRef.set({ "isAvailable": false });
    };

    $scope.delete = function(item) {
        for (var d in $scope.data) {
            if ($scope.data[d] === item) {
                ref.child(d).remove();
                return;
            }
        }
    };
});