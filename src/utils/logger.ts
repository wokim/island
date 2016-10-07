import * as winston from 'winston';
import { Loggers } from './loggers';

export const logger = Loggers.get('island');
Loggers.switchLevel('island', process.env.ISLAND_LOGGER_LEVEL || 'info');
