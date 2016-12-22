import viewService from './view.service';

export default {
    query,
    create,
    get,
    update
};

function get(req, { send }, next) {
    const { id } = req.params;
    viewService.getById(id)
        .then(send)
        .catch(next);
}

function query(req, res, next) {
    viewService.getAll()
        .then(result => res.json(result))
        .catch(next);
}

function create(req, res, next) {
    viewService.create(req.body)
        .then(view => res.json(view))
        .catch(next);
}

function update(req, res, next) {
    viewService.update(req.body)
        .then(view => res.json(view))
        .catch(next);
}