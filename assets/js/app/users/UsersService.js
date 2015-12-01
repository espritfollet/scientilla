(function () {
    angular.module("users").factory("UsersService",
            ["Restangular", function (Restangular) {
                    var service = Restangular.service("users");

                    service.getNewUser = function () {
                        var user = {
                            name: "",
                            surname: "",
                            slug: "",
                            username: "",
                            role: Scientilla.user.USER
                        }; 
                        _.assign(user, Scientilla.user);
                        return user;
                    };
                    
                    service.put = function(user) {
                        //TODO: check this Restangular bug
                        return Restangular.copy(user).put();
                    };

                    service.validateData = function (user) {
                        //validate user data
                    };
                    
                    service.save = function(user) {
                        return user.save().then(function(u){
                            return user;
                        });
                    }
                    
                    return service;
                }]);
}());