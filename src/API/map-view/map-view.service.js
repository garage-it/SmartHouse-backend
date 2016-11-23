import MapViewModel from './map-view.model';
import filesService from '../files/files.service';
import mapViewInfoUpdatesDto from './map-view-info-updates.dto';

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

function updateInfo(rawUpdates) {
    const updates = mapViewInfoUpdatesDto(rawUpdates);

    return mapViewService.get()
        .then(onMapViewReceived);

    function onMapViewReceived(mapView) {
        Object.assign(mapView, updates);
        return mapView.save();
    }
}

function updatePicture(newPictureName) {

    return mapViewService.get()
        .then(onMapViewReceived);

    function onMapViewReceived(mapView) {
        return filesService.tryDeleteFile(mapView.pictureName)
            .then(onOldPictureRemoved);

        function onOldPictureRemoved() {
            mapView.pictureName = newPictureName;
            return mapView.save();
        }
    }
}
