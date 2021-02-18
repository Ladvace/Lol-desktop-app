import { createStore, applyMiddleware, compose } from "redux";
import { createHashHistory } from "history";
import { persistReducer, persistStore } from "redux-persist";
import { routerMiddleware } from "connected-react-router";
import thunk from "./thunkEnhancer";
import createRootReducer from "../reducers";
// import middlewareApp from "../utils/middlewareApp";
import persistConfig from "./persistConfig";

const history = createHashHistory();
const rootReducer = createRootReducer(history);

const persistedReducer = persistReducer(persistConfig, rootReducer);

console.log("TEST1", persistConfig);

const router = routerMiddleware(history);
const enhancer = compose(applyMiddleware(thunk, router));

function configureStore() {
  const store = createStore(persistedReducer, enhancer);
  const persistor = persistStore(store);
  return { store, persistor };
}

export { configureStore, history };
