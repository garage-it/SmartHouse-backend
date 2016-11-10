import UserService from '../../shared/user/user.service';

function getAllUsers(req, res, next) {
    UserService.getAllUsers()
        .then(results => {
            res.json({
                status: 'success',
                responses: results
            });
        })
        .catch(next);
}

function add(req, res, next) {
    UserService.createUser(req.body)
        .then(result => {
            res.json({
                status: 'success',
                responses: result.toObject({transform: true})
            });
        })
        .catch(next);
}

function update(req, res, next) {
    UserService.updateUser(req.body, req.user._id)
        .then(results => {
            res.json({
                status: 'success',
                responses: results
            });
        })
        .catch(next);
}

function getById(req, res, next) {
    UserService.getUserById(req.params.id)
        .then(result => res.json({
            status: 'success',
            responses: result
        }))
        .catch(next);
}

function deleteUserById(req, res, next) {
    UserService.deleteUser(req.params.id)
        .then(result => res.json({
            status: 'success',
            responses: result
        }))
        .catch(next);
}

function getCurrentUser(req, res) {
    res.json({
        status: 'success',
        responses: req.user
    });
}

export default {
    getAllUsers,
    add,
    update,
    getById,
    deleteUserById,
    getCurrentUser
};