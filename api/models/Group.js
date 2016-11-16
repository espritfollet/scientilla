/* global Document, SqlService, Promise, Group */
'use strict';

/**
 * Group.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var _ = require('lodash');
var researchEntity = require('./ResearchEntity');

module.exports = _.merge({}, researchEntity, {
    attributes: {
        name: 'STRING',
        slug: 'STRING',
        shortname: 'TEXT',
        description: 'TEXT',
        publicationsAcronym: 'TEXT',
        memberships: {
            collection: 'membership',
            via: 'group'
        },
        collaborations: {
            collection: 'collaboration',
            via: 'group'
        },
        administrators: {
            collection: 'user',
            via: 'admininstratedGroups'
        },
        drafts: {
            collection: 'Document',
            via: 'draftGroupCreator'
        },
        documents: {
            collection: 'document',
            via: 'groups',
            through: 'authorshipgroup'
        },
        authorships: {
            collection: 'authorshipGroup',
            via: 'researchEntity',
        },
        discardedDocuments: {
            collection: 'Document',
            via: 'discardedGroups'
        },
        suggestedDocuments: {
            collection: 'document',
            via: 'groups',
            through: 'documentsuggestiongroup'
        },
        getType: function () {
            return 'group';
        },
        scopusId: {
            type: 'STRING'
        },
        institute: {
            model: 'institute'
        }
    },
    getAuthorshipsData: function (document) {
        return Promise.resolve({
            isVerifiable: true,
            document: document
        });
    },
    doVerifyDocument: function (document, researchEntityId) {
        const authorship = {
            researchEntity: researchEntityId,
            document: document.id
        };
        return AuthorshipGroup.create(authorship)
            .then(()=>document);
    }
});
