import fsHelper from './../../shared/fs-helper';

function query(req, res, next) {
    fsHelper.getFiles()
        .then(files => res.json(files))
        .catch(error => handleError(res, error));
}

function get(req, res, next) {
    fsHelper.getFile(req.params.fileName)
        .then(result => {
            res.writeHead(200, {'Content-Type': 'image/jpeg'})
            res.end(result);
        })
        .catch(error => handleError(res, error));
}

function create(req, res) {
    return res.json(req.file.filename);
}

function update(req, res) {
    fsHelper.deleteFile(req.params.fileName)
        .then(data => res.json(req.file.filename))
        .catch(error => handleError(res, error));
}

function remove(req, res) {
    fsHelper.deleteFile(req.params.fileName)
        .then(data => res.end())
        .catch(error => handleError(res, error));
}

function handleError(res, error) {
    console.error(error);
    return res.status(500).send(error);
}

export default { query, create, update, remove, get };