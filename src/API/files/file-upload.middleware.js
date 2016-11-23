import multer from 'multer';
import config from '../../config/env';

const uploadsConfig = {
    dest: config.filesPath
};

const fieldName = 'file';

export default multer(uploadsConfig).single(fieldName);