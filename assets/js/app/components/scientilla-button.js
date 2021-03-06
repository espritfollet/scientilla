(function () {
    'use strict';

    angular.module('components')
            .component('scientillaButton', {
                templateUrl: 'partials/scientillaButton.html',
                controller: scientillaButtonController,
                controllerAs: 'vm',
                bindings: {
                    type: '@?',
                    size: '@?',
                    ngDisabled: '<'
                },
                transclude: true
            });

    function scientillaButtonController() {
        var vm = this;
        vm.getClasses = getClasses;
        
        activate();
        
        function activate() {
            vm.type = vm.type || 'submit';
            vm.size = vm.size || 'medium';
        }
        
        function getClasses() {
            var typeClassesTable = {
                submit: 'btn-primary',
                secondary: 'btn btn-default',
                cancel: 'btn-default btn-cancel',
                link: 'btn-link'
            };
            var sizeClassesTable = {
                small: 'btn-sm',
                medium: ''
            };
            return typeClassesTable[vm.type] + ' ' + sizeClassesTable[vm.size];
        }
    }

})();