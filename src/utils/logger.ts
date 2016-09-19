import * as winston from 'winston';
import { Loggers } from './loggers';

export const logger = Loggers.get('island');
