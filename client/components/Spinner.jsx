import "components/scss/Spinner.scss";
import React from "react";

const Spinner = () => (
  <div className="Spinner">
    <div className="Spinner__dot Spinner__dot--first"></div>
    <div className="Spinner__dot Spinner__dot--second"></div>
    <div className="Spinner__dot Spinner__dot--third"></div>
  </div>
);

export default Spinner;
