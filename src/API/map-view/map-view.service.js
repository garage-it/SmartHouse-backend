import MapViewModel from './map-view.model';
import SensorModel from '../sensors/sensor.model';
import filesService from '../files/files.service';
import { infoUpdate, pictureUpdate } from './map-view-updates.converter';

const mapViewService = {
    get,
    updateInfo,
    updatePicture
};

export default mapViewService;

function get() {
    return MapViewModel.findOne()
        .populate({
            path: 'sensors.sensor',
            model: SensorModel
        })
        .then((mapView) => new MapViewModel(mapView));
}

function updateInfo(updates) {

    return mapViewService.get()
        .then(onMapViewReceived)
        .then(get);

    function onMapViewReceived(mapView) {
        return Object
            .assign(mapView, infoUpdate(updates))
            .save();
    }
}

function updatePicture(newName) {

    return mapViewService.get()
        .then(onMapViewReceived);

    function onMapViewReceived(mapView) {
        return filesService.tryDeleteFile(mapView.pictureName)
            .then(onOldPictureRemoved)
            .then(get);

        function onOldPictureRemoved() {
            return Object.assign(mapView, pictureUpdate(newName))
                .save();
        }
    }
}
