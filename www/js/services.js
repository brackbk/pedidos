angular.module('pedidos')
    .service('AuthenticationService',function (Base64, $http, $cookieStore, $rootScope, $timeout, $cordovaSQLite, sessao,NPedido) {
    var service = {};

    service.Login = function (username, password, callback) {
        var response = {};

        var query = "SELECT * FROM admc05 WHERE usuario='"+username+"' AND senha='"+password+"'";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
                for(var i = 0; i < res.rows.length; i++) {                    
                    sessao.setData("sess_empresa",Number(res.rows.item(i).cd_empresa));
                    sessao.setData("sess_filial",Number(res.rows.item(i).cd_filial));
                }
                response.success = true; 
            }else{  
                response.success = false; 
                response.message = 'Usuario e senha incorreto / Necessario ter importado o banco de dados';   
            }

            callback(response);
        }, function (err) {

            response.success = false; 
            response.message = 'Necessario ter importado o banco de dados';   
            console.error(err);

            callback(response);
        });

    };

    service.SetCredentials = function (username, password) {
        var authdata = Base64.encode(username + ':' + password);

        $rootScope.globals = {
            currentUser: {
                username: username,
                authdata: authdata
            }
        };

        //$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
        $cookieStore.put('globals', $rootScope.globals);
    };

    service.ClearCredentials = function () {
        $rootScope.globals = {};
        $cookieStore.remove('globals');
        //$http.defaults.headers.common.Authorization = 'Basic ';
    };


    return service;
}).service('VerificaDados',function (Base64, $http, $cookieStore, $rootScope, $timeout, $cordovaSQLite, sessao) {
    var service = {};

    service.Itens = function (nrpedido, iten,posicao,dados, callback) {
        var response = {};
        var query = "SELECT * FROM fatm008 WHERE nr_pedido = ? AND cd_iten = ? "; 
        $cordovaSQLite.execute(db, query, [nrpedido,iten]).then(function(res) {
            if(res.rows.length > 0) {
                response.success = true; 
            }else{  
                response.success = false;  
            }


            response.posicao = posicao;
            response.dados = dados;
            callback(response);
        }, function (err) {
            response.success = false;  
            console.error(err);
            callback(response);
        });

    };


    service.Vencimentos = function (nrpedido, venc,posicao,dados, callback) {
        var response = {};

        var query = "SELECT * FROM fatm010 WHERE nr_pedido = ? AND seq = ?";
        $cordovaSQLite.execute(db, query, [nrpedido,venc]).then(function(res) {
            if(res.rows.length > 0) {
                response.success = true; 
            }else{  
                response.success = false;  
            }

            response.posicao = posicao;
            response.dados = dados;
            callback(response);
        }, function (err) {
            response.success = false;  
            console.error(err);
            callback(response);
        });

    };   
    return service;
}).service('Base64', function () {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                             "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                             "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

    /* jshint ignore:end */
}).service('Banco', function ($cordovaSQLite) {
    /* jshint ignore:start */


    return {
        fatc008: function (id) {
            var output = [];
            var query_itens = "SELECT * FROM fatm008 WHERE nr_pedido = ?";
            $cordovaSQLite.execute(db, query_itens, [id]).then(function(res_itens) {
                if(res_itens.rows.length > 0) {
                    for(var b = 0; b < res_itens.rows.length; b++) {
                        var val_un = res_itens.rows.item(b).vlr_unitario;
                        output.push({id:(b+1),id_iten: res_itens.rows.item(b).cd_iten,un:res_itens.rows.item(b).un,cantidad:res_itens.rows.item(b).qtd,val_un:val_un, text: unescape(res_itens.rows.item(b).descricao), total:res_itens.rows.item(b).vlr_bruto, custo: res_itens.rows.item(b).custo,lucro:res_itens.rows.item(b).lucro,preco_venda:res_itens.rows.item(b).preco_venda,lucroCent:res_itens.rows.item(b).lucroCent, checked: false, icon: null});
                    }
                }
            }, function (err) {
                console.error(err);
            }); 
            return output;
        },
        fatm010: function (id) {
            var output = [];
            var query_vencimentos = "SELECT * FROM fatm010 WHERE nr_pedido = ?";
            $cordovaSQLite.execute(db, query_vencimentos, [id]).then(function(res_vencimentos) {
                if(res_vencimentos.rows.length > 0) {
                    for(var c = 0; c < res_vencimentos.rows.length; c++) {
                        output.push({id:(c+1),cuotas:res_vencimentos.rows.length,data:new Date(res_vencimentos.rows.item(c).data_vcto),entrada:(res_vencimentos.rows.item(c).cd_entrada=="si"?res_vencimentos.rows.item(c).cd_entrada:"no"), valor:res_vencimentos.rows.item(c).vlr_vcto,prazo:res_vencimentos.rows.item(c).prazo});
                    }
                }  
            }, function (err) {
                console.error(err);
            });  
            return output;
        }
    };

    /* jshint ignore:end */
});