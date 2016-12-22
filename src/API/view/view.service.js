import mapViewService from '../map-view/map-view.service';
import dashboardViewService from '../dashboard-view/dashboard-view.service';

import ViewModel from '../view/view.model';
import MapViewModel from '../map-view/map-view.model';
import DashboardViewModel from '../dashboard-view/dashboard-view.model';
import SensorModel from '../sensors/sensor.model';

const viewService = {
    getById,
    getAll,
    create,
    update
};

export default viewService;

const viewModelConfig = [
    {
        path: 'mapSubview',
        model: MapViewModel,
        populate: {
            path: 'sensors.sensor',
            model: SensorModel
        }
    },
    {
        path: 'dashboardSubview',
        model: DashboardViewModel,
        populate: {
            path: 'devices',
            model: SensorModel
        }
    }
];

function getById(id) {
    // return ViewModel.findById(id)
    //     .populate(viewModelConfig)
    //     .exec();
    // TODO: Replace stub with real data from mongoose models.
    // TODO: Check accepted data format - http://www.jsoneditoronline.org/?id=b510427df01b405c54fbf4dcaa7b852a
    return Promise.resolve(
        [
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
        ]
    );
}

function getAll() {
    return ViewModel.find()
        .populate(viewModelConfig)
        .exec();
}

function create(createDto) {
    return Promise.all([
        mapViewService.create(createDto.mapSubview),
        dashboardViewService.create(createDto.dashboardSubview)
    ]).then(values => {
        createDto.mapSubview = values[0].id;
        createDto.dashboardSubview = values[1].id;

        return new ViewModel(createDto).save();
    }).then(onActionCompleted);
}

function update(updateDto) {
    var viewId = updateDto._id;
    delete updateDto._id;

    return Promise.all([
        mapViewService.update(updateDto.mapSubview),
        dashboardViewService.update(updateDto.dashboardSubview)
    ]).then(values => {
        updateDto.mapSubview = values[0].id;
        updateDto.dashboardSubview = values[1].id;

        return ViewModel.update({ '_id': viewId }, { $set: updateDto });
    }).then(() => getById(viewId));
}

function onActionCompleted({ id }) {
    return getById(id);
}
