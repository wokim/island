import { StatusExporter } from 'island-status-exporter';
import { Environments } from '../utils/environments';

export const STATUS_EXPORT: boolean = Environments.isStatusExport();
export const STATUS_EXPORT_TIME_MS: number = Environments.getStatusExportTimeMs();
const STATUS_FILE_NAME: string = Environments.getStatusFileName();
const HOST_NAME: string = Environments.getHostName();
const SERVICE_NAME: string = Environments.getServiceName();

if (STATUS_EXPORT)
  StatusExporter.initialize({ name: STATUS_FILE_NAME, hostname: HOST_NAME, servicename: SERVICE_NAME });

export const exporter = StatusExporter;
