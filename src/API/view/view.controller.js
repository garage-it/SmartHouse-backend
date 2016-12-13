import ViewModel from './view.model';

export default {
    query
};

function query(req, res) {
    ViewModel.find()
      .populate([{
          path: 'mapView',
          populate: {
              path: 'sensors.sensor',
              model: 'Sensor'
          }
      }, {
          path: 'dashboard',
          populate: {
              path: 'devices',
              model: 'Sensor'
          }
      }])
      .then(result => {
          res.json(result);
      });
}
