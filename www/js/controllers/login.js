angular.module('pedidos')
    .controller('LoginCtrl', function($scope,$state,$rootScope,$ionicPopup,sessao,$location,$http,CarregaBanco,$cordovaSQLite,AuthenticationService,sessao,$timeout,$ionicLoading) {

    var query = "SELECT * FROM configuracao";
    $cordovaSQLite.execute(db, query, []).then(function(res) {
        if(res.rows.length > 0) {
            for(var i = 0; i < res.rows.length; i++) {                    
                sessao.setData("sess_porta",Number(res.rows.item(i).porta));
                sessao.setData("sess_caminho",res.rows.item(i).caminho);
                sessao.setData("sess_diretorio",res.rows.item(i).diretorio);
                sessao.setData("sess_npedido",Number(res.rows.item(i).npedido));
            }
        }

    }, function (err) {
        //console.error(err);
    });


    $scope.abreGestor = function(){


        window.open('http://'+sessao.getData('sess_caminho')+':'+sessao.getData('sess_porta')
                    +'/gestorweb', '_system', 'location=yes');

        return false;   


    }
    $scope.login = function () {
        
        $ionicLoading.show({ template: 'Carregando.<br><ion-spinner></ion-spinner>' });
        AuthenticationService.ClearCredentials();
        AuthenticationService.Login($scope.data.usuario, $scope.data.senha, function(response) {
            if(response.success) {
                AuthenticationService.SetCredentials($scope.data.usuario.toLowerCase(), $scope.data.senha);
                $location.path('/pedidos/home');
            } else {
                $scope.error = response.message;
                $timeout(function(){
                    $scope.error = '';
                }, 10000);
            }
            $ionicLoading.hide();
        });
    };

    $scope.data = {}
    $scope.importar = function (){ 

        var myPopup = $ionicPopup.show({
            template: '<div class="list"><label class="item item-input"><input type="text" ng-model="data.login" name="login" id="login" placeholder="Usuario"></label><label class="item item-input"><input type="password" id="pass" ng-model="data.pass" name="pass" placeholder="Senha"></label></div>',
            title: 'Logue para importar',
            subTitle:'Necessario estar conectado na internet',
            scope: $scope,
            buttons: [
                { text: 'Cancelar' },
                {
                    text: '<b>Importar</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if ($scope.data.login && $scope.data.pass) {
                            $http({
                                method: 'POST',
                                url: 'http://'+sessao.getData("sess_caminho")+':'+sessao.getData("sess_porta")
                                +sessao.getData("sess_diretorio")+'pedidos.p',
                                data:'tipo=valida_usuario&usuario='+$scope.data.login+'&senha='+$scope.data.pass,
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).success(function (data, status, headers, config) { 
                                if(data.pedidos.valida_usuario[0]['retorna'] == "yes" ){ 
                                CarregaBanco.importar(data.pedidos.valida_usuario[0]['cd-empresa'],data.pedidos.valida_usuario[0]['cd-filial'],function(response){

                                        if(response.sucesso){ 
                                            $scope.sucesso = response.sucesso;
                                            $timeout(function(){
                                                $scope.sucesso = '';
                                            }, 9300);  

                                        }
                                    });


                                    myPopup.close();
                                }else{
                                    alert("Senha Incorreta ou Usuario nao existe!");
                                }
                            }).
                            error(function(data, status, headers, config) {
                                
                                console.log(data);
                                console.log(status);
                                console.log(headers);
                                console.log(config);
                                alert("Internet offline / nao foi possivel importar os dados");
                            });  



                            e.preventDefault();
                        }
                    }
                },
            ]
        });

    }
});