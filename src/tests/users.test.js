import fs from 'fs';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { assert } = chai;
const { expect } = chai;
const users = JSON.parse(fs.readFileSync('src/models/users.json'));

chai.use(chaiHttp);

describe('User', () => {
  // get user info
  describe('GET /api/v1/users/:id', () => {
    it('should return the info of a specific user with the id: 001', (done) => {
      chai.request(app)
        .get('/api/v1/users/001')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).userInfo).length).to.be.above(0);
          done();
        });
    });

    it('should display \'Sorry, there is no user that corresponds to this id: 0000\'', (done) => {
      chai.request(app)
        .get('/api/v1/users/0000')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.equal('Sorry, there is no user that corresponds to this id: 0000');
          done();
        });
    });
  });

  /* Sign-in */
  describe('Sign-in', () => {
    describe('POST /api/v1/users/signin', () => {
      // test 1
      it('should return the user information if the account exists', (done) => {
        chai.request(app)
          .post('/api/v1/users/signin')
          .send({
            uname: 'rwajon',
            password: '12345',
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);
            done();
          });
      });

      // test 2
      it('should display \'Sorry, your username or password is incorrect\'', (done) => {
        chai.request(app)
          .post('/api/v1/users/signin')
          .send({
            uname: 'rwajon',
            password: '1234',
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(JSON.parse(res.text).error).to.equal('Sorry, your username or password is incorrect');
            done();
          });
      });

      // test 3
      it('should display \'Please, enter your username and your password!\'', (done) => {
        chai.request(app)
          .post('/api/v1/users/signin')
          .send({
            uname: '',
            password: '',
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(JSON.parse(res.text).error).to.equal('Please, enter your username and your password!');
            done();
          });
      });
    });
  }); // end of Sign-in

  /* Sign-up */
  describe('Sign-up', () => {
    describe('POST /api/v1/users/signup', () => {
      // test 1
      it('should return the user information if the registration has succeeded', (done) => {
        chai.request(app)
          .post('/api/v1/users/signup')
          .send({
            id: '001',
            fname: 'Jonathan',
            lname: 'Rwabahizi',
            uname: 'rwajon',
            password: '12345',
            phone: '+250781146646',
            email: 'jonathanrwabahizi@gmail.com',
            country: 'Rwanda',
            city: 'Gisenyi',
            address: 'Mbugangari',
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(Object.keys(JSON.parse(res.text).newUser).length).to.be.above(0);
            done();
          });
      });

      // test 2
      it('should display \'Please, enter the required information to sign-up!\'', (done) => {
        chai.request(app)
          .post('/api/v1/users/signup')
          .send({
            id: '001',
            fname: 'Jonathan',
            lname: '',
            uname: 'rwajon',
            password: '',
            phone: '+250781146646',
            email: 'jonathanrwabahizi@gmail.com',
            country: 'Rwanda',
            city: 'Gisenyi',
            address: 'Mbugangari',
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(JSON.parse(res.text).error).to.equal('Please, enter the required information to sign-up!');
            done();
          });
      });
    });
  }); // end of Sign-up

  describe('GET /api/v1/users/:id/parcels', () => {
    it('should return all parcel delivery orders of the user 001', (done) => {
      chai.request(app)
        .get('/api/v1/users/001/parcels')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).allParcels).length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/users/:id/parcels

  describe('GET /api/v1/users/:id/parcels/:pId', () => {
    it('should return details of a specific parcel delivery order with the id: 002 of the user 001', (done) => {
      chai.request(app)
        .get('/api/v1/users/001/parcels/002')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).parcelDetails).length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/users/:id/parcels/:pId

  describe('GET /api/v1/users/:id/parcels/pending', () => {
    it('should return all pending parcel delivery orders of the user 001', (done) => {
      chai.request(app)
        .get('/api/v1/users/001/parcels/pending')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).pending).length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/users/:id/parcels/pending

  describe('GET /api/v1/users/:id/parcels/in-transit', () => {
    it('should return all parcels in transit of the user 001', (done) => {
      chai.request(app)
        .get('/api/v1/users/001/parcels/in-transit')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).inTransit).length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/users/:id/parcels/in-transit

  describe('GET /api/v1/users/:id/parcels/delivered', () => {
    it('should return all delivered parcels of the user 001', (done) => {
      chai.request(app)
        .get('/api/v1/users/001/parcels/delivered')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).delivered).length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/users/:id/parcels/delivered

  describe('PUT /api/v1/users/:id/parcels/:pId/change', () => {
    // test 1
    it('change the destination of a specific parcel delivery order with the id: 002 of the user 001', (done) => {
      chai.request(app)
        .put('/api/v1/users/001/parcels/001/change')
        .send({
          new_country: 'England',
          new_city: 'London',
          new_address: 'Downtown',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).changed).length).to.be.above(0);
          done();
        });
    });

    // test 2
    it('should display \'Sorry, this order was not changed\'', (done) => {
      chai.request(app)
        .put('/api/v1/users/001/parcels/001/change')
        .send({
          new_country: '',
          new_city: '',
          new_address: '',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Sorry, this order was not changed');
          done();
        });
    });
  }); // end of PUT /api/v1/users/:id/parcels/:pId/change

  describe('PUT /api/v1/users/:id/parcels/:pId/cancel', () => {
    it('cancel a specific parcel delivery order with the id: 003', (done) => {
      chai.request(app)
        .put('/api/v1/users/001/parcels/003/cancel')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.text).to.be.equal('Cancelled');
          done();
        });
    });
  }); // end of PUT /api/v1/users/:id/parcels/:pId/cancel
});
