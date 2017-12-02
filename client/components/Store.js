import { createStore } from "redux";

const REPEAT_STATE = Object.freeze({
  off: 0,
  all: 1,
  one: 2,
});

const initialState = {
  searchQuery: "",
  repeat: REPEAT_STATE.off,
  shuffle: false,
  rawList: [],
  queue: [],
};

/** Actions **/
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

const mergeState = (newState) => {
  return {
    type: "MERGE_STATE",
    newState,
  };
};
const actions = {
  setSearchQuery,
  toggleRepeat,
  toggleShuffle,
  mergeState,
};

/** Reducers **/
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SEARCH":
      return {
        ...state,
        searchQuery: action.searchQuery,
      };

    case "TOGGLE_REPEAT": {
      let repeat = state.repeat === REPEAT_STATE.off
        ? REPEAT_STATE.all
        : (state.repeat === REPEAT_STATE.all ? REPEAT_STATE.one : REPEAT_STATE.off);
      return {
        ...state,
        repeat,
      };
    }

    case "TOGGLE_SHUFFLE":
      return {
        ...state,
        shuffle: !state.shuffle
      };

    case "MERGE_STATE":
      return {
        ...state,
        ...action.newState,
      };

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
