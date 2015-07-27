angular.module('pedidos')
    .controller('PedidoCtrl', function($scope,$state,$rootScope,AuthenticationService,$location,LimpaPedidos) {
    $scope.logout = function(){
        AuthenticationService.ClearCredentials();
        var formData = null;
         LimpaPedidos.setLimpaPedidos(formData);
        $location.path('/login');
    }; 


});