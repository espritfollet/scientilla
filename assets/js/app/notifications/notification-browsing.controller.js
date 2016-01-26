(function () {
    angular
            .module('notifications')
            .controller('NotificationBrowsingController', NotificationBrowsingController);

    NotificationBrowsingController.$inject = [
        'AuthService',
        'Restangular',
        'user'
    ];

    function NotificationBrowsingController(AuthService, Restangular, user) {
        var vm = this;
        vm.copyReference = copyReference;
        vm.verifyReference = verifyReference;
        vm.notificationTargets = _.union([AuthService.user], AuthService.user.admininstratedGroups);

        activate();

        function activate() {
            return getNotifications().then(function () {

            });
        }

        function getNotifications() {
            //sTODO move to a service
            return user.getList('notifications')
                    .then(function (notifications) {
                        vm.notifications = notifications;
                        _.forEach(vm.notifications, function (n) {
                            if (n.content.reference)
                                _.defaults(n.content.reference, Scientilla.reference);
                            _.forEach(n.content.reference.privateCoauthors, function (c) {
                                _.defaults(c, Scientilla.user);
                            });
                            _.forEach(n.content.reference.publicCoauthors, function (c) {
                                _.defaults(c, Scientilla.user);
                            });
                        });
                    });
        }

        function copyReference(notification, target) {
            //sTODO-urgent owner must be changed server-side
            //sTODO move to a service
            var reference = notification.content.reference;
            var newReference = Scientilla.reference.create(reference, target);
            target.post('drafts', newReference)
                    .then(function () {
                        _.remove(vm.notifications, notification);
                    });
        }

        function verifyReference(notification, target) {
            var reference = notification.content.reference;
            //sTODO move to a service
            target.post('privateReferences', {id: reference.id})
                    .then(function () {
                        _.remove(vm.notifications, notification);
                    });
        }
    }
})();
