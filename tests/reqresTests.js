import { expect } from 'chai';
import * as reqres from '../source/reqres';
import action from '../source/action';
import middleware from '../source/middleware';

describe('reqres', () => {
  it('should expose middleware', () => {
    expect(reqres.middleware).to.equal(middleware);
  });

  it('should expose action.', () => {
    expect(reqres.reqres).to.equal(action);
  });
});
