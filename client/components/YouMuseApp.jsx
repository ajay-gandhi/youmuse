import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";

import { store } from "./Store";

// import ConnectedSearchBar from "./Searchbar";
import IndexPage from "./IndexPage";

export default class YouMuseApp extends React.Component {
  render = () => {
    return (
      <Provider store={ store }>
        <BrowserRouter>
          <Route path="/" component={ IndexPage } />
        </BrowserRouter>
      </Provider>
    );
  }
}
