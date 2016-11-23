import express from 'express';
import { filesPath } from '../../config/env';

export default {
    serve: express.static(filesPath)
};