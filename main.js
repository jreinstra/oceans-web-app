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


app.controller("HomeController", function($scope) {
    $scope.electionStatus = "Not running";
    $scope.numVoters = 4024553;
    $scope.numVotes = 0;
    $scope.numQuestions = 5;
    $scope.start = function() {
        $scope.electionStatus = "Running";
    }
    $scope.stop = function() {
        $scope.electionStatus = "Not running";
    }
});

app.controller("VoterController", function($scope, $rootScope, $timeout, $http) {
    $scope.submitText = "Register Voter";
    $scope.submitForm = function() {
        $scope.submitText = "Loading...";
        $http.post(
            BASE_URL + "/voter/",
            {
                "first_name": $scope.voterFirstname,
                "last_name": $scope.voterLastname,
                "ssn": $scope.voterSSN,
            },
        ).then(function(response) {
            console.log(response);
            $rootScope.qrView = true;
            $scope.qr = new QRCode(document.getElementById("qrcode"), JSON.stringify(response.data));
        }, function(error) {alert(error.data);});
    };
    $scope.resetQR = function() {
        $scope.submitText = "Register Voter";
        $rootScope.qrView = false;
        document.getElementById("qrcode").innerHTML = "";
    };
});

app.controller("ElectionController", function($scope, $http) {
    $scope.submitText = "Add Prompt";
    $scope.loadData = function() {
            $http.get(BASE_URL + "/questions/").then(function(response) {
            $scope.questions = response.data;
            $scope.submitText = "Add Prompt";
        }, function(error) { alert(error.data); });
    }
    $scope.submitForm = function() {
        $scope.submitText = "Adding...";
        $http.post(
            BASE_URL + "/questions",
            {
                "title": $scope.questionTitle,
                "candidates": $scope.questionCandidates.split(",")
            },
        ).then(function(response) {
            $scope.loadData();
        }, function(error) {alert(error.data);});
    };
    $scope.loadData();
});
