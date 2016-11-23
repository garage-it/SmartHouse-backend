import _ from 'lodash';

export default mapViewInfoUpdatesDto;

function mapViewInfoUpdatesDto({ name, description, active }) {
    return _.omitBy(
        { name, description, active },
        (value) => _.isUndefined(value)
    );
}