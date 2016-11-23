import _ from 'lodash';

export function infoUpdate({ name, description, active, sensors }) {
    return _.omitBy(
        { name, description, active, sensors },
        (value) => _.isUndefined(value)
    );
}

export function pictureUpdate(pictureName) {
    return { pictureName };
}