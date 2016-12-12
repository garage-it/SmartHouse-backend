import MapViewModel from './map-view.model';
import SensorModel from '../sensors/sensor.model';
import filesService from '../files/files.service';
import mapViewDtoConverter from './map-view-dto.converter';
import viewService from '../view/view.service';

const mapViewService = {
    getById,
    create,
    query,
    updatePicture
};

export default mapViewService;

function getById(id) {
    return MapViewModel.findById(id)
        .populate({
            path: 'sensors.sensor',
            model: SensorModel
        })
        .then((mapView) => new MapViewModel(mapView));
}

function query() {
    return MapViewModel.findAsync({});
}

function create(createDto) {
    return new MapViewModel(mapViewDtoConverter.create(createDto))
        .save()
        .then((mapView) => {
            viewService.create({mapView});
            return mapView;
        });
}

function updatePicture(id, newName) {

    return mapViewService.getById(id)
        .then(onReceived)
        .then(onActionCompleted);


    function onReceived(mapViewModel) {
        return filesService.tryDeleteFile(mapViewModel.pictureName)
            .then(onOldPictureRemoved);

        function onOldPictureRemoved() {
            return MapViewModel.findByIdAndUpdate(id,  mapViewDtoConverter.pictureUpdate(newName));
        }
    }
}

function onActionCompleted({ id }) {
    return getById(id);
}
