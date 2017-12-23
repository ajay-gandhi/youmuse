import "components/scss/Chevron.scss";

import React from "react";
import PropTypes from "prop-types";
import Icon from "components/Icon";

const Chevron = props => (
  <div className={ `Chevron ${props.className || ""}` }>
    <Icon glyph={ props.up ? "keyboard_arrow_up" : "keyboard_arrow_down" } key="chevron 1" />
    <Icon glyph={ props.up ? "keyboard_arrow_up" : "keyboard_arrow_down" } key="chevron 2" />
  </div>
);
Chevron.propTypes = {
  className: PropTypes.string,
  up: PropTypes.bool,
};
Chevron.defaultProps = {
  up: false,
};

export default Chevron;
