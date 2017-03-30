import * as actions from './actions';

/**
 * Middleware entry point.
 *
 * @param {object} store
 * @returns {function}
 */
export default (store) => {
  const locks = {};

  return next => (action) => {
    let result = null;

    switch (action.type) {
      case actions.REQUEST:
        if (locks[action.key] !== action.lock) {
          locks[action.key] = action.lock;
          result = store.dispatch(action.action);
        }
        break;
      case actions.RESPONSE:
        if (locks[action.key] === action.lock) {
          locks[action.key] = -1;
          result = store.dispatch(action.action);
        }
        break;
      default:
        result = next(action);
    }

    return result;
  };
};
