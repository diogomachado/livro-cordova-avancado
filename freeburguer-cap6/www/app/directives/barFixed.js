(function() {


    angular.module('app').directive('barFixed', function ($timeout, $window) {

        var $win = angular.element($window); // wrap window object as jQuery object

        return {
            restrict: 'C',
            link: function (scope, iElement, iAttrs) {

                scope.$on('$viewContentLoaded', function(){

                    $timeout(function(){

                        var content = angular.element(document.getElementsByClassName('content'));
                        var height  = iElement[0].offsetHeight;

                        /**
                          * Com o uso de transitions, o content vira um array de duas posições porque "existem" duas views, uma saindo e outra entrando, quero a segunda que está limpa
                          *
                          * Caso dê reload na página, só existirá a posição 0
                          */
                        if (content.length > 1){
                            content[1].style.paddingTop = height + 'px';
                        }else{
                            content[0].style.paddingTop = height + 'px';
                        }
                    });
                });

            },
        };
    });

})();