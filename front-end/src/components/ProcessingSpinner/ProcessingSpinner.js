import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';

const ProcessingSpinner = ({ spinnerDark }) => {
  const color = spinnerDark ? '#1465C0' : '#ECEFF1';
  return (
    <CircularProgress
      variant="indeterminate"
      disableShrink
      sx={{
        color,
        animationDuration: '550ms',
        marginLeft: 1,
      }}
      size={17}
      thickness={4}
    />
  );
};

export default ProcessingSpinner;

ProcessingSpinner.propTypes = {
  spinnerDark: PropTypes.bool,
};

ProcessingSpinner.defaultProps = {
  spinnerDark: false,
};
