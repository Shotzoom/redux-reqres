Redux Reqres
============

Request response synchronization middleware. Syncronization should be used when multiple async actions may be dispatched to fetch data, but only the last response should be serviced such as type aheads and search filtering.

## Installation

```bash
npm install @shotzoom/redux-reqres --save
```

## Usage

To use, simply apply the middleware to your redux store and then dispatch the created `request/response` action creators.

```js
import { createStore, applyMiddleware } from 'redux';
import { middlware } from '@shotzoom/redux-reqres';
import reducer from './reducer';

const store = createStore(
  reducer,
  applyMiddleware(middlware)
);
```

After the middleware has been applied, use the `reqres` action creators to dispatch syncronized `request/response` action pairs.

```js
import { reqres } from '@shotzoom/redux-reqres';

const query = (term) => {
  const { request, response } = reqres('api/find');

  return (dispatch) => {
    dispatch(request({ type: 'FIND' }));
    fetch(`api/find?query=${term}`)
      .then((r) => r.json())
      .then((json) => {
        dispatch(response({ type: 'FIND_RECEIVE', results: json.results }));
      });
  };
};

store.dispatch(query('1'));
store.dispatch(query('2'));
store.dispatch(query('3'));
store.dispatch(query('4')); // only service this response.
```

The `request` and `response` action creators will wrap any action that is passed in and will only service the inner action when they meet the following criteria.
1. Has not yet been dispatched.
2. The request has not be invalidated by another request with the same key.

```js
const first = reqres('some key unique to the action creator');
const second = reqres('some key unique to the action creator');

store.dispatch(first.request({ type: 'FIND' });
store.dispatch(first.request({ type: 'FIND' }); // will not service inner action again.
store.dispatch(second.request({ type: 'FIND' }); // will invalidate first request.
store.dispatch(first.response({ type: 'FIND_RECEIVE' })); // will not be serviced.
store.dispatch(second.response({ type: 'FIND_RECEIVE' })); // will be serviced.
store.dispatch(second.response({ type: 'FIND_RECEIVE' })); // has already been serviced.
```
