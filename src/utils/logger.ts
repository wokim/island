import { Loggers } from 'island-loggers';
import * as winston from 'winston';

export const logger: winston.LoggerInstance = Loggers.get('island');
Loggers.switchLevel('island', process.env.ISLAND_LOGGER_LEVEL || 'info');
