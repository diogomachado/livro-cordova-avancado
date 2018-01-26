(function() {
    'use strict';

    /**
      * Definição do app AngularJS e suas rotas
      */
    angular.module('app',['ngRoute', 'ngAnimate'])
    .config(function($routeProvider, $compileProvider)
    {
        $compileProvider.debugInfoEnabled(false);

        $routeProvider
        // Página inicial
        .when('/', {
            templateUrl  : 'app/views/home.html',
            controller   : 'HomeController',
            controllerAs : 'Home'
        })
        // Rota para abrir o cardápio da empresa
        .when('/cardapio/:id_empresa', {
            templateUrl  : 'app/views/cardapio.html',
            controller   : 'CardapioController',
            controllerAs : 'Cardapio'
        })
        // Rota para fazer a buscar por um pedido
        .when('/buscar-pedido', {
            templateUrl  : 'app/views/pedido-busca.html',
            controller   : 'PedidoBuscaController',
            controllerAs : 'PedidoBusca'
        })
        // Rota para ver informações de um pedido
        .when('/pedido-info/:id_pedido', {
            templateUrl  : 'app/views/pedido-info.html',
            controller   : 'PedidoInfoController',
            controllerAs : 'PedidoInfo'
        })
        .otherwise ({ redirectTo: '/' });
    })
    /**
      * Evento `run` garante que o AngularJS está carregado
      */
    .run(function($rootScope, $location, $timeout, $window){

        /**
          * Evento que garante que o Cordova está carregado
          */
        document.addEventListener("deviceready", function () {

            /**
              * Identifica a plataforma (ios|android)
              */
            var plataforma = device.platform;
            $rootScope.device = plataforma.toLowerCase();

            /**
              * (Android): Atacando evento de voltar `backbutton`
              */
            document.addEventListener("backbutton", function(){

                if ($location.path() == '/'){

                    navigator.notification.confirm(
                        'Deseja sair do aplicativo?',
                        function(buttonIndex){
                            if (buttonIndex == 1){
                                navigator.app.exitApp();
                            }
                        },
                        'Atenção',
                        ['Sim','Não']
                    );
                }
                else{
                    $window.history.go(-1);
                }

            }, false);

            /**
              * Atacando eventos de rede
              */
            document.addEventListener("online", function(){
                $rootScope.online = true;
                $rootScope.$apply();
            }, false);

            document.addEventListener("offline", function(){
                $rootScope.online = false;
                $rootScope.alertaOnline = true;
                $rootScope.$apply();
            }, false);

        }, false);

        /**
          * Observa a variavel `online`
          */
        $rootScope.$watch('online', function(){
            if ($rootScope.online){
                $rootScope.alertaOnline = true;
                $timeout(function(){
                    $rootScope.alertaOnline = false;
                }, 3000)
            }
        });

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

        /**
          * Fecha o aplicativo
          */
        $rootScope.sair = function(){

            navigator.notification.confirm(
                    'Tem certeza que deseja sair?', // Mensagem
                    callbackDismiss, // Função de callback
                    'Atenção',       // Título
                    ['Sim','Não']    // Botões
            );

            function callbackDismiss(buttonIndex){

                if (buttonIndex == 1){

                    var exp = /(cardapio)/ig;
                    var location = window.location.hash;

                    if (location.search(exp) != -1){

                        // Variável de apoio
                        var back = {};

                        // Gravo a ID do firebase da casa de hamburgueres
                        back.casa_id = sessionStorage.getItem('freeburguer-id');

                        // Gravo os itens até então selecionados
                        back.casa_itens = sessionStorage.getItem('freeburguer-itens');

                        // Grava no localStorage
                        localStorage.setItem('freeburguer-back', JSON.stringify(back));
                    }

                    navigator.app.exitApp();
                }
            }
        }
    });
})();