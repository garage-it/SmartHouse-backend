import _ from 'lodash';

const mapViewDtoConverter = {
    create,
    pictureUpdate
};

export default mapViewDtoConverter;

function create({ name, description, active, sensors }) {
    return _.omitBy(
        { name, description, active, sensors },
        (value) => _.isUndefined(value)
    );
}

function pictureUpdate(pictureName) {
    return { pictureName };
}