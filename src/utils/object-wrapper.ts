import { LogicError, FatalError, ISLAND } from '../utils/error';

export default class ObjectWrapper<T> {
  protected object: T
  public get Object() {
    if (!this.object) throw new LogicError(ISLAND.LOGIC.L0003_NOT_INITIALIZED_EXCEPTION, 'Not initialized exception');
    return this.object;
  }

  public initialize() {
    throw new FatalError(ISLAND.FATAL.F0019_NOT_IMPLEMENTED_ERROR, 'Not implemented exception');
  }

  public onInitialized() {}
}