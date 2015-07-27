angular.module('pedidos')
    .controller('ListarPedidosCtrl', function($scope, $ionicPlatform, $cordovaSQLite,sessao, $timeout, $filter, $ionicModal,Pedido,NPedido,$rootScope,$ionicLoading,$location,$http,Banco,sessao) {
    $scope.pedidos = [];
    /*
    $rootScope.$on('rootScope:broadcast', function (event, data) {
        $scope.pedidos  = data;
    });
    */
    $ionicLoading.show({ template: 'Carregando Pedido.<br><ion-spinner></ion-spinner>' });
    $scope.pedidos = [];

    $scope.$watch(function () { return Pedido.getPedido(); },
                  function (value) {
        $scope.pedidos = value;
        $ionicLoading.hide();
    }
                 );

    $scope.deletar = function(str){
        $ionicLoading.show({ template: 'Deletando Pedido.<br><ion-spinner></ion-spinner>' });
        var query = "DELETE FROM fatm007 where nr_pedido = ?";
        $cordovaSQLite.execute(db, query, [str.id]).then(function(res) {
            var query = "DELETE FROM fatm008 where nr_pedido = ?";
            $cordovaSQLite.execute(db, query, [str.id]).then(function(res) {
                var query = "DELETE FROM fatm010 where nr_pedido = ?";
                $cordovaSQLite.execute(db, query, [str.id]).then(function(res) {
                    console.log("deletado com sucesso");
                    var index = $scope.pedidos.indexOf(str);
                    $scope.pedidos.splice(index, 1);
                    NPedido.setNpedido(NPedido.getNpedido()-1);
                    $ionicLoading.hide();
                }, function (err) {
                    console.error(err);
                });
            }, function (err) {
                console.error(err);
            });
        }, function (err) {
            console.error(err);
        });
    }


    $scope.exportar = function(){ 

        $ionicLoading.show({ template: 'Exportando dados.<br><ion-spinner></ion-spinner>' });
        $scope.TodoPedidos = [];
        $scope.TodoItens = [];
        $scope.TodoVencimentos = [];
        var query_pedidos = "SELECT * FROM fatm007";
        $cordovaSQLite.execute(db, query_pedidos, []).then(function(res_pedidos) {
            if(res_pedidos.rows.length > 0) {
                for(var a = 0; a < res_pedidos.rows.length; a++) {
                    var pattern = /(\d{4})(\d{2})(\d{2})/;
                    var data_entreg = res_pedidos.rows.item(a).data_entrega.toString().replace(/\-/g,'');  
                    var data_entrega = data_entreg.replace(pattern, '$3/$2/$1');
                    var data_base_prec = res_pedidos.rows.item(a).data_base_preco.replace(/\-/g,'');  
                    var data_base_preco = data_base_prec.replace(pattern, '$3/$2/$1');
                    var data_pedid = res_pedidos.rows.item(a).data_pedido.replace(/\-/g,'');  
                    var data_pedido = data_pedid.replace(pattern, '$3/$2/$1');
                    $scope.TodoPedidos.push({nr_pedido:res_pedidos.rows.item(a).nr_pedido, data_pedido:data_pedido,  cd_indice:res_pedidos.rows.item(a).cd_indice, cgc_cpf:res_pedidos.rows.item(a).cgc_cpf, local_fat:res_pedidos.rows.item(a).local_fat, data_entrega:data_entrega, data_base_preco:data_base_preco, cd_safra:res_pedidos.rows.item(a).cd_safra, cd_empresa:res_pedidos.rows.item(a).cd_empresa, cd_filial:res_pedidos.rows.item(a).cd_filial,tipo:res_pedidos.rows.item(a).tipo,e_mail:res_pedidos.rows.item(a).e_mail,produtos:$.param(Banco.fatc008(res_pedidos.rows.item(a).nr_pedido)),vencimento:Banco.fatm010(res_pedidos.rows.item(a).nr_pedido)});  
                }


                if($scope.TodoPedidos.length == res_pedidos.rows.length && $scope.TodoPedidos.length != 0){
                    for(var a = 0; a < res_pedidos.rows.length; a++) {
                        $http({
                            method: 'POST',
                            url:'http://'+sessao.getData("sess_caminho")+':'+sessao.getData("sess_porta")
                            +sessao.getData("sess_diretorio")+'fatm007ip.p',
                            data:$.param($scope.TodoPedidos[a])+"&executa=yes&tipo=pedidos",
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).success(function (data, status, headers, config) {
                            //console.log(data);
                        });
                        
                    console.log('pedidos');
                    }  
                }
                if(a == res_pedidos.rows.length){
                    var query_itens = "SELECT * FROM fatm008";
                    $cordovaSQLite.execute(db, query_itens, []).then(function(res_itens) {
                        if(res_itens.rows.length > 0) {
                            for(var b = 0; b < res_itens.rows.length; b++) {
                                var val_un = res_itens.rows.item(b).vlr_unitario;
                                $scope.TodoItens.push({id:res_itens.rows.item(b).id,cd_iten: res_itens.rows.item(b).cd_iten,nr_pedido:res_itens.rows.item(b).nr_pedido,cd_empresa:res_itens.rows.item(b).cd_empresa,cd_filial:res_itens.rows.item(b).cd_filial,tipo:res_itens.rows.item(b).tipo,qtd:res_itens.rows.item(b).qtd,val_unit_bruto:res_itens.rows.item(b).vlr_unit_bruto,vlr_bruto:res_itens.rows.item(b).vlr_bruto,vlr_unitario:res_itens.rows.item(b).vlr_unitario,seq_item:res_itens.rows.item(b).seq_item,vlr_total:res_itens.rows.item(b).vlr_total,cd_indice:res_itens.rows.item(b).cd_indice,cd_safra:res_itens.rows.item(b).cd_safra,vlr_desconto:res_itens.rows.item(b).vlr_desconto,bloqueado:res_itens.rows.item(b).bloqueado,vlr_frete:res_itens.rows.item(b).vlr_frete,custo:res_itens.rows.item(b).custo,un:res_itens.rows.item(b).un,preco_venda:res_itens.rows.item(b).preco_venda,descricao:res_itens.rows.item(b).descricao,lucro:res_itens.rows.item(b).lucro,lucroCent:res_itens.rows.item(b).lucroCent});
                            }
                            if($scope.TodoItens.length == res_itens.rows.length && $scope.TodoItens.length != 0){
                                for(var b = 0; b < res_itens.rows.length; b++) {
                                    $http({
                                        method: 'POST',
                                        url:'http://'+sessao.getData("sess_caminho")+':'+sessao.getData("sess_porta")
                                        +sessao.getData("sess_diretorio")+'fatm007ip.p',
                                        data:$.param($scope.TodoItens[b])+'&executa=yes&tipo=itens',
                                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                    }).success(function (data, status, headers, config) {
                                        //console.log(data);
                                    });
                                    
                                console.log('itens');
                                }  
                            }
                            if(b == res_itens.rows.length){   
                                var query_vencimentos = "SELECT * FROM fatm010";
                                $cordovaSQLite.execute(db, query_vencimentos, []).then(function(res_vencimentos) {
                                    if(res_vencimentos.rows.length > 0) {
                                        for(var c = 0; c < res_vencimentos.rows.length; c++) {

                                            var pattern = /(\d{4})(\d{2})(\d{2})/;
                                            var data_vct = res_vencimentos.rows.item(c).data_vcto.toString().replace(/\-/g,'');  
                                            var data_vcto = data_vct.replace(pattern, '$3/$2/$1');   $scope.TodoVencimentos.push({id:res_vencimentos.rows.item(c).id,cd_empresa:res_vencimentos.rows.item(c).cd_empresa,cd_entrada:res_vencimentos.rows.item(c).cd_entrada,cd_filial:res_vencimentos.rows.item(c).cd_filial,data_vcto:data_vcto,nr_pedido:res_vencimentos.rows.item(c).nr_pedido,prazo_dias:res_vencimentos.rows.item(c).prazo_dias,seq:res_vencimentos.rows.item(c).seq,tipo:res_vencimentos.rows.item(c).tipo,vlr_vcto:res_vencimentos.rows.item(c).vlr_vcto,prazo:res_vencimentos.rows.item(c).prazo});
                                        }
                                        if($scope.TodoVencimentos.length == res_vencimentos.rows.length && $scope.TodoVencimentos.length != 0){
                                            for(var c = 0; c < res_vencimentos.rows.length; c++) {
                                                $http({
                                                    method: 'POST', 
                                                    url:'http://'+sessao.getData("sess_caminho")+':'+sessao.getData("sess_porta")
                                                    +sessao.getData("sess_diretorio")+'fatm007ip.p',
                                                    data:$.param($scope.TodoVencimentos[c])+'&executa=yes&tipo=vencimentos',
                                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                                }).success(function (data, status, headers, config) {
                                                    //console.log(data);
                                                });
                                                
                                            console.log('vencimentos');
                                            }  
                                            $ionicLoading.hide();
                                            $scope.sucesso = "Exportado com sucesso os pedidos";
                                            $timeout(function(){
                                                $scope.sucesso = '';
                                            }, 9300);  
                                        }


                                        //console.log($scope.TodoVencimentos);    
                                    }  

                                }, function (err) {
                                    console.error(err);
                                });  

                            }

                        }
                    }, function (err) {
                        console.error(err);
                    }); 

                }
            }
        }, function (err) {
            console.error(err);
        });

    };
});

