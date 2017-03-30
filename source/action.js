import * as actions from './actions';
import uid from './uid';

/**
 * Creates a new sequential request reponse pair.
 *
 * @param {string} key
 * @returns {{ request:function(object), repsonse:function(object) }}
 */
export default (key) => {
  const lock = uid();

  /**
   * Creates a new request action that will only accept a response from its matching response
   * action. Newer requests will invalidate other requests with the same key to insure only the
   * last request is serviced by the response action.
   *
   * @param {*} action
   * @returns {object}
   */
  const request = action => ({ type: actions.REQUEST, key, lock, action });

  /**
   * Creates a response action that will be serviced only if the request action has not been
   * invalidated.
   *
   * @param {*} action
   * @returns {object}
   */
  const response = action => ({ type: actions.RESPONSE, key, lock, action });

  return { request, response };
};
