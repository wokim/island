import {
  AbstractError,
  AbstractFatalError,
  AbstractLogicError,
  ErrorLevel,
  ExpectedError,
  FatalError,
  ISLAND,
  IslandLevel,
  LogicError,
  setIslandCode
} from '../utils/error';
import { RpcResponse } from '../utils/rpc-response';

describe('Error', () => {
  afterEach(() => {
    setIslandCode(0);
  });

  it('should identify error level', () => {
    const logic = new LogicError(ISLAND.LOGIC.L0001_PLAYER_NOT_EXIST);
    expect(logic.code).toEqual(200010001);

    const fatal = new FatalError(ISLAND.FATAL.F0001_ISLET_ALREADY_HAS_BEEN_REGISTERED);
    expect(fatal.code).toEqual(300010001);

    const expected = new ExpectedError(ISLAND.EXPECTED.E0001_UNKNOWN);
    expect(expected.code).toEqual(100010001);
  });
  it('should identify island code', () => {
    setIslandCode(1);
    const logic = new LogicError(ISLAND.LOGIC.L0001_PLAYER_NOT_EXIST);
    expect(logic.code).toEqual(200110001);

    setIslandCode(11);
    const fatal = new FatalError(ISLAND.FATAL.F0001_ISLET_ALREADY_HAS_BEEN_REGISTERED);
    expect(fatal.code).toEqual(301110001);

    setIslandCode(111);
    const expected = new ExpectedError(ISLAND.EXPECTED.E0001_UNKNOWN);
    expect(expected.code).toEqual(111110001);
  });
  it('should identify island level', () => {
    class IslandLogicError extends AbstractLogicError {
      constructor(errorCode: ISLAND.LOGIC) {
        super(0, 0, errorCode, '');
      }
    }
    const logic = new IslandLogicError(1);
    expect(logic.code).toEqual(200000001);
  });
  it('should have an unique id', () => {
    const e = new LogicError(ISLAND.LOGIC.L0001_PLAYER_NOT_EXIST);
    expect(e.extra.uuid.split('-').length).toEqual(5);
  });
  it('should split code of an AbstractError', () => {
    setIslandCode(1);
    const e = new LogicError(ISLAND.LOGIC.L0001_PLAYER_NOT_EXIST);
    const raw = e.split();
    expect(raw.errorLevel).toEqual(ErrorLevel.LOGIC);
    expect(raw.errorLevelName).toEqual('LOGIC');
    expect(raw.islandCode).toEqual(1);
    expect(raw.islandLevel).toEqual(IslandLevel.ISLANDJS);
    expect(raw.islandLevelName).toEqual('ISLANDJS');
    expect(raw.errorCode).toEqual(ISLAND.LOGIC.L0001_PLAYER_NOT_EXIST);
    /* {
      errorLevel:  2, errorLevelName:  'LOGIC',
      islandCode:  1,
      islandLevel: 1, islandLevelName: 'ISLANDJS',
      errorCode:   1
    } */
  });
  it('should merge numbers into a code', () => {
    const code = AbstractError.mergeCode(
      ErrorLevel.LOGIC,
      1,
      IslandLevel.ISLANDJS,
      ISLAND.LOGIC.L0001_PLAYER_NOT_EXIST);
    expect(code).toEqual(200110001);
  });
});

describe('Error decode', () => {
  afterEach(() => {
    setIslandCode(0);
  });

  it('encode-decode', () => {
    {
      const error = new LogicError(ISLAND.LOGIC.L0001_PLAYER_NOT_EXIST);
      const decoded = RpcResponse.decode(RpcResponse.encode(error));
      expect(decoded.body instanceof AbstractLogicError).toBeTruthy();
      expect(decoded.body.code).toEqual(error.code);
    }

    {
      setIslandCode(1);
      const error = new FatalError(ISLAND.FATAL.F0001_ISLET_ALREADY_HAS_BEEN_REGISTERED);
      const encoded = RpcResponse.encode(error);
      setIslandCode(0);
      const decoded = RpcResponse.decode(encoded);
      expect(decoded.body instanceof AbstractFatalError).toBeTruthy();
      expect(decoded.body.code).toEqual(error.code);
    }
  });
});
