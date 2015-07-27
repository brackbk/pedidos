angular.module('pedidos')
    .factory('CarregaBanco', function($ionicLoading, $location, $cordovaSQLite, $state, $http, sessao, $filter,$timeout) {
    return {


        importar: function(empresa,filial,callback){
            
            var response = {};
            
            $ionicLoading.show({ template: 'Importando Banco de Dados do Servidor.<br><ion-spinner></ion-spinner>' });
            $http({
                method: 'POST',
                url:'http://'+sessao.getData("sess_caminho")+':'+sessao.getData("sess_porta")
                +sessao.getData("sess_diretorio")+'pedidos.p',
                data:'tipo=importar&idempresa='+empresa+'&filial='+filial,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data, status, headers, config) {
                db.transaction(function (tx) {
                    if(data.pedidos.moneda){
                        tx.executeSql("DROP TABLE IF EXISTS finc002"); 
                        tx.executeSql("CREATE TABLE IF NOT EXISTS finc002 (id INTEGER PRIMARY KEY AUTOINCREMENT, cd_empresa INTEGER, cd_indice INTEGER, descricao TEXT)"); 

                        angular.forEach(data.pedidos.moneda,function(val,key){
                            tx.executeSql("INSERT INTO finc002 (cd_empresa, cd_indice, descricao) VALUES ("+val['cd-empresa']+", "+val['cd-indice']+", '"+val['descricao']+"')");

                        });
                        console.log("Moneda Importada");
                        console.log("Rows - "+data.pedidos.moneda.length);
                    }
                    if(data.pedidos.usuario){
                        tx.executeSql("DROP TABLE IF EXISTS admc05"); 
                        tx.executeSql("CREATE TABLE IF NOT EXISTS admc05 (id INTEGER PRIMARY KEY AUTOINCREMENT, cd_empresa INTEGER, cd_filial INTEGER, cgc_cpf TEXT, usuario TEXT, perc_desconto REAL, senha TEXT)");       

                        angular.forEach(data.pedidos.usuario,function(val,key){
                            tx.executeSql("INSERT INTO admc05 (cd_empresa, cd_filial, cgc_cpf,usuario, perc_desconto, senha) VALUES ("+val['cd-empresa']+", "+val['cd-filial']+", '"+val['cgc-cpf']+"', '"+val['usuario']+"', "+val['perc-desconto']+", '"+val['senha']+"')");          
                        });
                        console.log("Usuario Importado");
                        console.log("Rows - "+data.pedidos.usuario.length);
                    }

                    if(data.pedidos.temp_fatc001){
                        tx.executeSql("DROP TABLE IF EXISTS fatc001"); 
                        tx.executeSql("CREATE TABLE IF NOT EXISTS fatc001 (id INTEGER PRIMARY KEY AUTOINCREMENT, cd_iten INTEGER, cd_indice INTEGER, tp_parceiro INTEGER, data_validade TEXT , data_mvto TEXT, preco_custo REAL, preco_venda_maior REAL, preco_venda_menor REAL, preco_venda_minimo REAL, cd_empresa INTEGER)");
                        angular.forEach(data.pedidos.temp_fatc001,function(val,key){

                            var pattern = /(\d{2})(\d{2})(\d{4})/;
                            var data_mvt = new Date(val['data_mvto'].replace(pattern, '$3-$2-$1'));
                            var data_mvt = $filter('date')(data_mvt,'yyyy-MM-dd');


                            tx.executeSql("INSERT INTO fatc001 (cd_iten, cd_indice, tp_parceiro, data_validade, data_mvto, preco_custo, preco_venda_maior, preco_venda_menor, preco_venda_minimo, cd_empresa) VALUES ("+val['cd_iten']+", "+val['cd_indice']+", "+val['tp_parceiro']+", '"+val['data_validade']+"', '"+data_mvt+"', '"+val['preco_custo']+"', '"+val['preco_venda_maior']+"', '"+val['preco_venda_menor']+"', '"+val['preco_venda_minimo']+"', "+val['cd_empresa']+")");          
                        });
                        console.log("fatc001 Importado");
                        console.log("Rows - "+data.pedidos.temp_fatc001.length);
                    }                    

                    if(data.pedidos.temp_estc007){
                        tx.executeSql("DROP TABLE IF EXISTS estc007"); 
                        tx.executeSql("CREATE TABLE IF NOT EXISTS  estc007 (id INTEGER PRIMARY KEY AUTOINCREMENT, cd_iten INTEGER, cd_unidade TEXT, descricao TEXT, cod_fabricante TEXT, cd_empresa INTEGER)");
                        angular.forEach(data.pedidos.temp_estc007,function(val,key){
                            tx.executeSql("INSERT INTO estc007 (cd_iten, cd_unidade, descricao, cod_fabricante, cd_empresa) VALUES ("+val['cd_iten']+", '"+val['cd_unidade']+"', '"+val['descricao']+"', '"+val['cod_fabricante']+"', "+val['cd_empresa']+")");          
                        });
                        console.log("estc007 Importado");
                        console.log("Rows - "+data.pedidos.temp_estc007.length);
                    }                    

                    if(data.pedidos.temp_cadc002){
                        tx.executeSql("DROP TABLE IF EXISTS cadc002"); 
                        tx.executeSql("CREATE TABLE IF NOT EXISTS cadc002 (id INTEGER PRIMARY KEY AUTOINCREMENT, cd_uf INTEGER)");
                        angular.forEach(data.pedidos.temp_cadc002,function(val,key){
                            tx.executeSql("INSERT INTO cadc002 (cd_uf) VALUES ("+val['cd_uf']+")");          
                        });
                        console.log("cadc002 Importado");
                        console.log("Rows - "+data.pedidos.temp_cadc002.length);
                    }                    

                    if(data.pedidos.temp_cadc001a){
                        tx.executeSql("DROP TABLE IF EXISTS cadc001a"); 
                        tx.executeSql("CREATE TABLE IF NOT EXISTS cadc001a (id INTEGER PRIMARY KEY AUTOINCREMENT, cgc_cpf TEXT, local_fat INTEGER, endereco TEXT, cd_municipio INTEGER, cd_uf REAL, cd_empresa INTEGER, ativo TEXT)");
                        angular.forEach(data.pedidos.temp_cadc001a,function(val,key){

                            tx.executeSql("INSERT INTO cadc001a (cgc_cpf, local_fat, endereco, cd_municipio, cd_uf, cd_empresa, ativo) VALUES ('"+val['cgc_cpf']+"', "+val['local_fat']+", '"+escape(val['endereco'])+"', "+val['cd_municipio']+", '"+val['cd_uf']+"', "+val['cd_empresa']+", '"+val['ativo']+"')");          
                        });     
                        console.log("cadc001a Importado");
                        console.log("Rows - "+data.pedidos.temp_cadc001a.length);

                    }  

                    if(data.pedidos.temp_cadc001){
                        tx.executeSql("DROP TABLE IF EXISTS cadc001"); 
                        tx.executeSql("CREATE TABLE IF NOT EXISTS cadc001 (id INTEGER PRIMARY KEY AUTOINCREMENT, cgc_cpf TEXT, nome TEXT, cd_empresa INTEGER, ruc TEXT, email TEXT)");
                        angular.forEach(data.pedidos.temp_cadc001,function(val,key){

                            tx.executeSql("INSERT INTO cadc001 (cgc_cpf, nome, cd_empresa, ruc, email) VALUES ('"+val['cgc_cpf']+"', '"+escape(val['nome'])+"', "+val['cd_empresa']+", '"+val['ruc']+"', '"+val['email']+"')");          
                        });     
                        console.log("cadc001 Importado");
                        console.log("Rows - "+data.pedidos.temp_cadc001.length);

                    }   

                    if(data.pedidos.temp_cadc003){
                        tx.executeSql("DROP TABLE IF EXISTS cadc003"); 
                        tx.executeSql("CREATE TABLE IF NOT EXISTS cadc003 (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT, cd_municipio INTEGER)");
                        angular.forEach(data.pedidos.temp_cadc003,function(val,key){
                            tx.executeSql("INSERT INTO cadc003 (descricao, cd_municipio) VALUES ('"+escape(val['descricao'])+"', "+val['cd_municipio']+")");          
                        });
                        console.log("cadc003 Importado");
                        console.log("Rows - "+data.pedidos.temp_cadc003.length);
                    }

                    if(data.pedidos.temp_agrc016){
                        tx.executeSql("DROP TABLE IF EXISTS agrc016"); 
                        tx.executeSql("CREATE TABLE IF NOT EXISTS agrc016 (id INTEGER PRIMARY KEY AUTOINCREMENT, cd_empresa INTEGER, data_vcto DATE, cd_safra INTEGER, descricao TEXT)");

                        angular.forEach(data.pedidos.temp_agrc016,function(val,key){
                            var novadata = val['data_vcto'];
                            var pattern = /(\d{2})(\d{2})(\d{4})/;
                            var datanova = new Date(novadata.replace(pattern, '$3-$2-$1'));
                            var datanova = $filter('date')(datanova,'yyyy-MM-dd');
                            tx.executeSql("INSERT INTO agrc016 (cd_empresa, data_vcto, cd_safra, descricao) VALUES ("+val['cd_empresa']+", '"+datanova+"', "+val['cd_safra']+", '"+val['descricao']+"')");          
                        });
                        console.log("agrc016 Importado");
                        console.log("Rows - "+data.pedidos.temp_agrc016.length);
                    }


                });


                response.sucesso = "Dados Importados";
                
                
                callback(response);

          
                $ionicLoading.hide(); 
            }).error(function(data, status, headers, config) {
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
                alert("Internet offline / nao foi possivel importar os dados");
            });
        },
        bancoMobile: function() {

            $ionicLoading.show({ template: 'Carregando Banco...' });
            window.plugins.sqlDB.copy("pedidodb.db",function(suss) {
                db = $cordovaSQLite.openDB("pedidodb.db");
                $location.path("/login");
                $ionicLoading.hide();

            }, function(error) {
                db = $cordovaSQLite.openDB("pedidodb.db");
                $location.path("/login");
                $ionicLoading.hide();

            });    
        },
        bancoWeb: function() {

            $ionicLoading.show({ template: 'Carregando Banco...' });
            db = openDatabase("pedidodb.db", '1.0', "My WebSQL Database", 2 * 1024 * 1024);
            db.transaction(function (tx) {

                tx.executeSql("CREATE TABLE IF NOT EXISTS finc002 (id INTEGER PRIMARY KEY AUTOINCREMENT, cd_empresa INTEGER, cd_indice INTEGER, descricao TEXT)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS  fatc001 (id INTEGER PRIMARY KEY AUTOINCREMENT, cd_iten INTEGER, cd_indice INTEGER, tp_parceiro INTEGER, data_validade TEXT, data_mvto DATE, preco_custo REAL, preco_venda_maior REAL, preco_venda_menor REAL, preco_venda_minimo REAL, cd_empresa INTEGER)");


                tx.executeSql("CREATE TABLE IF NOT EXISTS  estc007 (id INTEGER PRIMARY KEY AUTOINCREMENT, cd_iten INTEGER, cd_unidade TEXT, descricao TEXT, cod_fabricante TEXT, cd_empresa INTEGER)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS cadc003 (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT, cd_municipio INTEGER)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS cadc002 (id INTEGER PRIMARY KEY AUTOINCREMENT, cd_uf INTEGER)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS cadc001a (id INTEGER PRIMARY KEY AUTOINCREMENT, cgc_cpf TEXT, local_fat INTEGER, endereco TEXT, cd_municipio INTEGER, cd_uf REAL, cd_empresa INTEGER, ativo TEXT)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS cadc001 (id INTEGER PRIMARY KEY AUTOINCREMENT, cgc_cpf TEXT, nome TEXT, cd_empresa INTEGER, ruc TEXT, email TEXT)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS agrc016 (id INTEGER PRIMARY KEY AUTOINCREMENT, cd_empresa INTEGER, data_vcto DATE, cd_safra INTEGER, descricao TEXT)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS admc05 (id INTEGER PRIMARY KEY AUTOINCREMENT, cd_empresa INTEGER, cd_filial INTEGER, cgc_cpf TEXT, usuario TEXT, perc_desconto REAL, senha TEXT, situacao TEXT)");  

                tx.executeSql("DROP TABLE IF EXISTS configuracao");
                tx.executeSql("CREATE TABLE IF NOT EXISTS configuracao (id INTEGER PRIMARY KEY AUTOINCREMENT, porta INTEGER, caminho TEXT, diretorio TEXT, npedido INTEGER)");
                tx.executeSql("INSERT INTO configuracao (porta, caminho, diretorio, npedido) VALUES (9095, '201.217.56.29', '/cgi-bin/sisweb.pl/',1)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS fatm010 (id INTEGER PRIMARY KEY AUTOINCREMENT, cd_empresa INTEGER, cd_entrada INTEGER, cd_filial INTEGER, data_vcto TEXT, nr_pedido INTEGER, prazo_dias INTEGER, seq INTEGER, tipo TEXT, vlr_vcto REAL, prazo INTEGER)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS fatm008 (id INTEGER PRIMARY KEY AUTOINCREMENT, cd_iten INTEGER, nr_pedido INTEGER, cd_empresa INTEGER, cd_filial INTEGER, tipo TEXT, qtd INTEGER, vlr_unit_bruto INTEGER, vlr_bruto REAL, vlr_unitario REAL, seq_item	INTEGER, vlr_total REAL, cd_indice INTEGER, cd_safra INTEGER, vlr_desconto REAL, bloqueado TEXT, vlr_frete REAL, custo REAL, un TEXT, preco_venda REAL, descricao TEXT,lucro REAL,lucroCent REAL)");
                tx.executeSql("CREATE TABLE IF NOT EXISTS fatm007 (nr_pedido INTEGER PRIMARY KEY AUTOINCREMENT, data_pedido DATE, cd_indice INTEGER, cgc_cpf TEXT, local_fat INTEGER, data_entrega TEXT, data_base_preco TEXT, cd_safra INTEGER, cd_empresa INTEGER, cd_filial INTEGER, tipo TEXT, e_mail TEXT, entregai INTEGER)");



            });
            $location.path("/login");
            $ionicLoading.hide();
        }  
    }
}).factory("sessao", function($window, $rootScope) {

    return {
        setData: function(name, val) {
            $window.localStorage && $window.localStorage.setItem(name, val);
            return this;
        },
        getData: function(name) {
            return $window.localStorage && $window.localStorage.getItem(name);
        }
    };
}).factory("NPedido", function ($cordovaSQLite, sessao) {
    var pedido = null;

    function getNpedido() {
        var query = "SELECT * FROM fatm007 ORDER BY nr_pedido ASC LIMIT 0, 1";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
                pedido = Number(sessao.getData("sess_npedido")) + Number(res.rows.item(0).nr_pedido);
            }else{
                pedido = Number(sessao.getData("sess_npedido"));
            }
        }, function (err) {
            console.error(err);
        });

        return pedido;
    }
    function setNpedido(npedido) {
        pedido = npedido;
    }
    return {
        getNpedido: getNpedido,
        setNpedido: setNpedido,
    }
}).factory("Pedido", function ($cordovaSQLite, sessao) {
    var pedidos = [];

    var query = "SELECT * FROM fatm007";
    $cordovaSQLite.execute(db, query, []).then(function(res) {
        if(res.rows.length > 0) {
            for(var i = 0; i < res.rows.length; i++) {
                pedidos.push({id: res.rows.item(i).nr_pedido, data:res.rows.item(i).data_pedido});
            }
        }
    }, function (err) {
        console.error(err);

    });


    function getPedido() {
        return pedidos;
    }
    function setPedido(pedido) {
        pedidos = pedido;
    }
    return {
        getPedido: getPedido,
        setPedido: setPedido,
    }
}).factory("LimpaPedidos", function ($cordovaSQLite, sessao,NPedido) {
    var formData = null;
    
    function getLimpaPedidos() {
        return formData;
        console.log(formData);
    }
    function setLimpaPedidos(pedido) {
         formData = pedido;
        
    }
    return {
        getLimpaPedidos: getLimpaPedidos,
        setLimpaPedidos: setLimpaPedidos,
    }
});
