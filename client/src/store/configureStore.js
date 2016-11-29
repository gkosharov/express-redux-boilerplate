import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux-immutable'
import { createHistory, useBeforeUnload } from 'history'
import { Router, browserHistory, useRouterHistory } from 'react-router'
import thunkMiddleware from 'redux-thunk'
import { apiMiddleware } from 'redux-api-middleware'
import * as reducers from '../reducers'
import routerMiddleware from '../middleware/RouterMiddleware'
import combineActionsMiddleware from 'redux-combine-actions';

import { ROOT_PATH } from '../web.config.js'

var history = null;

const reducer = combineReducers(
    reducers
);

var appHistory = useRouterHistory(useBeforeUnload(createHistory))({basename: ROOT_PATH});

const historyMiddleware = routerMiddleware(getHistory);

const createStoreWithMiddleware = applyMiddleware(
    combineActionsMiddleware,
    historyMiddleware,
    thunkMiddleware,
    apiMiddleware
    //loggerMiddleware
)(createStore);



function getHistory() {
    return appHistory;
}

export function configureStore(initialState) {

    const store = createStoreWithMiddleware(reducer, initialState, window.devToolsExtension ? window.devToolsExtension() : f => f);

    return {
        store: store,
        history: getHistory()
    };
}
