import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../models/index';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('Admin', () => {
  // clear admins table
  before(async () => {
    try {
      await db.query('TRUNCATE admins CASCADE; ALTER SEQUENCE admins_id_seq RESTART WITH 1;');
      await db.query('TRUNCATE orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
    } catch (error) {
      console.log(error);
    }
  });

  /* Sign-up */
  describe('Sign-up', () => {
    describe('POST /api/v1/admins/signup', () => {
      // test 1
      it('should return the admin information if the registration has succeeded', (done) => {
        chai
          .request(app)
          .post('/api/v1/admins/signup')
          .send({
            firstName: 'Jonathan',
            lastName: 'Rwabahizi',
            userName: 'rwajon',
            password: '12345',
            phone: '+250781146646',
            email: 'jonathanrwabahizi@gmail.com',
            country: 'Rwanda',
            city: 'Gisenyi',
            address: 'Mbugangari',
          })
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(Object.keys(JSON.parse(res.text).newAdmin).length).to.be.above(0);
            done();
          });
      });

      // test 2
      it("should display 'Please, enter the required information to sign-up!'", (done) => {
        chai
          .request(app)
          .post('/api/v1/admins/signup')
          .send({
            firstName: 'Jonathan',
            lastName: '',
            userName: 'rwajon',
            password: '',
            phone: '+250781146646',
            email: 'jonathanrwabahizi@gmail.com',
            country: 'Rwanda',
            city: 'Gisenyi',
            address: 'Mbugangari',
          })
          .end((err, res) => {
            expect(res.status).to.equal(500);
            expect(JSON.parse(res.text).error).to.equal(
              'Please, enter the required information to sign-up!',
            );
            done();
          });
      });

      // test 3
      it("should display 'Sorry, this account already exists'", (done) => {
        chai
          .request(app)
          .post('/api/v1/admins/signup')
          .send({
            firstName: 'Jonathan',
            lastName: 'Rwabahizi',
            userName: 'rwajon',
            password: '12345',
            phone: '+250781146646',
            email: 'jonathanrwabahizi@gmail.com',
            country: 'Rwanda',
            city: 'Gisenyi',
            address: 'Mbugangari',
          })
          .end((err, res) => {
            expect(res.status).to.equal(500);
            expect(JSON.parse(res.text).error).to.equal('Sorry, this account already exists');
            done();
          });
      });
    });
  }); // end of Sign-up

  /* Sign-in */
  describe('Sign-in', () => {
    describe('POST /api/v1/admins/login', () => {
      // test 1
      it('should return the admin information if the account exists', (done) => {
        chai
          .request(app)
          .post('/api/v1/admins/login')
          .send({
            userName: 'rwajon',
            password: '12345',
          })
          .end((err, res) => {
            expect(res.status).to.equal(202);
            expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);
            done();
          });
      });

      // test 2
      it("should display 'Sorry, your username or password is incorrect'", (done) => {
        chai
          .request(app)
          .post('/api/v1/admins/login')
          .send({
            userName: 'rwajon',
            password: '1234',
          })
          .end((err, res) => {
            expect(res.status).to.equal(500);
            expect(JSON.parse(res.text).error).to.equal(
              'Sorry, your username or password is incorrect',
            );
            done();
          });
      });

      // test 3
      it("should display 'Please, enter your username and your password!'", (done) => {
        chai
          .request(app)
          .post('/api/v1/admins/login')
          .send({
            userName: '',
            password: '',
          })
          .end((err, res) => {
            expect(res.status).to.equal(500);
            expect(JSON.parse(res.text).error).to.equal(
              'Please, enter your username and your password!',
            );
            done();
          });
      });
    });
  }); // end of Sign-in
});
