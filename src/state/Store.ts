import { createStore, applyMiddleware } from "redux";
import reducers from "./ReducersIndex";
import thunk from "redux-thunk";
import logger from "redux-logger";

export const store = createStore(
    reducers,
    {},
    applyMiddleware(thunk, logger)
)