import { createStore } from "redux";

const setSearchQuery = (searchQuery) => {
  return {
    type: "SET_SEARCH",
    searchQuery,
  };
};
const actions = {
  setSearchQuery,
};

const initialiState = {
  searchQuery: "",
};

const reducer = (state = initialiState, action) => {
  switch (action.type) {
    case "SET_SEARCH":
      return Object.assign({}, state, {
        searchQuery: action.searchQuery,
      });

    default:
      return state;
  }
};

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export {
  store,
  actions
};
