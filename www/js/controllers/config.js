angular.module('pedidos')
.controller('ConfigCtrl', function($scope,$state,$rootScope,$window,$cordovaSQLite,$timeout,$ionicPlatform,sessao,$stateParams) {
    $scope.doTheBack = function() {
        $window.history.back();
    };
    $scope.data = {
        liberaSuccess: false,
        liberaError  : false
    };
    $scope.msgError = null;
    $scope.config = {};

    $ionicPlatform.ready($scope.selecionaConf = function() {
        var query = "SELECT * FROM configuracao";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
                for(var i = 0; i < res.rows.length; i++) {
                    $scope.config.porta = Number(res.rows.item(i).porta);
                    $scope.config.caminho = res.rows.item(i).caminho;
                    $scope.config.diretorio = res.rows.item(i).diretorio;
                    $scope.config.npedido = Number(res.rows.item(i).npedido);
                }
            }

        }, function (err) {
            console.error(err);
        });
    });


    $scope.salvaConfig = function(){

        var query = "UPDATE configuracao set porta = " + $scope.config.porta + ", caminho = '" + $scope.config.caminho + "' , diretorio = '" + $scope.config.diretorio + "', npedido = " + $scope.config.npedido;
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            sessao.setData("sess_porta",$scope.config.porta);
            sessao.setData("sess_caminho",$scope.config.caminho);
            sessao.setData("sess_diretorio",$scope.config.diretorio);
            sessao.setData("sess_npedido",$scope.config.npedido);
            $scope.data = {
                liberaSuccess: true
            };
            $scope.msgSuccess  = "Config alterado com sucesso";  
            $timeout(function() {
                $scope.data = {
                    liberaSuccess: false
                };
            }, 2000);    

        }, function (err) {
            console.error(err);
        }); 
    }; 
});
    
    