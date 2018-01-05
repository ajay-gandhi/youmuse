import "components/scss/IndexPage.scss";

import React from "react";
import SearchBar from "components/SearchBar";

export default () => (
  <div className="IndexPage">
    <h1 className="IndexPage__heading">YouMuse</h1>
    <div className="IndexPage__content">
      <SearchBar className="IndexPage__content__SearchBar" />
      <h3 className="IndexPage__content__subtitle">
        Listen to YouTube, ad-free
        <a href="/about" className="IndexPage__content__subtitle__about">?</a>
      </h3>
    </div>
  </div>
);
