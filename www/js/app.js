// Ionic Starter App
var db;
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('pedidos', ['ionic','ngTouch','ui.router','ngAnimate','ngCordova','ngCookies','ngRoute','angular.filter','ui.utils.masks'])

    .run(function($ionicPlatform,$location,$rootScope,$cookieStore,$http,$cookieStore,$state,LimpaPedidos) {
    $ionicPlatform.ready(function() {

        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleLightContent();
        }

        $location.path('/');
        $rootScope.$apply();


    });


    $rootScope.globals = $cookieStore.get('globals') || {};


    $rootScope.$on('$locationChangeStart', function (event, next, current, toParams, fromState, fromParams, toState) {
        var restrictedPage = $.inArray($location.path(), ['/login', '/', '/config']) === -1;
        if (restrictedPage && !$rootScope.globals.currentUser) {
            $location.path('/');
        }
        if($location.path() == "/pedidos/inserir"){
            $state.go("pedidos.inserir.dados");
        }
    });


})

    .config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

    $ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
    $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS    
    $stateProvider
        .state('banco', {
        url: "/",
        templateUrl: "templates/banco.html",
        controller:'BancoCtrl'
    })
        .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller:'LoginCtrl'
    })
        .state('config', {
        url: '/config',
        templateUrl: 'templates/config.html',
        controller: 'ConfigCtrl'
    })
        .state('pedidos', {
        url: '/pedidos',
        abstract: true, 
        templateUrl: "templates/pedidos.html",
        controller: 'PedidoCtrl'

    })
        .state('pedidos.home', {
        url: '/home',
        views: {
            'pedidos-home': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            }
        }
    })
        .state('pedidos.listar', {
        url: '/listar',
        views: {
            'pedidos-listar': {
                templateUrl: 'templates/listar-pedidos.html',
                controller: 'ListarPedidosCtrl'
            },
            cache:false

        }
    })
        .state('pedidos.inserir', {
        url: '/inserir',
        views: {
            'pedidos-inserir': {
                templateUrl: 'templates/form.html',
                controller: 'InserirPedidosCtrl'
            },
            abstract: '.dados'
        },
    }).state('pedidos.inserir.dados', {
        url: '/dados/:id',
        templateUrl: 'templates/formDados.html'
    }).state('pedidos.inserir.itens', {
        url: '/itens',
        templateUrl: 'templates/formItens.html'
    }).state('pedidos.inserir.mostrar', {
        url: "/mostrar/:id_iten",
        controller: 'MostraCtrl',
        templateUrl: "templates/mostraitems.html"
    }).state('pedidos.inserir.vencimento', {
        url: '/vencimento',
        templateUrl: 'templates/formVencimento.html'
    }).state('pedidos.inserir.lucro', {
        url: '/lucro',
        templateUrl: 'templates/formLucro.html'
    });

    $urlRouterProvider.otherwise('/login');

});