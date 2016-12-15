import _ from 'lodash';

const mapViewDtoConverter = {
    create,
    pictureUpdate
};

export default mapViewDtoConverter;

function create({ name, description, active, defaultView, sensors }) {
    // console.log(123, name, description, active, default, sensors);
    return _.omitBy(
        { name, description, active, default: defaultView, sensors },
        (value) => _.isUndefined(value)
    );
}

function pictureUpdate(pictureName) {
    return { pictureName };
}