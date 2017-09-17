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

app.controller("VoterController", function($scope, $timeout, $interval) {
    $scope.foo = "bar";
    $scope.submitForm = function() {
        alert($scope.voterFirstname + $scope.voterLastname + $scope.voterSSN);
    };
});

app.controller("ElectionController", function($scope, $timeout, $interval) {
    $scope.foo = "bar";
});
