(function() {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$injector = ['$scope', '$rootScope', '$location', '$timeout'];

    function HomeController($scope, $rootScope, $location, $timeout){

        /**
          * Se sabemos que ele saiu no meio de um pedido
          */
        var voltar = localStorage.getItem('freeburguer-back');

        if (voltar){

            // Faz o parse do JSON
            voltar = JSON.parse(voltar);

            $timeout(function(){

                navigator.notification.confirm(
                        'Você estava escolhendo seu pedido da última vez que saiu, deseja voltar a seleção?', // Mensagem
                        callbackDismiss,         // Função de callback
                        'Deseja continuar...',   // Título
                        ['Sim','Não']            // Botões
                );

                function callbackDismiss(buttonIndex){

                    if (buttonIndex == 1){

                        encontrar(voltar.casa_id);

                        // Remove
                        localStorage.removeItem('freeburguer-back');
                    }
                }

            }, 600);
        }

        /**
          * Faz a leitura do QRcode
          */
        this.scanear = function(){

            $rootScope.carregar = true;

            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    encontrar(result.text);
                },
                function (error) {
                    console.error("Erro ao scanear qrcode: " + error);
                }
            );
        }

        /**
          * Faz a busca ao tocar no button buscar
          */
        this.buscar = function(){

            $rootScope.carregar = true;

            encontrar($scope.codigo_empresa);
        }

        /**
          * Realiza a busca na plataforma Firebase
          */
        function encontrar(codigo){

            // Inicializa
            var db = firebase.database();
            var empresas = db.ref('empresas');

            // Prepara a busca filtrando
            var query = empresas
                        .orderByChild('codigo')
                        .equalTo(codigo)
                        .limitToFirst(1);

            query.on('value', function(snapshot){

                if (snapshot.val()){

                    var empresa = snapshot.val();

                    // Como uso pesquisa, ele vai retorna um objeto com 1 posição, preciso coleta essa key
                    var keys = Object.keys(empresa);

                    // Redireciona usando a key
                    $location.path('cardapio/' + keys[0]);

                    // Guarda a ID da empresa em sessão
                    sessionStorage.setItem('freeburguer-id', codigo);


                }else{

                    // Vibra rápido
                    navigator.vibrate(100);

                    // Alerta nativo
                    navigator.notification.alert(
                            'Nenhuma empresa com esse ID.', // Mensagem
                            function(){}, // Função de callback
                            'Ops :(',        // Título
                            'Beleza'         // buttonName
                    );
                }

                // Desliga carregamento
                $rootScope.carregar = false;

                $timeout(function(){
                    $scope.$digest();
                });
            });
        }
    }

})();