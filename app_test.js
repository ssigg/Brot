"use strict";

describe('brotApp', function () {
    var $firebaseObject, $utils, $rootScope, scope, $timeout, obj, ref, $interval, log;

    var DEFAULT_ID = 'id1';

    var FIXTURE_DATA = {
        '$id': 'id1',
        '$priority': null,
        'idAvailable': {
            'name': 'This is available',
            'isAvailable': true
        },
        'idUnavailable': {
            'name': 'This is unavailable',
            'isAvailable': false
        }
    };

    beforeEach(function () {
        log = {
            error: []
        };

        module('brotApp');

        inject(function ($controller, _$interval_, _$firebaseObject_, _$timeout_, $firebaseUtils, _$rootScope_, $location) {
            $firebaseObject = _$firebaseObject_;
            $timeout = _$timeout_;
            $interval = _$interval_;
            $utils = $firebaseUtils;
            $rootScope = _$rootScope_;

            scope = $rootScope.$new();

            ref = stubRef();
            obj = makeObject(FIXTURE_DATA, ref);

            $controller('brotCtrl', {$scope: scope, $location: $location, syncObject: obj, firebaseRef: ref});
            scope.$digest();
        });
    });

    describe('$scope.data', function () {
        it('should contain all items', function () {
            expect(scope.data).toEqual(FIXTURE_DATA);
        });
    });

    describe('$scope.isInEditMode', function () {
        it('should be false in the beginning', function () {
            expect(scope.isInEditMode).toBeFalsy();
        });
    });

    describe('toggle', function () {
        it('should flip the availability', function () {
            var item = scope.data.idAvailable;
            scope.toggle(item);
            expect(scope.data.idAvailable.isAvailable).toBeFalsy();
        });
    });

    describe('$scope.edit()', function () {
        it('should set isInEditMode to true', function () {
            expect(scope.isInEditMode).toBeFalsy();
            scope.edit();
            expect(scope.isInEditMode).toBeTruthy();
        });
    });

    describe('$scope.back()', function () {
        it('should set isInEditMode to false', function () {
            scope.isInEditMode = true;
            expect(scope.isInEditMode).toBeTruthy();
            scope.back();
            expect(scope.isInEditMode).toBeFalsy();
        });
    });

    describe('$scope.add()', function () {
        it('should add an item', function () {
            var initialDataLength = Object.keys(scope.data).length;
            scope.add();
            var eventualDataLength = Object.keys(scope.data).length;
            expect(eventualDataLength).toEqual(initialDataLength + 1);
        });

        it('should set the availability of the new item to false', function () {
            var initialKeys = Object.keys(scope.data);

            scope.add();

            var eventualKeys = Object.keys(scope.data);
            for (var keyIndex in eventualKeys) {
                var key = eventualKeys[keyIndex];
                if (initialKeys.indexOf(key) == -1) {
                    expect(scope.data[key].isAvailable).toBeFalsy();
                }
            }
        });
    });

    describe('$scope.delete()', function () {
        it('should remove an item', function () {
            var item = scope.data.idAvailable;
            scope.delete(item);
            expect(Object.keys(scope.data)).not.toContain('idAvailable');
        });
    });

    function makeObject(initialData, ref) {
        if (!ref) {
            ref = stubRef();
        }
        var obj = $firebaseObject(ref);
        if (angular.isDefined(initialData)) {
            ref.ref().set(initialData);
            ref.flush();
            $timeout.flush();
        }
        return obj;
    }

    function stubRef() {
        return new MockFirebase('Mock://').child(DEFAULT_ID);
    }

    function flushAll() {
        Array.prototype.slice.call(arguments, 0).forEach(function (o) {
            angular.isFunction(o.resolve) ? o.resolve() : o.flush();
        });
        try {
            obj.$ref().flush();
        }
        catch (e) {
        }
        try {
            $interval.flush(500);
        }
        catch (e) {
        }
        try {
            $timeout.flush();
        }
        catch (e) {
        }
    }
});