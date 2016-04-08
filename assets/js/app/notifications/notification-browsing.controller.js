/* global Scientilla */

(function () {
    angular
            .module('notifications')
            .controller('NotificationBrowsingController', NotificationBrowsingController);

    NotificationBrowsingController.$inject = [
        'AuthService',
        'ModalService',
        'Restangular',
        'researchEntityService'
    ];

    function NotificationBrowsingController(AuthService, ModalService, Restangular, researchEntityService) {

        var vm = this;
        vm.copyReference = copyReference;
        vm.verifyReference = verifyReference;

        vm.targets = _.map(_.union([AuthService.user], AuthService.user.admininstratedGroups),
                function (reserarchEntity) {
                    return {
                        researchEntity: reserarchEntity,
                        documents: [],
                        query: {}
                    };
                });

        vm.listRefreshGenerator = listRefreshGenerator;
        vm.getDataGenerator = getDataGenerator;


        function getDataGenerator(target) {
            return function (query) {
                target.query = query;
                return getData(target);
            };
        }

        function listRefreshGenerator(target) {
            return function (documents) {
                target.documents = documents;
                listRefresh(target);
            };
        }


        function copyReference(document, target) {

            var restType = target.researchEntity.getType() + 's';

            var restResearchEntity = Restangular
                    .one(restType, target.researchEntity.id);

            ModalService
                    .openScientillaDocumentForm(
                            Scientilla.reference.copyDocument(document, target.researchEntity),
                            restResearchEntity)
                    .then(function () {
                        reload(target);
                    });

        }

        function verifyReference(document, target) {
            //sTODO move to a service
            researchEntityService.verifyDocument(target.researchEntity, document.id)
                    .then(function () {
                        reload(target);
                    });
        }


        // private
        function reload(target) {
            getData(target).
                    then(function (documents) {
                        target.documents = documents;
                        listRefresh(target);
                    });
        }

        function getData(target) {
            return researchEntityService.getSuggestedDocuments(target.researchEntity, target.query);
        }

        function listRefresh(target) {
            _.forEach(target.documents, function (d) {
                if (d)
                    _.defaults(d, Scientilla.reference);
                _.forEach(d.privateCoauthors, function (c) {
                    _.defaults(c, Scientilla.user);
                });
                _.forEach(d.publicCoauthors, function (c) {
                    _.defaults(c, Scientilla.user);
                });
            });
        }
    }
})();
