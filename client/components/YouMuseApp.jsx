import React from "react";
import { Provider } from "react-redux";

import { store } from "./Store";

import SearchBar from "./Searchbar";

export default class YouMuseApp extends React.Component {
  render = () => {
    return (
      <Provider store={ store }>
        <SearchBar />
      </Provider>
    );
  }
}
