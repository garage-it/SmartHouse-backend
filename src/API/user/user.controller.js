import UserService from '../../shared/user/user.service';

function getAllUsers(req, res) {
    UserService.getAllUsers()
        .then((results) => {
            res.json({
                status: 'success',
                responses: results
            });
        })
        .catch((err) => {
            res.json(err);
        });
}

function add(req, res) {
    UserService.createUser(req.body)
        .then((results) => {
            res.json({
                status: 'success',
                responses: results
            });
        })
        .catch((err) => {
            res.json(err);
        });
}

function update(req, res) {
    UserService.updateUser(req.body, req.user._id)
        .then((results) => {
            res.json({
                status: 'success',
                responses: results
            });
        })
        .catch((err) => {
            res.json(err);
        });
}

function getById(req, res) {
    UserService.getUserById(req.params.id)
        .then((result) => {
            res.json(result.toObject({transform: true}));
        })
        .catch((err) => {
            res.json(err);
        });
}

function deleteUserById(req, res) {
    UserService.deleteUser(req.params.id)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.json(err);
        });
}

export default {
    getAllUsers,
    add,
    update,
    getById,
    deleteUserById
};