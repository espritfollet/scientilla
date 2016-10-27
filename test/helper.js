/* global Auth, User, Group, Reference, Authorship, AuthorshipGroup, Affiliation, Institute */
'use strict';

const should = require('should');
const assert = require('assert');
const request = require('supertest-as-promised');

const users = require('./data/users');
const groups = require('./data/groups');
const documents = require('./data/documents');
const institutes = require('./data/institutes');

module.exports = (function () {
    var obj = {
        cleanDb: function () {
            var models = [Auth, User, Group, Reference, Authorship, AuthorshipGroup, Affiliation, Institute];
            var destroyFns =
                models.map(function (model) {
                    return model.destroy();
                });
            return Promise.all(destroyFns);
        },
        createModel: function (Model, data) {
            return _.defaults(data, Model.attributes);
        },
        getUrl: function () {
            //sTODO: get real host.
            return 'http://localhost:1338';
        },
        getAllUserData: function () {
            return users;
        },
        getAllGroupData: function () {
            return groups;
        },
        getAllInstituteData: function () {
            return institutes;
        },
        getAllDocumentData: function () {
            return documents;
        },
        getUsers: function () {
            return request(url)
                .get('/users');
        },
        createGroup: function (groupData) {
            return request(url)
                .post('/groups')
                .send(groupData);
        },
        createInstitute: function (instituteData) {
            return request(url)
                .post('/institutes')
                .send(instituteData);
        },
        registerUser: function (userData) {
            return request(url)
                .post('/auths/register')
                .send(userData);
        },
        getUserDocuments: function (user, populateFields, qs) {
            return request(url)
                .get('/users/' + user.id + '/documents')
                .query({populate: populateFields})
                .query(qs);
        },
        getUserDocumentsWithAuthors: function (user) {
            return this.getUserDocuments(user, ['authors', 'authorships', 'affiliations'], {});
        },
        getUserSuggestedDocuments: function (user) {
            return request(url)
                .get('/users/' + user.id + '/suggestedDocuments');
        },
        getUserDrafts: function (user, populateFields, qs) {
            return request(url)
                .get('/users/' + user.id + '/drafts')
                .query({populate: populateFields})
                .query(qs);
        },
        userCreateDraft: function (user, draftData) {
            return request(url)
                .post('/users/' + user.id + '/drafts')
                .send(draftData);
        },
        userCreateDrafts: function (user, draftsData) {
            return request(url)
                .post('/users/' + user.id + '/copy-drafts')
                .send({documents: draftsData});
        },
        userUpdateDraft: function (user, draftData) {
            return request(url)
                .put('/users/' + user.id + '/drafts/' + draftData.id)
                .send(draftData);
        },
        userVerifyDraft: function (user, draftData, position, affiliations) {
            return request(url)
                .put('/users/' + user.id + '/drafts/' + draftData.id + '/verified')
                .send({position: position, 'affiliations': affiliations});
        },
        userUnverifyDocument: function (user, document) {
            return request(url)
                .put('/users/' + user.id + '/documents/' + document.id + '/unverified');
        },
        addAffiliation: function (user, authorship) {

        },
        userVerifyDocument: function (user, document, position, affiliations) {
            return request(url)
                .post('/users/' + user.id + '/documents')
                .send({id: document.id, position: position, 'affiliations': affiliations});
        },
        getGroupDrafts: function (group, populateFields, qs) {
            return request(url)
                .get('/groups/' + group.id + '/drafts')
                .query({populate: populateFields})
                .query(qs);
        },
        groupCreateDraft: function (group, draftData) {
            return request(url)
                .post('/groups/' + group.id + '/drafts')
                .send(draftData);
        },
        groupCreateDrafts: function (group, draftsData) {
            return request(url)
                .post('/groups/' + group.id + '/copy-drafts')
                .send({documents: draftsData});
        },

        getDocument: function (documentId) {
            return request(url)
                .get('/references/' + documentId);
        }
    };
    var url = obj.getUrl();
    return obj;
})();
