import MapViewModel from './map-view.model';
import SensorModel from '../sensors/sensor.model';
import filesService from '../files/files.service';

const mapViewService = {
    create,
    updatePicture
};

export default mapViewService;

function getById(id) {
    return MapViewModel.findById(id)
        .populate(getSensorPopulationConfig())
        .then((mapView) => new MapViewModel(mapView));
}

function getSensorPopulationConfig() {
    return {
        path: 'sensors.sensor',
        model: SensorModel
    };
}

function create(createDto) {
    return new MapViewModel(createDto)
        .save()
        .then(onActionCompleted);
}

function updatePicture(id, newName) {

    return getById(id)
        .then(onReceived)
        .then(onActionCompleted);

    function onReceived(mapViewModel) {
        return filesService.tryDeleteFile(mapViewModel.pictureName)
            .then(onOldPictureRemoved);

        function onOldPictureRemoved() {
            return MapViewModel.findByIdAndUpdate(id, { pictureName: newName });
        }
    }
}

function onActionCompleted({ id }) {
    return getById(id);
}
