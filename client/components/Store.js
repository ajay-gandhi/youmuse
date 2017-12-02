import { createStore } from "redux";

const REPEAT_STATE = Object.freeze({
  off: 0,
  all: 1,
  one: 2,
});

const initialiState = {
  searchQuery: "",
  repeat: REPEAT_STATE.off,
  shuffle: false,
  rawList: [],
  queue: [],
};

const setSearchQuery = (searchQuery) => {
  return {
    type: "SET_SEARCH",
    searchQuery,
  };
};
const toggleRepeat = () => {
  return { type: "TOGGLE_REPEAT" };
};
const toggleShuffle = () => {
  return { type: "TOGGLE_SHUFFLE" };
};
const actions = {
  setSearchQuery,
  toggleRepeat,
  toggleShuffle,
};

const reducer = (state = initialiState, action) => {
  switch (action.type) {
    case "SET_SEARCH":
      return Object.assign({}, state, {
        searchQuery: action.searchQuery,
      });

    case "TOGGLE_REPEAT": {
      let repeat = state.repeat === REPEAT_STATE.off
        ? REPEAT_STATE.all
        : (state.repeat === REPEAT_STATE.all ? REPEAT_STATE.one : REPEAT_STATE.off);
      return Object.assign({}, state, { repeat });
    }

    case "TOGGLE_SHUFFLE":
      return Object.assign({}, state, { shuffle: !state.shuffle });

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
  actions,
  REPEAT_STATE,
};
