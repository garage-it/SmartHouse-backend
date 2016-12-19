import ViewModel from './view.model';

export default {
    query,
    getById
};

function query(req, res) {
    // ViewModel.find()
    //     .populate(getViewPopulationConfig())
    //     .then(result => {
    //         res.json(result);
    //     });
    // TODO: Replace stub with real data from mongoose models
    res.json([
        {
            "_id": "1",
            "name": "View name",
            "description": "View description",
            "default": "MapSubview",
            "mapSubview": {
                "active": true,
                "sensors": [
                    {
                        "sensor": {
                            "_id":"58528d9ad448722a90ecdfd8",
                            "description":"humidity",
                            "type":"sensor",
                            "metrics":"percents",
                            "mqttId":"humidity",
                            "__v":0,
                            "value":78,
                            "valueUpdated":"2016-12-16T07:17:05.485Z",
                            "servo":false,
                            "executor":false
                        },
                        "position": {"x":367,"y":65},
                        "_id":"585118fe0cbb9b84cf449f49"
                    },
                    {
                        "sensor": {
                            "_id":"58528d9ad448722a90ecdfd7",
                            "description":"temperature",
                            "type":"sensor",
                            "metrics":"celsius",
                            "mqttId":"temperature",
                            "__v":0,
                            "value":42,
                            "valueUpdated":"2016-12-16T07:17:04.474Z",
                            "servo":false,
                            "executor":false
                        },
                        "position": {"x":193,"y":62},
                        "_id":"585118fe0cbb9b84cf449f48"
                    },
                    {
                        "sensor": {
                            "_id":"58528d9ad448722a90ecdfdb",
                            "description":"electricity",
                            "type":"switcher",
                            "mqttId":"electricity",
                            "__v":0,
                            "value":"OFF",
                            "valueUpdated":"2016-12-19T12:26:14.492Z",
                            "servo":false,
                            "executor":true
                        },
                        "position": {"x":193,"y":62},
                        "_id":"585118fe0cbb9b84cf449f48"
                    }
                ],
                "pictureName": "acbddc88b0c0af0ba1c300f28836b2a2"
            },
            "dashboardSubview": {
                "active": true,
                "sensors": [
                    {
                        "sensor": {
                            "_id":"58528d9ad448722a90ecdfdc",
                            "description":"socket",
                            "type":"switcher",
                            "mqttId":"socket",
                            "__v":0,
                            "servo":false,
                            "executor":false
                        },
                        "position": {"x":262,"y":158},
                        "_id":"585118fe0cbb9b84cf449f47"
                    }
                ]
            }
        },
        {
            "_id": "2",
            "name": "Second view name",
            "description": "Second view description",
            "default": "DashboardSubview",
            "mapSubview": {
                "active": true,
                "sensors": [
                    {
                        "sensor": {
                            "_id":"58528d9ad448722a90ecdfdc",
                            "description":"socket",
                            "type":"switcher",
                            "mqttId":"socket",
                            "__v":0,
                            "servo":false,
                            "executor":false
                        },
                        "position": {"x":262,"y":158},
                        "_id":"585118fe0cbb9b84cf449f47"
                    }
                ],
                "pictureName": "87ac2f80ac5238f537473d4e68298b7b"
            },
            "dashboardSubview": {
                "active": true,
                "sensors": [
                    {
                        "sensor": {
                            "_id":"58528d9ad448722a90ecdfd8",
                            "description":"humidity",
                            "type":"sensor",
                            "metrics":"percents",
                            "mqttId":"humidity",
                            "__v":0,
                            "value":78,
                            "valueUpdated":"2016-12-16T07:17:05.485Z",
                            "servo":false,
                            "executor":false
                        },
                        "position": {"x":367,"y":65},
                        "_id":"585118fe0cbb9b84cf449f49"
                    },
                    {
                        "sensor": {
                            "_id":"58528d9ad448722a90ecdfd7",
                            "description":"temperature",
                            "type":"sensor",
                            "metrics":"celsius",
                            "mqttId":"temperature",
                            "__v":0,
                            "value":42,
                            "valueUpdated":"2016-12-16T07:17:04.474Z",
                            "servo":false,
                            "executor":false
                        },
                        "position": {"x":193,"y":62},
                        "_id":"585118fe0cbb9b84cf449f48"
                    }
                ]
            }
        }
    ]);
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
