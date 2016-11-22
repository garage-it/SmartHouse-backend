import filesService from './files.service';

function query(req, res, next) {
    filesService.getFiles()
        .then(files => res.json(files))
        .catch(next);
}

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

export default { query, create, update, remove };