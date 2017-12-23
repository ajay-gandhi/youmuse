import "components/scss/IndexPage.scss";

import React from "react";
import SearchBar from "components/SearchBar";

const IndexPage = () => (
  <div className="IndexPage">
    <h1 className="IndexPage__heading">YouMuse</h1>
    <div className="IndexPage__content">
      <SearchBar className="IndexPage__content__SearchBar" />
      <h3 className="IndexPage__content__subtitle">Listen to YouTube, ad-free</h3>
    </div>
  </div>
);

export default IndexPage;
