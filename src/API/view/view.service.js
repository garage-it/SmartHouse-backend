import ViewModel from '../view/view.model';

const viewService = {
    getById,
    create
};

export default viewService;

function getById(id) {
    return ViewModel.findById(id)
        .then((view) => new ViewModel(view));
}

function create(createDto) {
    return new ViewModel(createDto)
        .save()
        .then(onActionCompleted);
}

function onActionCompleted({ id }) {
    return getById(id);
}
