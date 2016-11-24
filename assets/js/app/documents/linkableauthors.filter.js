(function () {
    angular.module("documents")
        .filter('linkableauthors', linkableAuthors);

    mainInstitute.$inject = [
        'config'
    ];

    function linkableAuthors(config) {

        function getLinkableAuthors(document) {
            if (!document.authorsStr) return "";
            if (!_.isFunction(document.getAuthors))
                return document.authorsStr;

            var authors = document.getAuthors();
            var possibleMatches = document.getAllCoauthors();
            var linkedAuthors = authors.map(function (author) {
                var ucAuthor = author.toUpperCase();
                var matchingUser = _.find(possibleMatches, function (c) {
                    var aliases = c.getUcAliases();
                    return _.includes(aliases, ucAuthor);

                });
                if (!matchingUser)
                    return author;
                return '<a href="#/users/' + matchingUser.id + '">' + author + '</a>';
            });
            var authorsWithMainGroup = _.map(linkedAuthors, function (author, i) {
                var authorship = _.find(document.authorships, a => a.position === i);
                if (!authorship || !authorship.affiliations.includes(config.mainInstitute.id))
                    return author;
                return author + '<a href="#/groups/' + config.mainInstitute.id + '"><sup class="superscript">' + config.mainInstitute.shortname + '</sup></a>';
            });

            return authorsWithMainGroup.join(', ');
        }

        return getLinkableAuthors;
    }

})();