'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _Admin = require('../private/Admin');

var _Admin2 = _interopRequireDefault(_Admin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ssn = void 0;
var router = _express2.default.Router();

router.use((0, _expressSession2.default)({
  secret: 'rwajon@sendit',
  resave: true,
  saveUninitialized: true
}));

router.get('/', function (req, res) {
  ssn = req.session;

  if (!ssn.admin) {
    res.redirect('/admins/signin');
  }

  res.render('admins', {
    title: 'Admin | SendIT',
    path: '../',
    admin: true
  });
});

// signin
router.all('/signin', function (req, res) {
  ssn = req.session;

  if (req.method === 'POST') {
    ssn.admins = JSON.parse(_fs2.default.readFileSync('private/admins.json'));
    var admin = new _Admin2.default(ssn.admins);
    var account = admin.signin(req.body);

    if (!admin.error) {
      ssn.admin = account;
      res.redirect('/admins');
    }

    ssn.admin = ssn.admin || false;

    res.render('admin_signin', {
      title: 'Sign-in | SendIT',
      path: '../',
      admin: ssn.admin,
      error: admin.error
    });
  } else {
    res.render('admin_signin', {
      title: 'Sign-in | SendIT',
      path: '../',
      admin: ssn.admin || false
    });
  }
});

exports.default = router;