/// <reference path="../typings/tsd.d.ts" />
interface ICommand extends commander.IExportedCommand {
  host: string;
  port: number;
  etcdServer: {
    host: string;
    port: number;
  };
  serviceName: string;
}

export = ICommand;