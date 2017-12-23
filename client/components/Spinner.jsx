import "./scss/Spinner.scss";
import React from "react";
import PropTypes from "prop-types";

const Spinner = props => (
  <div className={ `Spinner ${props.className || ""}` }>
    <div class="Spinner__dot Spinner__dot--first"></div>
    <div class="Spinner__dot Spinner__dot--second"></div>
    <div class="Spinner__dot Spinner__dot--third"></div>
  </div>
);
Spinner.propTypes = {
  className: PropTypes.string,
};

export default Spinner;
