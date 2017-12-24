import React from "react";
import PropTypes from "prop-types";

const Icon = props => <i className={ `material-icons ${props.className}` }>{ props.glyph }</i>;
Icon.propTypes = {
  className: PropTypes.string,
  glyph: PropTypes.string.isRequired,
};
Icon.defaultProps = {
  className: "",
};

export default Icon;
