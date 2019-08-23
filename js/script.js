var app = angular.module('app', ["ngRoute", "ngCookies"]);

app.config(function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "login.html",
    })
    .when("/dashboard", {
      templateUrl: "dashboard.html"
    })
})

app.controller('loginController', function(postData, $scope, $location, $cookies) {
  if ($cookies.get("token") != undefined) {
    $location.path("/dashboard")
  }
  var url = "http://localhost:8090/customer/auth"
  $scope.authenticate = function() {
    $scope.message = ""

    var data = {
      "emailAddress": $scope.email,
      "password": $scope.password
    }
    postData.async(url, data).then(function(d) {
      if (d.code == 1) {
        $cookies.put("token", d.token)
        $location.path("/dashboard")
      } else {
        $scope.message = "Invalid credentials"
      }
    }).catch(function(err) {
      $scope.message = err
    })
  }
})

app.controller('ordersController', function(getData, $scope, $rootScope, $cookies, $location) {
    var token = $cookies.get("token")

    if (token == undefined) {
      $rootScope.isSignedIn = false
      $location.path("/")
    }

    $rootScope.isSignedIn = true

    var url = "http://localhost:8090/orders/getOrders?id=" + token
    getData.async(url).then(function(d) {
      $scope.ordersArray = d;
    }).catch(function(err) {
      console.log(err)
    });
})

app.controller('buyController', function(getData, postData, $scope, $cookies) {
  $rootScope.isSignedIn = true

  $scope.letsBuyIt = function() {
    var url = "http://localhost:8000/securities/getAll"
    getData.async(url).then(function(response) {
      $scope.securities = response
      console.log(response)
    }).catch(function(error) {
      $scope.message = "Try again later";
    })
    $scope.message = "";
    var data = {
      "orderNumber": $scope.orderNumber,
      "securityCode": $scope.securityCode,
      "price": $scope.price,
      "direction": $scope.direction,
      "quantity": $scope.quantity,
      "priceCondition": $scope.priceCondition,
      "customerCode": $cookies.get("token"),
      "orderStatus": "Pending"
    }
    url = "http://localhost:8090/orders/add"
    postData.async(url, data).then(function(response) {
      if (response.code == "1") {
        var newArray = $scope.ordersArray;
        newArray.push(data)

        $scope.ordersArray = newArray;
        $scope.$apply()
      } else {
        $scope.message = "Unable to process request"
      }
    })
  }
})

app.factory('getData', function($http) {
  var getData = {
    async: function(url) {
      var promise = $http.get(url).then(function (response) {
        return response.data;
      });
      return promise;
    }
  };
  return getData;
});

app.factory('postData', function($http) {
  var postData = {
    async: function(url, data) {
      var promise = $http.post(url, data).then(function (response) {
        return response.data;
      });
      return promise;
    }
  };
  return postData;
});