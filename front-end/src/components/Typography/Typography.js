import React from 'react';
import PropTypes from 'prop-types';
import { Typography as MuiTypography } from '@mui/material';

const Typography = ({ children, ...props }) => {
  return (
    <MuiTypography
      {...props}
      color={props['color'] || '#040714'}
      fontFamily="Poppins"
    >
      {children}
    </MuiTypography>
  );
};

export default Typography;

Typography.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};
