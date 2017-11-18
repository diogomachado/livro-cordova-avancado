(function() {
    'use strict';

    /**
      * Definição do app AngularJS e suas rotas
      */
    angular.module('app',['ngRoute', 'ngAnimate'])
    .config(function($routeProvider, $compileProvider)
    {
        $routeProvider
        // Página inicial
        .when('/', {
            templateUrl  : 'app/views/home.html'
        })
        // Rota para abrir o cardápio da empresa
        .when('/cardapio', {
            templateUrl  : 'app/views/cardapio.html'
        })
        // Rota para fazer a buscar por um pedido
        .when('/buscar-pedido', {
            templateUrl  : 'app/views/pedido-busca.html'
        })
        // Rota para ver informações de um pedido
        .when('/pedido-info', {
            templateUrl  : 'app/views/pedido-info.html'
        })
        .otherwise ({ redirectTo: '/' });
    })
    /**
      * Evento `run` garante que o AngularJS está carregado
      */
    .run(function($rootScope, $location, $timeout, $window){

        // TODO: apenas para teste no navegador
        $rootScope.device = 'ios';

        /**
          * Evento que garante que o Cordova está carregado
          */
        document.addEventListener("deviceready", function () {

            /**
              * Identifica a plataforma (ios|android)
              */
            var plataforma = device.platform;
            $rootScope.device = plataforma.toLowerCase();

        }, false);


        /**
          * Rastreia a mudança de rota e coleta o path do navegador
          */
        $rootScope.$on("$locationChangeStart", function (event, next, current) {

            // Salva o caminho da URL
            $rootScope.path = $location.path();
        });

        /**
          * Faz um redirecionamento
          */
        $rootScope.ir = function(url){
            $location.path(url);
        }
    });
})();