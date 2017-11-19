(function() {
    'use strict';

    angular
        .module('app')
        .controller('PedidoInfoController', PedidoInfoController);

    PedidoInfoController.$injector = ['$scope', '$rootScope', '$timeout', '$routeParams', '$location'];

    function PedidoInfoController($scope, $rootScope, $timeout, $routeParams, $location){

        // Ativa o carregamento visual
        $rootScope.carregar = true;

        // Carrega o pedido
        var query = firebase.database().ref().child('pedidos/' + $routeParams.id_pedido);

        query.on('value', function(snapshot){

            if (snapshot.val()){

                $scope.pedido = snapshot.val();

                $scope.total_pedido = 0;

                // Calcula o valor total do pedido
                angular.forEach($scope.pedido.itens, function(item, key){
                    $scope.total_pedido += item.preco;
                });

                // Carrega a empresa
                firebase.database().ref().child('empresas/' + $scope.pedido.empresa).on('value', function(snapshot_e){

                    if (snapshot_e.val()){

                        // Retira carregamento visual
                        $rootScope.carregar = false;
                        $rootScope.$apply();

                    }else{
                        console.warn("Não encontramos a empresa!!!");
                    }
                });

                $timeout(function(){
                    $scope.$digest();
                });

            }else{

                navigator.notification.alert(
                    'Não encontramos o pedido, tente novamente!', // Mensagem
                    callbackDismiss, // Função de callback
                    'Atenção',       // Título
                    'Entendi'        // Botões
                );

                $location.path('buscar-pedido');
            }
        });

        /**
          * Faz a lógica para cadastrar um contato na agenda do aparelho
          */
        this.cadastrarContato = function(){

            navigator.notification.confirm(
                'Tem certeza que deseja cadastrar o contato no aparelho?', // Mensagem
                callbackDismiss, // Função de callback
                'Atenção',       // Título
                ['Sim','Não']    // Botões
            );

            function callbackDismiss(buttonIndex){

                if (buttonIndex == 1){

                    // Nome da empresa
                    var contato = navigator.contacts.create({"displayName": $scope.empresa.nome });

                    // Array de números
                    var numeros = [];

                    // True do terceiro parametro identifica o número prioritário
                    numeros[0] = new ContactField('Celular', $scope.empresa.telefone, true);

                    contato.phoneNumbers = numeros;
                    contato.save();

                    // Exibir alerta
                    snackbar.timer("Contato salvo", 3000);
                }
            }
        }

        /**
          * Abre o mapa `nativo` do celular
          */
        this.navegar = function(lat, lng){

            var plataforma = device.platform;
            plataforma     = plataforma.toLowerCase();

            if (lat && lng){
                if (plataforma == 'ios'){
                    cordova.InAppBrowser.open('http://maps.apple.com/?ll='+lat+','+lng+'&q='+lat+','+lng, '_system');
                }else{
                    cordova.InAppBrowser.open('geo:' + lat +"," + lng + '?q='+ lat +"," + lng, '_system');
                }
            }
        }
    }

})();