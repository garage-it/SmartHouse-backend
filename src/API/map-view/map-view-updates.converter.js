import _ from 'lodash';

export function infoUpdate({ name, description, active }) {
    return _.omitBy(
        { name, description, active },
        (value) => _.isUndefined(value)
    );
}

export function pictureUpdate(pictureName) {
    return { pictureName };
}