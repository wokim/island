import * as island from '../controllers/endpoint-decorator';
import { FatalError } from '../utils/error';

function fakeDecorate(decorator) {
  const target = {constructor: {}};
  decorator(target, null, {value: {options: {}}})
  return (target.constructor as any)._endpointMethods[0];
}

describe('@endpoint', () => {
  it('should be decorator itself', () => {
    class XX {
      @island.endpoint('GET /test')
      getTest() {}
    }
    const YY = XX as any;
    expect(YY._endpointMethods).toBeTruthy();
    expect(YY._endpointMethods[0]).toBeTruthy();
    expect(YY._endpointMethods[0].name).toEqual('GET /test');
  });
  it('should have separated methods', () => {
    expect(fakeDecorate(island.endpoint.get('/test')).name).toEqual('GET /test');
    expect(fakeDecorate(island.endpoint.post('/test')).name).toEqual('POST /test');
    expect(fakeDecorate(island.endpoint.put('/test')).name).toEqual('PUT /test');
    expect(fakeDecorate(island.endpoint.del('/test')).name).toEqual('DEL /test');
  });
  it('should prevent mistakes to redeclare method', () => {
    expect(() => fakeDecorate(island.endpoint.get('GET /test')).name).toThrowError(FatalError, /.*REDECLARED.*/);
    expect(() => fakeDecorate(island.endpoint.get('get /test')).name).toThrowError(FatalError, /.*REDECLARED.*/);
    expect(() => fakeDecorate(island.endpoint.get('POST /test')).name).toThrowError(FatalError, /.*REDECLARED.*/);
  });
});
