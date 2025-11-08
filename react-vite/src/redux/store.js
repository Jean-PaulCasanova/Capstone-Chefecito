import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import recipesReducer from './recipes';
import groceryListReducer from "./groceryList";
import socialsReducer from "./socials";
import commentsReducer from "./comments";

const rootReducer = combineReducers({
  session: sessionReducer,
  recipes: recipesReducer,
  groceryList: groceryListReducer,
  socials: socialsReducer,
  comments: commentsReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
