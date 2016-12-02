import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import app from '../../index';
import UserService from '../../shared/user/user.service';


describe('## User APIs', () => {
    let user;

    beforeEach(done => {
        user = {
            name: 'Test Test',
            email: 'test@gmail.com',
            password: 'qwerty',
            role: 'admin'
        };

        UserService.createUser(user)
            .then(() => {
                done();
            }).catch(done);

    });

    describe('# POST /api/auth/register', () => {
        it('should register new user', done => {
            const rawUser = {
                name: 'James Bond',
                email: 'agent007@mi6.uk',
                role: 'user',
                password: 'password'
            };

            request(app)
                .post('/api/auth/register')
                .send(rawUser)
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.be.an('object');
                    done();
                })
                .catch(done);
        });

        it('should register only with unique email', done => {
            request(app)
                .post('/api/auth/register')
                .send(user)
                .expect(httpStatus.BAD_REQUEST)
                .then(res => {
                    expect(res.body).to.be.an('object');
                    done();
                })
                .catch(done);
        });
    });

    describe('# POST /api/auth/login', () => {
        it('should logged user', done => {
            request(app)
                .post('/api/auth/login')
                .send({
                    email: user.email,
                    password: user.password
                })
                .expect(httpStatus.OK)
                .then(res => {
                    expect(res.body).to.be.an('object');
                    done();
                })
                .catch(done);
        });

        it('should logged user with correct password', done => {
            request(app)
                .post('/api/auth/login')
                .send({
                    email: user.email,
                    password: '123'
                })
                .expect(httpStatus.UNAUTHORIZED)
                .then(res => {
                    expect(res.body).to.be.an('object');
                    done();
                })
                .catch(done);
        });
    });
});

