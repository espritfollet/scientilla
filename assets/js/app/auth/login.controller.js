(function () {
    angular
            .module('auth')
            .controller('LoginController', LoginController);

    LoginController.$inject = [
        'AuthService',
        'FormForConfiguration',
        'Notification',
        '$scope',
        '$location'
    ];

    function LoginController(AuthService, FormForConfiguration, Notification, $scope, $location) {
        var vm = this;
        vm.formData = {
            username: "",
            email: "",
            password: ""
        };


        vm.validationAndViewRules = {
            username: {
                inputType: 'text',
                required: true
            },
            password: {
                inputType: 'password',
                required: true
            }
        };

        vm.submit = submit;

        activate();

        function activate() {
            FormForConfiguration.enableAutoLabels();

            $scope.$watch('vm.formData.email', emailChanged);

        }

        function submit() {
            AuthService.login(vm.formData)
                    .catch(function () {
                        Notification.warning('Login failed');
                        vm.formData.password = "";
                    });
        }

        function emailChanged() {
            vm.formData.username = vm.formData.email;
        }

    }
})();
