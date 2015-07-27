angular.module('pedidos')
.controller('BancoCtrl', function($scope,$ionicPlatform,$rootScope, $ionicHistory ,CarregaBanco,sessao,$cordovaSQLite) {
    $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
    });
    $ionicPlatform.ready(function() {

        if(window.cordova) {  
            CarregaBanco.bancoMobile();
        }else{
            CarregaBanco.bancoWeb(); 
        }
    });
})