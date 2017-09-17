var BASE_URL = "http://oceans12.herokuapp.com";

var app = angular.module("oceansWeb", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "templates/home.html",
        controller : "HomeController"
    })
    .when("/voter", {
        templateUrl : "templates/voter.html",
        controller : "VoterController"
    })
    .when("/election", {
        templateUrl : "templates/election.html",
        controller : "ElectionController"
    });
});


app.controller("HomeController", function($scope, $timeout, $interval) {
    $scope.electionStatus = "Not running";
    $scope.numVoters = 4024553;
    $scope.numVotes = 0;
    $scope.numQuestions = 5;
    $timeout(function() {
       $scope.electionStatus = "Running";
        $interval(function() {
            $scope.numVotes += 1000 + parseInt(Math.random() * 2000);
        }, 1000);
    }, 2000);
});

app.controller("VoterController", function($scope, $rootScope, $timeout, $http) {
    $scope.submitText = "Register Voter";
    $scope.submitForm = function() {
        $scope.submitText = "Loading...";
        $timeout(function() {
            new QRCode(document.getElementById("qrcode"), JSON.stringify({"address": "heh123", "private_key": "bar321"}));
            $rootScope.qrView = true;
        }, 500);
//        $http.post(
//            BASE_URL + "/signup",
//            {
//                "first_name": $scope.voterFirstname,
//                "last_name": $scope.voterLastname,
//                "ssn": $scope.voterSSN,
//            },
//        ).then(function(response) {
//            $rootScope.qrView = true;
//            console.log(response);
//            $scope.qr = new QRCode(document.getElementById("qrcode"), response);
//        }, function(error) {console.log(error);});
    };
    $scope.resetQR = function() {
        $scope.submitText = "Register Voter";
        $rootScope.qrView = false;
        document.getElementById("qrcode").innerHTML = "";
    };
});

app.controller("ElectionController", function($scope, $timeout, $interval) {
    $scope.foo = "bar";
});
