import proxyquire from 'proxyquire';

describe('Auth', () => {
    let sut;
    let configStub;
    let oauth2Stub;
    let req;
    let res;

    beforeEach(function () {
        configStub = {
            facebook: {
                clientID: 'client-id-123',
                clientSecret: 'client-secret-abc',
                baseSite: 'http://some-fb-oauth-service.com',
                authorizationURL: '/some-auth-url'
            }
        };
        const oauthMock = {
            OAuth2: env.stub()
        };
        oauth2Stub = {
            getAuthorizeUrl: env.stub()
        };
        oauthMock.OAuth2.returns(oauth2Stub);

        // expect(res.redirect).to.have.been.calledWith(fbAuthUrl);
        sut = proxyquire('./auth.controller', {
            '../../config/env': configStub,
            'oauth': oauthMock
        });
    });

    describe('FB login url', () => {
        const fbAuthUrl = 'http://fb-auth.com/path';
        beforeEach(() => {
            oauth2Stub.getAuthorizeUrl.returns(fbAuthUrl);

            req = {
                query: {
                    redirect_uri: '/some-redirect-uri'
                }
            };
            res = {
                redirect: env.stub()
            };

            sut.facebookLogin(req, res);
        });

        it('should redirect to FB OAuth url', () => {
            expect(oauth2Stub.getAuthorizeUrl).to.have.been.calledWith({
                response_type: 'token',
                scope: ['public_profile', 'email'].join(','),
                redirect_uri: req.query.redirect_uri
            });

            expect(res.redirect).to.have.been.calledWith(fbAuthUrl);
        });
    });
});
