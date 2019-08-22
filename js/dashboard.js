var app = angular.module('dashboard', []);
var buyArray = [
	{
		"name": "Apple",
		"quantity": "1000",
		"price": "500",
		"mprice": "501",
		"status": "Pending"
	},
	{
		"name": "Apple",
		"quantity": "1000",
		"price": "500",
		"mprice": "501",
		"status": "Pending"
	},
	{
		"name": "Apple",
		"quantity": "1000",
		"price": "500",
		"mprice": "501",
		"status": "Pending"
	},
	{
		"name": "Apple",
		"quantity": "1000",
		"price": "500",
		"mprice": "501",
		"status": "Pending"
	},
	{
		"name": "Apple",
		"quantity": "1000",
		"price": "500",
		"mprice": "501",
		"status": "Pending"
	}
];


app.controller('buyController', function($scope, $http) {
    $http.get("http://localhost:8090/getOrders?id=2562575267")
	  .then(function(response) {
	    $scope.buyArray = response.data;
	  });
})

app.controller('sellController', function($scope, $http) {
	$scope.sellArray = buyArray;
})