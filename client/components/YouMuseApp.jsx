import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { actions, store } from "./Store";

import IndexPage from "./IndexPage";
import SearchPage from "./SearchPage";

const withMatchInState = (Component) => {
  return (props) => {
    store.dispatch(actions.mergeState(props.match.params));
    return <Component />;
  };
};

export default class YouMuseAppContainer extends React.Component {
  render = () => {
    return (
      <Provider store={ store }>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={ IndexPage } />
            <Route path="/search/:searchQuery?" exact component={ withMatchInState(SearchPage) } />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}
