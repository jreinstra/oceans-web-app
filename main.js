var app = angular.module("oceansWeb", []); 

app.controller("mainStats", function($scope, $timeout, $interval) {
    $scope.electionStatus = "Not running";
    $scope.numVoters = 4024553;
    $scope.numVotes = 0;
    $timeout(function() {
       $scope.electionStatus = "Running";
        console.log("running");
        $interval(function() {
            $scope.numVotes += 1000 + parseInt(Math.random() * 2000);
        }, 1000);
    }, 2000);
});