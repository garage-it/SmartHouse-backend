import express from 'express';
import request from 'request';

const router = express.Router();

router.route('/:event')
  /** POST /api/ifttt/:event - post event from device to ifttt website */
  .post((req, res) => {
      let reqUrl = `https://maker.ifttt.com/trigger/${req.params.event}/with/key/craQiotyG9wGrXI`;
      request.post(reqUrl, (error, response) => {
          res.send({
              info: 'Posted to ifttt',
              request: req.params,
              response: response.body
          });
      });
  });

router.route('/event_handler')
  /** POST /api/ifttt/event_handler - here we handle events from IFTTT */
  .post((req, res) => {
      res.send('event-handler =>', req.body);
  });

export default router;
