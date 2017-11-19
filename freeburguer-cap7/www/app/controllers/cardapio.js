(function() {
    'use strict';

    angular
        .module('app')
        .controller('CardapioController', CardapioController);

    CardapioController.$injector = ['$scope', '$timeout', '$location', '$routeParams', 'firebaseTool'];

    function CardapioController($scope, $timeout, $location, $routeParams, firebaseTool){

        // Nos ajuda a controlar a view
        $scope.exibirResumoPedido = false;

        /**
          * Carrega os produtos armazenados no Firebase
          */
        var db = firebase.database();
        var empresa = db.ref('empresas/' + $routeParams.id_empresa);

        empresa.on('value', function(snapshot){

            // Se encontrou
            if (snapshot.val()){

                // Coleta os valores
                var empresa = snapshot.val();

                if (empresa.produtos){
                    $scope.nome = empresa.nome;
                    $scope.itens = empresa.produtos;
                }else{
                    snackbar.timer("Nenhum lanche disponível", 3000);
                }

            }else{
                console.warn("Nenhuma empresa com esse ID.");
            }
        });

        /**
          * Observa se usuário vai selecionar algum item, para exibir o rodapé
          */
        $scope.$watch('itens', function(){

            var selecionados = 0;
            var itens = [];

            $scope.valorTotalPedido = 0;

            angular.forEach($scope.itens, function(item, key){
                if (item.selecionado){

                    itens.push(key);

                    selecionados++;

                    $scope.valorTotalPedido += item.preco;
                }
            });

            // Grava os itens até então selecionados
            if (itens.length > 0){
                sessionStorage.setItem('freeburguer-itens', JSON.stringify(itens));
            }else{
                sessionStorage.removeItem('freeburguer-itens');
            }

            $scope.exibirResumoPedido = (selecionados > 0) ? true : false;

        }, true);

        /**
          * Faz o fechamento do pedido e cria um registro no Firebase
          */
        this.fecharPedido = function(){

            navigator.notification.confirm(
                'Ao avançar você irá confirmar o seu pedido, iremos preparar o seu lanche e enviar ao motoboy, tem certeza disso?',  // Mensagem
                callbackFecharPedido, // Função de callback
                'Atenção',            // Título
                ['Sim','Não']         // buttonName
            );

            function callbackFecharPedido(buttonIndex){

                if (buttonIndex == 1){

                    // Dados do pedido
                    var pedido = {};

                    pedido.codigo  = gerarID();
                    pedido.empresa = $routeParams.id_empresa;
                    pedido.itens   = $scope.itens;

                    // Cria um novo pedido
                    firebaseTool.create('/pedidos/', pedido)
                    .then(function(pedido_id){

                        // Redireciona
                        $location.path('pedido-info/' + pedido_id);
                    },
                    function(){
                        console.error("Erro ao criar pedido");
                    });
                }
            }
        }

        /**
          * Função de apoio para gerar ID
          */
        function gerarID(){
            return 'P' + Math.random().toString(5).substr(2, 5);
        }
    }

})();