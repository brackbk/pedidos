angular.module('pedidos')
    .controller('InserirPedidosCtrl', function($scope, $ionicPlatform, $cordovaSQLite,sessao, $timeout, $filter, $ionicModal, $state, $ionicLoading,NPedido,Pedido,$rootScope,$stateParams,VerificaDados,LimpaPedidos) {


    $scope.limparPedidos = function(){
        $scope.tipo = "i";
        $scope.titulo = "Inserir Pedido";

        today = new Date();
        var datafinal= new Date(today.getTime() + 31*24*60*60*1000); 
        $scope.formData = {datapedido:new Date(),entregai:30,entregaf:datafinal,dataprecio:new Date(), moneda:'', buscaparcero:'',buscaitens:'',produtos:[],total:0,vencimento:[],totallucro:0,totallucroCent:0,email:'',deletaritens:[],npedido:NPedido.getNpedido(),cuotas:1};  
    }

    if($state.params.id){

        $ionicLoading.show({ template: 'Carregando Dados.<br><ion-spinner></ion-spinner>' });
        $scope.tipo = "a";
        $scope.titulo = "Alterar Pedido";
        $scope.formData = {};
        $scope.formData.cuotas = 1;
        var query = "SELECT * FROM fatm007 WHERE nr_pedido = ?";
        $cordovaSQLite.execute(db, query, [$state.params.id]).then(function(res) {
            if(res.rows.length > 0) {
                for(var i = 0; i < res.rows.length; i++) {
                    $scope.formData = {npedido: res.rows.item(i).nr_pedido,datapedido:new Date(res.rows.item(i).data_pedido), moneda: res.rows.item(i).cd_indice,parcero:res.rows.item(i).cgc_cpf,localparcero:res.rows.item(i).local_fat,entregai:res.rows.item(i).entregai,entregaf:new Date(res.rows.item(i).data_entrega),dataprecio:new Date(res.rows.item(i).data_base_preco),destino:res.rows.item(i).cd_safra,email:res.rows.item(i).e_mail,deletaritens:[],produtos:[],vencimento:[]}; 
                }

                var query = "SELECT * FROM fatm008 WHERE nr_pedido = ?";
                $cordovaSQLite.execute(db, query, [$state.params.id]).then(function(res) {
                    if(res.rows.length > 0) {
                        for(var i = 0; i < res.rows.length; i++) {
                            var val_un = res.rows.item(i).vlr_unitario;
                            $scope.formData.produtos.push({id:(i+1),id_iten: res.rows.item(i).cd_iten,un:res.rows.item(i).un,cantidad:res.rows.item(i).qtd,val_un:val_un, text: unescape(res.rows.item(i).descricao), total:res.rows.item(i).vlr_bruto, custo: res.rows.item(i).custo,lucro:res.rows.item(i).lucro,preco_venda:res.rows.item(i).preco_venda,lucroCent:res.rows.item(i).lucroCent, checked: false, icon: null});


                            $scope.formData.total = res.rows.item(i).vlr_total;
                            console.log($scope.formData.total);
                        }
                    }
                }, function (err) {
                    console.error(err);
                }); 

                var query = "SELECT * FROM fatm010 WHERE nr_pedido = ?";
                $cordovaSQLite.execute(db, query, [$state.params.id]).then(function(res) {
                    if(res.rows.length > 0) {
                        for(var i = 0; i < res.rows.length; i++) {
                            $scope.formData.vencimento.push({id:(i+1),cuotas:res.rows.length,data:new Date(res.rows.item(i).data_vcto),entrada:(res.rows.item(i).cd_entrada=="si"?res.rows.item(i).cd_entrada:"no"), valor:res.rows.item(i).vlr_vcto,prazo:res.rows.item(i).prazo});
                            $scope.formData.cuotas = res.rows.length;
                        }
                    }


                    $ionicLoading.hide();   
                }, function (err) {
                    console.error(err);
                });   
            }

        }, function (err) {
            console.error(err);
        });
    }else{

        $scope.tipo = "i";
        $scope.titulo = "Inserir Pedido";

        today = new Date();
        var datafinal= new Date(today.getTime() + 31*24*60*60*1000); 
        $scope.formData = {datapedido:new Date(),entregai:30,entregaf:datafinal,dataprecio:new Date(), moneda:'', buscaparcero:'',buscaitens:'',produtos:[],total:0,vencimento:[],totallucro:0,totallucroCent:0,email:'',deletaritens:[],npedido:NPedido.getNpedido(),cuotas:1};  

        $scope.$watch(function () { return LimpaPedidos.getLimpaPedidos(); },
                      function (value) {
            
            console.log(LimpaPedidos.getLimpaPedidos());
            if(value == null){
              $scope.limparPedidos(); 
              LimpaPedidos.setLimpaPedidos($scope.formData);  
            }
        }
                     );



        /**************************INICIO FATM007********************************/
        $scope.$watch(function () { return NPedido.getNpedido(); },
                      function (value) {
            $scope.formData.npedido = value;
        }
                     );



    }
$scope.limparPed = function(){
    LimpaPedidos.setLimpaPedidos(null);  
    $state.go("pedidos.inserir");
}

    $scope.processForm = function() {
        alert('enviou!');
    };





    /**************************FIM FATM007********************************/


    /**************************INICIO finc002********************************/
    $scope.monedas = [];
    var query = "SELECT cd_indice, descricao FROM finc002 WHERE cd_empresa ="+sessao.getData("sess_empresa");
    $cordovaSQLite.execute(db, query, []).then(function(res) {
        if(res.rows.length > 0) {
            for(var i = 0; i < res.rows.length; i++) {
                $scope.monedas.push({id: res.rows.item(i).cd_indice, text: res.rows.item(i).descricao, checked: false, icon: null});
            }
        }
    }, function (err) {
        console.error(err);
    });

    $scope.lamoneda = 'Selecione una Moneda';  

    /**************************FIM finc002********************************/


    /**************************INICIO cadc001********************************/
    $scope.parceros = [];
    var query = "SELECT * FROM cadc001 WHERE cd_empresa ="+sessao.getData("sess_empresa")+" LIMIT 0, 20";
    $cordovaSQLite.execute(db, query, []).then(function(res) {
        if(res.rows.length > 0) {
            for(var i = 0; i < res.rows.length; i++) {
                $scope.parceros.push({id: res.rows.item(i).cgc_cpf, text: unescape(res.rows.item(i).nome), checked: false, icon: null});
            }
        }
    }, function (err) {
        console.error(err);
    });    

    $scope.elparcero = 'Selecione un Parcero';


    $scope.fparceros = function(){

        var limit_i = $scope.parceros.length+1;

        var limit_f = limit_i + 5;
        var query = "SELECT * FROM cadc001 WHERE cd_empresa ="+sessao.getData("sess_empresa")+" LIMIT "+limit_i+", "+limit_f;
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
                for(var i = 0; i < res.rows.length; i++) {
                    $scope.parceros.push({id: res.rows.item(i).cgc_cpf, text: unescape(res.rows.item(i).nome), checked: false, icon: null});
                }
            }
        }, function (err) {
            console.error(err);
        });    
    };   


    $scope.$watch("formData.buscaparcero", function(newValue, oldValue) {
        $scope.parceros.length = 0;
        var query = "SELECT * FROM cadc001 WHERE cd_empresa ="+sessao.getData("sess_empresa")+" AND (nome LIKE '%"+$scope.formData.buscaparcero+"%' OR cgc_cpf LIKE '%"+$scope.formData.buscaparcero+"%')  LIMIT 0, 20";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
                for(var i = 0; i < res.rows.length; i++) {
                    $scope.parceros.push({id: res.rows.item(i).cgc_cpf, text: unescape(res.rows.item(i).nome), checked: false, icon: null});
                }
            }
        }, function (err) {
            console.error(err);
        });    
    });        

    /**************************FIM cadc001********************************/

    /**************************INICIO cadc001a********************************/
    $scope.$watch("formData.parcero", function(newValue, oldValue) {
        $scope.localparceros = [];
        if($scope.formData.parcero != null){
            if(!$state.params.id){
                $scope.formData.localparcero = '';
            }
            var query = "SELECT * FROM cadc001a JOIN cadc003 on cadc001a.cd_municipio = cadc003.cd_municipio WHERE cgc_cpf = '"+$scope.formData.parcero+"' AND cd_empresa ="+sessao.getData("sess_empresa");
            $cordovaSQLite.execute(db, query, []).then(function(res) {
                if(res.rows.length > 0) {
                    for(var i = 0; i < res.rows.length; i++) {
                        $scope.localparceros.push({id: res.rows.item(i).local_fat, text: unescape(res.rows.item(i).descricao)+" - "+unescape(res.rows.item(i).endereco), checked: false, icon: null});
                    }
                }
            }, function (err) {
                console.error(err);
            });
        }
    });  

    $scope.ellocalparcero = 'Selecione o Local del Parcero';


    /**************************FIM cadc001a********************************/

    $scope.alteraData = function (str){
        str++;
        today = new Date();
        $scope.formData.entregaf = new Date(today.getTime() + str*24*60*60*1000); 
    };


    $scope.alteraDatai = function (newValue){
        function daydiff(first, second) {
            return (second-first)/(1000*60*60*24);
        }

        var data = new Date();
        var final = new Date(newValue);
        $scope.formData.entregai = parseInt(daydiff(data, final));
    };

    /**************************INICIO agrc016********************************/
    $scope.$watch("formData.datapedido", function(newValue, oldValue) {
        $scope.destinos = [];
        if($scope.formData.datapedido != null){

            var dataa = $filter('date')($scope.formData.datapedido,'yyyy-MM-dd');
            var query = "SELECT * FROM agrc016 WHERE DATE(data_vcto) <= DATE('"+dataa+"') AND cd_empresa ="+sessao.getData("sess_empresa");
            $cordovaSQLite.execute(db, query, []).then(function(res) {
                if(res.rows.length > 0) {
                    for(var i = 0; i < res.rows.length; i++) {
                        $scope.destinos.push({id: res.rows.item(i).cd_safra, text: res.rows.item(i).descricao, checked: false, icon: null});
                    }
                }
            }, function (err) {
                console.error(err);
            });
        }
    });  

    $scope.eldestino = 'Selecione un Destino';


    /**************************FIM agrc016********************************/

    /* ABA 2 */

    /**************************INICIO estc007********************************/
    $scope.itenslist = [];
    var query ="SELECT * FROM estc007 WHERE estc007.cd_empresa = ? ORDER BY estc007.cd_iten LIMIT 0, 20";
    $cordovaSQLite.execute(db, query, [sessao.getData("sess_empresa")]).then(function(res) {
        if(res.rows.length > 0) {
            for(var i = 0; i < res.rows.length; i++) {
                $scope.itenslist.push({id: res.rows.item(i).cd_iten,un:res.rows.item(i).cd_unidade,cantidad:1,val_un:0, text: unescape(res.rows.item(i).descricao), total:0, custo:0,lucro:0,preco_venda:0,lucroCent:0, checked: false, icon: null});
            }
        }
    }, function (err) {
        console.error(err);
    });    


    $scope.elitem = 'Selecione los Itens';  


    $scope.fitens = function(){

        var limit_i = $scope.itenslist.length+1;
        var limit_f = limit_i + 5;
        var query = "SELECT * FROM estc007 WHERE estc007.cd_empresa = ? ORDER BY estc007.cd_iten LIMIT "+limit_i+", "+limit_f;
        $cordovaSQLite.execute(db, query, [sessao.getData("sess_empresa")]).then(function(res) {
            if(res.rows.length > 0) {
                for(var i = 0; i < res.rows.length; i++) {
                    $scope.itenslist.push({id: res.rows.item(i).cd_iten,un:res.rows.item(i).cd_unidade,cantidad:1,val_un:0, text: unescape(res.rows.item(i).descricao), total:0, custo:0,lucro:0,preco_venda:0,lucroCent:0, checked: false, icon: null});
                }
            }
        }, function (err) {
            console.error(err);
        });    
    };      

    $scope.$watch("formData.buscaitens", function(newValue, oldValue) {
        var query = "SELECT * FROM estc007 WHERE estc007.cd_empresa = ? AND (estc007.descricao LIKE '%"+$scope.formData.buscaitens+"%' OR estc007.cd_iten LIKE '%"+$scope.formData.buscaitens+"%') ORDER BY estc007.cd_iten LIMIT 0, 20";
        $cordovaSQLite.execute(db, query, [sessao.getData("sess_empresa")]).then(function(res) {
            if(res.rows.length > 0) {
                for(var i = 0; i < res.rows.length; i++) {
                    $scope.itenslist.push({id: res.rows.item(i).cd_iten,un:res.rows.item(i).cd_unidade,cantidad:1,val_un:0, text: unescape(res.rows.item(i).descricao), total:0, custo:0,lucro:0,preco_venda:0,lucroCent:0, checked: false, icon: null});
                }
            }
        }, function (err) {
            console.error(err);
        });    
    });      




    /**************************FIM estc007********************************/ 
    $scope.vencimento = {entrada:0, prazo:30,data:new Date(), cuotas:1,valor:0,entrada:''};
    $scope.mostraVencimento = function(){
        $ionicModal.fromTemplateUrl('templates/addvencimento.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
            modal.show();
        });
    }

    $scope.cadVencimento = function(cuotas){
        var prazototal =0;
        var sobra = 0;
        for(var i = 0; i <cuotas; i++) {
            var tdata = new Date();

            var valor = ($scope.formData.total / cuotas);
            sobra = sobra + Number(valor.toFixed(2));
            var prazototal = parseInt(prazototal) + $scope.formData.entregai;
            var novadata = tdata.setDate(tdata.getDate()+prazototal);
            var entrada = '';
            $scope.formData.vencimento.push({id:(i+1),cuotas:cuotas,data:novadata,entrada:entrada, valor:valor,prazo:prazototal});
        }
        if(sobra != $scope.formData.total){
            var novovalor = 0;
            novovalor = $scope.formData.total - sobra;
            $scope.formData.vencimento[0].valor = Number($scope.formData.vencimento[0].valor) + Number(novovalor);
        }

    }

    $scope.$watch("formData.total", function(newValue, oldValue) {

        if(typeof $scope.formData.produtos !=="undefined"){
            if($scope.formData.produtos.length > 0 && $scope.formData.vencimento.length >0){
                var total = 0;
                var aux = 0;
                console.log($scope.formData.total);
                for(var i = 0; i <$scope.formData.vencimento.length; i++) {
                    total = newValue / $scope.formData.vencimento.length
                    $scope.formData.vencimento[i].valor = total;
                    aux = aux + Number(total.toFixed(2));
                }
                if(aux != $scope.formData.total){ 
                    var novovalor = 0;
                    novovalor = $scope.formData.total - aux;
                    $scope.formData.vencimento[0].valor = Number($scope.formData.vencimento[0].valor) + Number(novovalor);
                }
            }

        }
    });   


    $scope.calcTotal = function(){
        var total = 0;
        angular.forEach($scope.formData.vencimento, function(venc){
            total = Number(Number(total).toFixed(2)) + venc.valor;
        })
        return total.toFixed(2);
    }



    $scope.altVencimento = function(ven){
        var index = $scope.formData.vencimento.indexOf(ven);

        $scope.formData.vencimento[index].data = ven.data;
        $scope.formData.vencimento[index].entrada = ven.entrada;
        $scope.formData.vencimento[index].prazo = ven.prazo;
        var novovalor = 0;
        var valor = 0;
        $scope.formData.vencimento[index].valor = ven.valor;
        novovalor = Number($scope.formData.total) - Number(ven.valor);
        var cuotas = Number(ven.cuotas)-1;
        valor = (novovalor / cuotas);
        for(var i = 0; i < $scope.formData.vencimento.length; i++) {
            if(i!=index){
                $scope.formData.vencimento[i].valor = valor;
            }
        }
        $scope.calcTotal();
        $scope.modal.hide();
    };   


    $scope.deleteAlt = function(str){
        var query = "DELETE FROM fatm010 where nr_pedido = ? AND seq = ?";
        $cordovaSQLite.execute(db, query, [$state.params.id,str.id]).then(function(res) {
            console.log("produtos deletado com sucesso");
            var index = $scope.formData.vencimento.indexOf(str);
            $scope.formData.vencimento.splice(index, 1);
            for(var i = 0; i <$scope.formData.vencimento.length; i++) {
                $scope.formData.vencimento[i].cuotas = $scope.formData.vencimento.length;
                $scope.formData.vencimento[i].valor = $scope.formData.total / parseInt($scope.formData.vencimento.length);
            }
        }, function (err) {
            console.error(err);
        });   
        $scope.calcTotal();
    };
    $scope.delete = function(str){
        var index = $scope.formData.vencimento.indexOf(str);
        $scope.formData.vencimento.splice(index, 1);
        for(var i = 0; i <$scope.formData.vencimento.length; i++) {
            $scope.formData.vencimento[i].cuotas = $scope.formData.vencimento.length;
            $scope.formData.vencimento[i].valor = $scope.formData.total / parseInt($scope.formData.vencimento.length);
        }
        $scope.calcTotal();
    };


    $scope.abrir = function(str){
        $scope.vencimento = str;
        $ionicModal.fromTemplateUrl('templates/editvencimento.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
            modal.show();
        });    
    };



    $scope.getTotalLucro = function(){
        var total = 0;
        for(var i = 0; i < $scope.formData.produtos.length; i++){
            var produto = $scope.formData.produtos[i];
            total += produto.lucro;
            $scope.formData.totallucro += produto.lucro;
        }
        return total;

    };

    $scope.getTotalLucroCent = function(){
        var total = 0;
        var totalvendido = 0;
        for(var i = 0; i < $scope.formData.produtos.length; i++){
            var produto = $scope.formData.produtos[i];
            total += produto.lucro;
            if(produto.lucro != 0){
                totalvendido += produto.total;
            }
        }
        var lucroporcent = ((total / totalvendido) * 100);
        $scope.formData.totallucroCent = lucroporcent
        return lucroporcent;

    };


    $scope.AlterarPedido = function(dados){ 
        $ionicLoading.show({ template: 'Alterando Dados do Pedido.<br><ion-spinner></ion-spinner>' });
        var datapedido = $filter('date')(dados.datapedido,'yyyy-MM-dd');
        var data_entrega = $filter('date')(dados.entregaf,'yyyy-MM-dd');
        var data_preco = $filter('date')(dados.dataprecio,'yyyy-MM-dd');

        var query_dados = "UPDATE fatm007 SET nr_pedido = ?, data_pedido = ?, cd_indice = ?, cgc_cpf = ?, local_fat = ?, data_entrega = ?, data_base_preco = ?, cd_safra = ?, cd_empresa = ?, cd_filial = ?, tipo = ?, e_mail = ?, entregai = ? WHERE nr_pedido = ? ";  
        $cordovaSQLite.execute(db, query_dados, [dados.npedido,datapedido,dados.moneda,dados.parcero,dados.localparcero,data_entrega,data_preco,dados.destino,sessao.getData("sess_empresa"),sessao.getData("sess_filial"),"no",dados.email,dados.entregai,$state.params.id]).then(function(res) {

            if(dados.deletaritens.length > 0){
                for(var i = 0; i < dados.deletaritens.length; i++) {   
                    var query = "DELETE FROM fatm008 where nr_pedido = ? AND cd_iten = ?";
                    $cordovaSQLite.execute(db, query, [$state.params.id,dados.deletaritens[i].produto]).then(function(res) {
                        var query = "DELETE FROM fatm010 where nr_pedido = ?";
                        $cordovaSQLite.execute(db, query, [$state.params.id]).then(function(res) {
                            console.log("produtos deletado com sucesso");
                        }, function (err) {
                            console.error(err);
                        });
                    }, function (err) {
                        console.error(err);
                    }); 

                }
            }


            var query = "DELETE FROM fatm008 where nr_pedido = ?";
            $cordovaSQLite.execute(db, query, [dados.npedido]).then(function(res) {
                var query = "DELETE FROM fatm010 where nr_pedido = ?";
                $cordovaSQLite.execute(db, query, [dados.npedido]).then(function(res) {
                    var valor_bruto = 0; 
                    var valor_desconto = 0;
                    for(var i = 0; i < dados.produtos.length; i++) {
                        var valor_bruto = parseInt(dados.produtos[i].cantidad) * dados.produtos[i].val_un;
                        var valor_desconto = dados.produtos[i].val_un - dados.produtos[i].preco_venda;
                        var query_itens = "INSERT INTO fatm008 (cd_iten, nr_pedido, cd_empresa, cd_filial, tipo, qtd, vlr_unit_bruto, vlr_bruto, vlr_unitario, seq_item, vlr_total, cd_indice, cd_safra, vlr_desconto, bloqueado, vlr_frete, custo, un, preco_venda, descricao, lucro, lucroCent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                        $cordovaSQLite.execute(db, query_itens, [dados.produtos[i].id_iten,dados.npedido,sessao.getData("sess_empresa"),sessao.getData("sess_filial"),"no",dados.produtos[i].cantidad,dados.produtos[i].val_un,dados.produtos[i].total,dados.produtos[i].val_un,dados.produtos[i].id,dados.total,dados.moneda,dados.destino,valor_desconto,"no",0,dados.produtos[i].custo,dados.produtos[i].un,dados.produtos[i].preco_venda,dados.produtos[i].text,dados.produtos[i].lucro,dados.produtos[i].lucroCent]).then(function(res) {               
                        }, function (err) {
                            console.error(err);
                        });
                    }  
                    for(var i = 0; i < dados.vencimento.length; i++) {
                        var data_vcto = $filter('date')(dados.vencimento[i].data,'yyyy-MM-dd');


                        var query_vencimento = "INSERT INTO fatm010 (cd_empresa, cd_entrada, cd_filial, data_vcto, nr_pedido, prazo_dias, seq, tipo, vlr_vcto, prazo) VALUES (?,?,?,?,?,?,?,?,?,?)";
                        $cordovaSQLite.execute(db, query_vencimento, [sessao.getData("sess_empresa"),dados.vencimento[i].entrada,sessao.getData("sess_filial"),data_vcto,dados.npedido,dados.vencimento[i].prazo,dados.vencimento[i].id,'no',dados.vencimento[i].valor, dados.vencimento[i].prazo]).then(function(res) {    
                        }, function (err) {
                            console.error(err);
                        });
                    } 
                    $state.go("pedidos.listar", {}, { reload: true });
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





    $scope.sairEditar = function(){
        $state.go("pedidos.inserir", {}, { reload: true });  
    }

    $scope.SetPedido = function(dados){

        $ionicLoading.show({ template: 'Salvando Dados do Pedido.<br><ion-spinner></ion-spinner>' });
        var datapedido = $filter('date')(dados.datapedido,'yyyy-MM-dd');
        var data_entrega = $filter('date')(dados.entregaf,'yyyy-MM-dd');
        var data_preco = $filter('date')(dados.dataprecio,'yyyy-MM-dd');

        var query_dados = "INSERT INTO fatm007 (nr_pedido, data_pedido, cd_indice, cgc_cpf, local_fat, data_entrega, data_base_preco, cd_safra, cd_empresa, cd_filial, tipo, e_mail, entregai) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"; 
        $cordovaSQLite.execute(db, query_dados, [dados.npedido,datapedido,dados.moneda,dados.parcero,dados.localparcero,data_entrega,data_preco,dados.destino,sessao.getData("sess_empresa"),sessao.getData("sess_filial"),"no",dados.email,dados.entregai]).then(function(res) {

            var valor_bruto = 0; 
            var valor_desconto = 0;
            for(var i = 0; i < dados.produtos.length; i++) {
                var valor_bruto = parseInt(dados.produtos[i].cantidad) * dados.produtos[i].val_un;
                var valor_desconto = dados.produtos[i].val_un - dados.produtos[i].preco_venda;
                var query_itens = "INSERT INTO fatm008 (cd_iten, nr_pedido, cd_empresa, cd_filial, tipo, qtd, vlr_unit_bruto, vlr_bruto, vlr_unitario, seq_item, vlr_total, cd_indice, cd_safra, vlr_desconto, bloqueado, vlr_frete, custo, un, preco_venda, descricao, lucro, lucroCent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                $cordovaSQLite.execute(db, query_itens, [dados.produtos[i].id_iten,dados.npedido,sessao.getData("sess_empresa"),sessao.getData("sess_filial"),"no",dados.produtos[i].cantidad,dados.produtos[i].val_un,dados.produtos[i].total,dados.produtos[i].val_un,dados.produtos[i].id,dados.total,dados.moneda,dados.destino,valor_desconto,"no",0,dados.produtos[i].custo,dados.produtos[i].un,dados.produtos[i].preco_venda,dados.produtos[i].text,dados.produtos[i].lucro,dados.produtos[i].lucroCent]).then(function(res) {               
                }, function (err) {
                    console.error(err);
                });
            }  
            for(var i = 0; i < dados.vencimento.length; i++) {
                var data_vcto = $filter('date')(dados.vencimento[i].data,'yyyy-MM-dd');


                var query_vencimento = "INSERT INTO fatm010 (cd_empresa, cd_entrada, cd_filial, data_vcto, nr_pedido, prazo_dias, seq, tipo, vlr_vcto, prazo) VALUES (?,?,?,?,?,?,?,?,?,?)";
                $cordovaSQLite.execute(db, query_vencimento, [sessao.getData("sess_empresa"),dados.vencimento[i].entrada,sessao.getData("sess_filial"),data_vcto,dados.npedido,dados.vencimento[i].prazo,dados.vencimento[i].id,'no',dados.vencimento[i].valor, dados.vencimento[i].prazo]).then(function(res) {    
                }, function (err) {
                    console.error(err);
                });
            }
            var query = "SELECT * FROM fatm007";
            $cordovaSQLite.execute(db, query, []).then(function(res) {
                if(res.rows.length > 0) {
                    $scope.pedidos = [];
                    for(var i = 0; i < res.rows.length; i++) {
                        $scope.pedidos.push({id: res.rows.item(i).nr_pedido, data:res.rows.item(i).data_pedido});
                    }
                    Pedido.setPedido($scope.pedidos);
                    LimpaPedidos.setLimpaPedidos(null);
                    
                    $state.go("pedidos.listar", {}, { reload: true });
                    $ionicLoading.hide();
                }
            }, function (err) {
                console.error(err);
            });



        }, function (err) {
            console.error(err);
        });


    };

});