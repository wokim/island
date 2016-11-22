import * as winston from 'winston';
import { Loggers } from 'island-loggers';

export const logger: winston.LoggerInstance = Loggers.get('island');
Loggers.switchLevel('island', process.env.ISLAND_LOGGER_LEVEL || 'info');
