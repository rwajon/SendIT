import express from 'express';
// import session from 'express-session';

// let ssn;
const router = express.Router();

/* router.use(session({
  secret: 'rwajon@sendit',
  resave: true,
  saveUninitialized: true,
})); */

/* GET home page. */
router.get('/', (req, res) => {
  // ssn = req.session;

  res.send('Welcome!!!');
});

export default router;