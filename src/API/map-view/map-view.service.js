import MapViewModel from './map-view.model';
import filesService from '../files/files.service';

const mapViewService = {
    get,
    updatePicture
};

export default mapViewService;

function get() {
    return MapViewModel.findOne()
        .then((mapView) => new MapViewModel(mapView));
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
