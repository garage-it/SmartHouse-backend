import ViewModel from './view.model';

export default {
    query,
    getById
};

function query(req, res) {
    ViewModel.find()
      .populate(getViewPopulationConfig())
      .then(result => {
          res.json(result);
      });
}

function getById(req, { send }, next) {
    const { id } = req.params;

    ViewModel.findById(id)
        .populate(getViewPopulationConfig())
        .then(send)
        .catch(next);
}

function getViewPopulationConfig() {
    return [{
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
    }];
}
