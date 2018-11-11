import fs from 'fs';
import express from 'express';
import session from 'express-session';
import Parcel from '../../private/Parcel';

let ssn;
const router = express.Router();

router.use(session({
  secret: 'rwajon@sendit',
  resave: true,
  saveUninitialized: true,
}));

/* -------------------static orders-----------------------------*/
const staticOrders = JSON.parse(fs.readFileSync('private/parcels.json'));
/* --------------------------------------------------------------*/

// Fetch all parcel delivery orders
router.get('/', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  ssn.parcels = parcel.getAll();

  res.send({
    allParcels: ssn.parcels,
    error: parcel.error,
  });  
});

// Fetch all pending parcel delivery orders
router.get('/pending', (req, res) => {
  ssn = req.session;
  // ssn.parcels = ssn.parcels || {};
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  const pending = parcel.getPending();

  res.send({
    pending,
    error: parcel.error,
  });  
});

// Fetch all parcels in transit
router.get('/in-transit', (req, res) => {
  ssn = req.session;
  // ssn.parcels = ssn.parcels || {};
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  const inTransit = parcel.getInTransit();

  res.send({
    inTransit,
    error: parcel.error,
  });  
});

// Fetch all delivered parcel
router.get('/delivered', (req, res) => {
  ssn = req.session;
  // ssn.parcels = ssn.parcels || {};
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  const delivered = parcel.getDelivered();

  res.send({
    delivered,
    error: parcel.error,
  });  
});

// Fetch a specific parcel delivery oder
router.get('/:pId', (req, res) => {
  ssn = req.session;
  // ssn.parcels = ssn.parcels || {};
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  const details = parcel.getDetails(req.params.pId);

  res.send({
    parcelDetails: details,
    error: parcel.error,
  });  
});

// Change a specific parcel delivery order of a specific user
router.all('/:pId/change', (req, res) => {
  ssn = req.session;
  // ssn.parcels = ssn.parcels || {};
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  const details = parcel.getDetails(req.params.pId);

  if (req.method === 'POST') {
    const changed = parcel.changeOrder(req.params.pId, req.body);

    res.send({
      changed,
      error: parcel.error,
    });
  } else {
    res.send({
      parcelDetails: details,
      error: parcel.error,
    });
  }  
});

export default router;