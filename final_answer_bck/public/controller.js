/**
 * Created by Idan on 7/26/2015.
 */
//var cfg = require('../app/config/app.js'); 			// load the database config
//dubug = cfg.debug;
var debug =true;

angular.module('github_status', []).controller('mainController', function($scope, $http) {

    $http.get('/api/messages')
        .success(function (data) {
            $scope.messagesList =data;
            if (debug) console.log('data recienved' + data);
        })
        .error(function (data) {
            if (debug) console.log('Error:!!!!! ' + data);
        });

    $http.get('/api/status')
        .success(function (data) {
            $scope.statusIndicator = data;
            if (debug) console.log(data);
        })
        .error(function (data) {
            if (debug) console.log('Error: ' + data);
        });

    $scope.isGood = function(){
        if ($scope.statusIndicator == undefined ) return false;
         return $scope.statusIndicator.status == "good";
    }
    $scope.isMinor = function(){
        if ($scope.statusIndicator == undefined ) return false;
        return $scope.statusIndicator.status == "minor";
    }
    $scope.isMajor = function(){
        if ($scope.statusIndicator == undefined ) return false;
        return $scope.statusIndicator.status == "major";
    }
    $scope.UpdateMessages = function(){
        $http.get('/api/messages')
            .success(function (data) {
                $scope.messagesList = data;
                if (debug) console.log(data);
            })
            .error(function (data) {
                if (debug) console.log('Error: ' + data);
            });
    }

    $scope.UpdateStatus = function(){

        $http.get('/api/status')
            .success(function (data) {
                $scope.statusIndicator=data;
                console.log("data")
                if (debug) console.log(data);
            })
            .error(function (data) {
                if (debug) console.log('Error: ' + data);
            });
    }
})