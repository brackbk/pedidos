angular.module('pedidos')
    .controller('MostraCtrl', function($scope,$state,$rootScope,$window,$timeout,$ionicPlatform,sessao,$stateParams,$location,$cordovaSQLite,$filter,$ionicLoading) {
    $scope.formData.totalitens = {}; 
    if($scope.formData.produtos.length == 0){
        $scope.testando = 0;  
    }else{
        for(var i = 0; i < $scope.formData.produtos.length; i++) {
            if($scope.formData.produtos[i].id_iten == $stateParams.id_iten){
                $scope.testando = i;
            }
        }
        $ionicLoading.show({ template: 'Cargando Iten.<br><ion-spinner></ion-spinner>' });
        
            var dataa = $filter('date')($scope.formData.dataprecio,'yyyy-MM-dd');
        console.log(dataa);
        var query = "SELECT * FROM fatc001 WHERE cd_iten = ? AND cd_empresa = ? AND DATE(data_mvto) < DATE(?) ORDER BY data_mvto desc";
        $cordovaSQLite.execute(db, query, [$stateParams.id_iten,sessao.getData("sess_empresa"),dataa]).then(function(res) {
            
        
            if(res.rows.length > 0) {
                for(var i = 0; i < res.rows.length; i++) {
                      console.log(res.rows.item(i).preco_venda_menor);
                    var val_un = $filter('comma2decimal')(res.rows.item(i).preco_venda_menor);
                    var custo =  $filter('comma2decimal')(res.rows.item(i).preco_custo);
                    if(!$scope.formData.produtos[$scope.testando].custo){
                        $scope.formData.produtos[$scope.testando].custo = custo;
                    }
                    if(!$scope.formData.produtos[$scope.testando].val_un){
                        $scope.formData.produtos[$scope.testando].val_un =val_un;
                    }
                    if(!$scope.formData.produtos[$scope.testando].total){
                        $scope.formData.produtos[$scope.testando].total = val_un; 
                    }
                }
            }else{
                    var index = $scope.formData.produtos.indexOf($scope.formData.produtos[i]);
                    $scope.formData.produtos.splice(index, 1);
               alert("Iten no tiene preco de venda, Escolha outro iten"); 
            $state.go("^.itens");   
            }
            $ionicLoading.hide();
        }, function (err) {
            console.error(err);
            $ionicLoading.hide();
        });     

    }



    $scope.calcular = function(cantidad,val_un){
        if(cantidad !="" && val_un !=""){
            $scope.getTotalLucro();
            $scope.formData.produtos[$scope.testando].total = cantidad * val_un;
            var totalcusto = cantidad * $scope.formData.produtos[$scope.testando].custo;
            if($scope.formData.produtos[$scope.testando].total > 0){
                
                $scope.formData.produtos[$scope.testando].lucro = $scope.formData.produtos[$scope.testando].total - totalcusto;
                $scope.formData.produtos[$scope.testando].lucroCent = (($scope.formData.produtos[$scope.testando].lucro / $scope.formData.produtos[$scope.testando].total) * 100);
                
            }
        }
    };    
    $scope.cancelaritem = function(str){

        if($scope.tipo == 'i'){
            var index = $scope.formData.produtos.indexOf(str);
            if(!typeof $scope.formData.total ==='undefined'){
                $scope.formData.total = $scope.formData.total - str.total; 
            }
            $scope.formData.produtos.splice(index, 1);
        }else{
            var query_itens = "SELECT * FROM fatm008 WHERE nr_pedido = ? AND cd_iten = ? "; 
            $cordovaSQLite.execute(db, query_itens, [$scope.formData.npedido,$stateParams.id_iten]).then(function(res) { 

                console.log("rows "+res.rows.length);
                if(res.rows.length == 0) {
                    var index = $scope.formData.produtos.indexOf(str);
                    $scope.formData.total = $scope.formData.total - str.total;
                    $scope.formData.produtos.splice(index, 1);
                }
                console.log($scope.formData.produtos);


            });


        }
        $state.go("^.itens");
    };
    $scope.salvaritem = function(str){
        $ionicLoading.show({ template: 'Salvando Iten.<br><ion-spinner></ion-spinner>' });
        $scope.calcular(str.cantidad,str.val_un);
        $ionicLoading.hide();
        $state.go("^.itens");   
    }; 


});