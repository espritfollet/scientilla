/* global User */

'use strict';

const test = require('./../helper.js');

describe('Draft Creation: ', () => {
    before(test.cleanDb);
    after(test.cleanDb);

    const usersData = test.getAllUserData();
    const documentsData = test.getAllDocumentData();
    const groupsData = test.getAllGroupData();

    const draftsData = [documentsData[0], documentsData[1]];

    let user;
    let group;

    it('there should be no drafts for a new user', () =>
        test.registerUser(usersData[0])
            .then(res => user = res.body)
            .then(() => test.getUserDrafts(user)
                .expect(200, [])
            )
    );

    it('creating user draft should be possible', () =>
        test.userCreateDraft(user, draftsData[0])
            .expect(200)
            .then(() => {
                return test.getUserDrafts(user)
                    .expect(res => {
                        res.status.should.equal(200);
                        res.body.should.have.length(1);
                        checkDraft(user, draftsData[0], res.body[0]);
                    });
            })
    );

    it('there should be no drafts for a new group', () =>
        test.createGroup(groupsData[0])
            .then(res => group = res.body)
            .then(() => test.getGroupDrafts(group)
                .expect(200, [])
            )
    );

    it('creating group draft should be possible', () =>
        test
            .groupCreateDraft(group, draftsData[1])
            .expect(200)
            .then(() => test.getGroupDrafts(group)
                .expect(res => {
                    res.status.should.equal(200);
                    res.body.should.have.length(1);
                    checkDraft(group, draftsData[1], res.body[0]);
                })
            )
    );

    function checkDraft(researchEntity, draftData, draft) {
        draft.title.should.equal(draftData.title);
        draft.draft.should.be.true;
        if (draft.draftCreator)
            draft.draftCreator.should.equal(researchEntity.id);
        else
            draft.draftGroupCreator.should.equal(researchEntity.id);
    }

});
