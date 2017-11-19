(function() {
    'use strict';

    angular
        .module('app')
        .controller('PedidoBuscaController', PedidoBuscaController);

    PedidoBuscaController.$injector = ['$scope', '$rootScope', '$location', '$timeout'];

    function PedidoBuscaController($scope, $rootScope, $location, $timeout){

        /**
          * Executa a função de buscar no Firebase
          */
        this.buscar = function(){

            // Exibe carregamento
            $rootScope.carregar = true;

            // Manda encontrar
            encontrar($scope.codigo_pedido);
        }

        /**
          * Realiza a busca na plataforma Firebase
          */
        function encontrar(codigo){

            // Inicializa
            var db = firebase.database();

            var pedidos = db.ref('pedidos');

            // Prepara a busca filtrando
            var query = pedidos
                        .orderByChild('codigo')
                        .equalTo(codigo)
                        .limitToFirst(1);

            query.on('value', function(snapshot){

                if (snapshot.val()){

                    var pedido = snapshot.val();
                    var keys = Object.keys(pedido);

                    // Redireciona
                    $location.path('pedido-info/' + keys[0]);

                    // Retira carregamento
                    $rootScope.carregar = false;

                    $timeout(function(){
                        $scope.$digest();
                    });

                }else{

                    // Vibra rápido
                    navigator.vibrate(100);

                    // Alerta nativo
                    navigator.notification.alert(
                            'Pedido não encontrado.', // Mensagem
                            function(){

                                // Retira carregamento
                                $rootScope.carregar = false;
                                $rootScope.$apply();
                            },
                            'Ops :(', // Título
                            'Ok'      // Botão
                    );
                }
            });
        }
    }

})();