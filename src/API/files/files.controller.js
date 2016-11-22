import filesService from './files.service';

function create(req, res) {
    return res.json(req.file.filename);
}

function update(req, res, next) {
    filesService.deleteFile(req.params.filename)
        .then(() => res.json(req.file.filename))
        .catch(next);
}

function remove(req, res, next) {
    filesService.deleteFile(req.params.filename)
        .then(() => res.end())
        .catch(next);
}

export default { create, update, remove };