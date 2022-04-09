import { createStore, applyMiddleware } from "redux";
import reducers from "./ReducersIndex";
import thunk from "redux-thunk";
import LogRocket from "logrocket";

export const store = createStore(
    reducers,
    {},
    applyMiddleware(LogRocket.reduxMiddleware(), thunk)
)