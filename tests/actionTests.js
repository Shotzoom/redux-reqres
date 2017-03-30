import { expect } from 'chai';
import reqres from '../source/action';

describe('action', () => {
  it('should create new request/response action creator pair.', () => {
    const action = reqres('key');

    expect(action).to.have.property('request');
    expect(action).to.have.property('response');
    expect(action.request).to.be.a('function');
    expect(action.response).to.be.a('function');
  });

  it('should create request/response action pairs with same key.', () => {
    const action = reqres('key');
    const request = action.request();
    const response = action.response();

    expect(request.key).to.equal(response.key);
  });

  it('should create request/response action pairs with same lock.', () => {
    const action = reqres('key');
    const request = action.request();
    const response = action.response();

    expect(request.lock).to.equal(response.lock);
  });

  it('should create a new lock for each request/response action creator pair.', () => {
    const first = reqres('key');
    const second = reqres('key');

    expect(first.request().lock).to.not.equal(second.request().lock);
  });
});
