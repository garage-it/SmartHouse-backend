import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import app from '../../index';
import UserService from '../../shared/user/user.service';
import AuthService from '../../shared/auth/auth.service';


describe('## User APIs', () => {
    let token;
    let user;

    beforeEach(done => {
        const newUser = {
            name: 'Test Test',
            email: 'test@gmail.com',
            password: 'qwerty',
            role: 'admin'
        };

        UserService.createUser(newUser).then(createdUser => {
            user = createdUser;
            token = AuthService.generateToken(createdUser._id);
            done();
        }).catch(done);

    });

    describe('# GET /api/user', () => {
        it('should get all users', done => {
            request(app)
                .get('/api/user')
                .set('Authorization', 'Bearer ' + token)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body.responses).to.have.lengthOf(1);
                    done();
                })
                .catch(done);
        });

        it('should available only for logged users with admin role', done => {
            request(app)
                .get('/api/user')
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => {
                    done();
                });
        });
    });

    describe('# POST /api/user', () => {
        it('should add new user', done => {
            const user = {
                name: 'Test2',
                email: 'test2@gmail.com',
                password: 'qwerty',
                role: 'admin'
            };

            request(app)
                .post('/api/user')
                .set('Authorization', 'Bearer ' + token)
                .send(user)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.responses).to.be.an('object');
                    done();
                })
                .catch(done);
        });
    });

    describe('# GET /api/user/:id', () => {
        it('should get user data by id', done => {
            request(app)
                .get('/api/user/' + user._id)
                .set('Authorization', 'Bearer ' + token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.responses).to.be.an('object');
                    done();
                })
                .catch(done);
        });

        it('should available only for logged users', done => {
            request(app)
                .get('/api/user')
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe('# PUT /api/user/:id', () => {
        it('should update user data', done => {
            request(app)
                .put('/api/user/' + user._id)
                .set('Authorization', 'Bearer ' + token)
                .send({name: 'testCase'})
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.responses).to.be.an('object');
                    expect(res.body.responses.name).to.be.eqls('testCase');
                    done();
                })
                .catch(done);
        });

        it('should available only for logged users', done => {
            request(app)
                .put('/api/user/' + user._id)
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe('# DELETE /api/user/:id', () => {
        it('should delete user data by id', done => {
            request(app)
                .delete('/api/user/' + user._id)
                .set('Authorization', 'Bearer ' + token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.responses).to.be.an('object');
                    done();
                })
                .catch(done);
        });

        it('should available only for logged users', done => {
            request(app)
                .delete('/api/user/' + user._id)
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe('# GET /api/user/current-user', () => {
        it('should get current user data', done => {
            request(app)
                .get('/api/user/current-user')
                .set('Authorization', 'Bearer ' + token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.responses._id).to.be.eqls(user._id.toString());
                    done();
                })
                .catch(done);
        });
    });
});

