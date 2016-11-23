import MapViewModel from './map-view.model';
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
        .then((mapView) => new MapViewModel(mapView));
}

function updateInfo(updates) {

    return mapViewService.get()
        .then(onMapViewReceived);

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
            .then(onOldPictureRemoved);

        function onOldPictureRemoved() {
            return Object.assign(mapView, pictureUpdate(newName))
                .save();
        }
    }
}
