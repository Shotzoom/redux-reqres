import { expect } from 'chai';
import createStore from 'redux-mock-store';
import reqres from '../source/action';
import middleware from '../source/middleware';

const fetch = () => ({ type: 'FETCH' });
const receive = () => ({ type: 'RECEIVE' });

describe('middleware', () => {
  it('should return a function.', () => {
    expect(middleware()).to.be.a('function');
  });

  it('should pass through non intrestng actions.', () => {
    const store = createStore([middleware])();
    const action = fetch();

    store.dispatch(action);
    expect(store.getActions()).to.eql([action]);
  });

  it('should dispatch a request only once.', () => {
    const store = createStore([middleware])();
    const action = fetch();
    const request = reqres('action').request(action);

    store.dispatch(request);
    store.dispatch(request);
    expect(store.getActions()).to.eqls([action]);
  });

  it('should not dispatch response before request.', () => {
    const store = createStore([middleware])();
    const response = reqres('action').response(receive());

    store.dispatch(response);
    expect(store.getActions()).to.eql([]);
  });

  it('should dispatch matching request and response.', () => {
    const store = createStore([middleware])();
    const actions = reqres('action');

    store.dispatch(actions.request(fetch()));
    store.dispatch(actions.response(receive()));
    expect(store.getActions()).to.eql([fetch(), receive()]);
  });

  it('should not dispatch response on invalidated requests.', () => {
    const store = createStore([middleware])();
    const first = reqres('action');
    const second = reqres('action');

    store.dispatch(first.request({ type: 'FIRST' }));
    store.dispatch(second.request({ type: 'SECOND' }));
    store.dispatch(first.response({ type: 'FIRST_RECIEVE' }));
    store.dispatch(second.response({ type: 'SECOND_RECIEVE' }));
    expect(store.getActions()).to.eql([
      { type: 'FIRST' },
      { type: 'SECOND' },
      { type: 'SECOND_RECIEVE' },
    ]);
  });

  it('should allow serial request/response.', () => {
    const store = createStore([middleware])();
    const first = reqres('action');
    const second = reqres('action');

    store.dispatch(first.request({ type: 'FIRST' }));
    store.dispatch(first.response({ type: 'FIRST_RECIEVE' }));
    store.dispatch(second.request({ type: 'SECOND' }));
    store.dispatch(second.response({ type: 'SECOND_RECIEVE' }));
    expect(store.getActions()).to.eql([
      { type: 'FIRST' },
      { type: 'FIRST_RECIEVE' },
      { type: 'SECOND' },
      { type: 'SECOND_RECIEVE' },
    ]);
  });

  it('should allow parallel request/response with different keys.', () => {
    const store = createStore([middleware])();
    const first = reqres('first');
    const second = reqres('second');

    store.dispatch(first.request({ type: 'FIRST' }));
    store.dispatch(second.request({ type: 'SECOND' }));
    store.dispatch(first.response({ type: 'FIRST_RECIEVE' }));
    store.dispatch(second.response({ type: 'SECOND_RECIEVE' }));
    expect(store.getActions()).to.eql([
      { type: 'FIRST' },
      { type: 'SECOND' },
      { type: 'FIRST_RECIEVE' },
      { type: 'SECOND_RECIEVE' },
    ]);
  });

  it('should return dispatched request result.', () => {
    const store = createStore([middleware])();
    const request = reqres('action').request(fetch());

    expect(store.dispatch(request)).to.eql(fetch());
  });

  it('should return dispatched response result.', () => {
    const store = createStore([middleware])();
    const actions = reqres('actions');

    store.dispatch(actions.request(fetch()));
    expect(store.dispatch(actions.response(receive()))).to.eql(receive());
  });

  it('should return nothing on non dispatched requests.', () => {
    const store = createStore([middleware])();
    const request = reqres('actions').request(fetch());

    store.dispatch(request);
    expect(store.dispatch(request)).to.equal(null);
  });

  it('should return nothing on non dispatched response.', () => {
    const store = createStore([middleware])();
    const response = reqres('actions').response(receive());

    expect(store.dispatch(response)).to.equal(null);
  });
});
