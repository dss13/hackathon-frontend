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

app.controller("logoutController", function($scope, $cookies, $location) {
  $scope.logout = function () {
      $cookies.remove('token');
      $location.path("/")
  };
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
      $scope.message = "Invalid credentials"
    })
  }
})

app.controller('ordersController', function(getData, postData, $scope,  $cookies, $location) {
    var token = $cookies.get("token")

    if (token == undefined) {
      $location.path("/")
    }

    var url = "http://localhost:8090/orders/getOrders?id=" + token
    getData.async(url).then(function(d) {
      $scope.ordersArray = d;
    }).catch(function(err) {
      console.log(err)
    });

    $scope.letsBuyIt = function(buyModel, type, request) {
      $scope.message = "";
      var data = {
        "orderNumber": buyModel.orderNumber,
        "securityCode": buyModel.securityCode,
        "price": buyModel.price,
        "direction": type,
        "quantity": buyModel.quantity,
        "priceCondition": buyModel.priceCondition,
        "customerCode": $cookies.get("token"),
        "orderStatus": "Pending",
        "tradeTime": buyModel.tradeTime
      }
      console.log($cookies.get("token"))

      postData.async("http://localhost:8090/orders/"+request, data).then(function(response) {
        if (response.code == "1") {
          // alert("Updated successfully")
          location.reload();
          
        } else {
          alert("Unable to process request")
        }
      })
    }
})

app.controller('buyController', function(getData, postData, $scope, $cookies) {

  $scope.getSecurities = function() {
    getData.async("http://localhost:8090/securities/getAll").then(function(response) {
      $scope.securities = response
    }).catch(function(error) {
      alert("Unable to process request")
      $scope.message = "Try again later";
    })
  }

  $scope.letsBuyIt = function() {
    $scope.message = "";
    var data = {
      "orderNumber": "",
      "securityCode": $scope.securityCode,
      "price": $scope.price,
      "direction": $scope.direction,
      "quantity": $scope.quantity,
      "priceCondition": $scope.priceCondition,
      "customerCode": $cookies.get("token"),
      "orderStatus": "Pending"
    }
    console.log(data)
    console.log($cookies.get("token"))

    postData.async("http://localhost:8090/orders/add", data).then(function(response) {
      if (response.code == "1") {
        location.reload()
      } else {
        alert("Unable to process request")
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

setTimeout(function() {
  

}, 0)