import { StatusExporter } from 'island-status-exporter';

export const STATUS_EXPORT: boolean = process.env.STATUS_EXPORT === 'true';
export const STATUS_EXPORT_TIME_MS: number = parseInt(process.env.STATUS_EXPORT_TIME, 10) || 10 * 1000;
const STATUS_FILE_NAME: string = process.env.STATUS_FILE_NAME;
const HOST_NAME: string = process.env.HOSTNAME;
const SERVICE_NAME: string = process.env.SERVICE_NAME;

if (STATUS_EXPORT)
  StatusExporter.initialize({ name: STATUS_FILE_NAME, hostname: HOST_NAME, servicename: SERVICE_NAME });

export const exporter = StatusExporter;
