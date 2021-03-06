import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import settings from "./settings/reducers";
// import reducers from "./reducers";

const createRootReducer = (history) =>
  combineReducers({
    // ...reducers,
    settings, // persisted
    router: connectRouter(history),
  });

export default createRootReducer;
