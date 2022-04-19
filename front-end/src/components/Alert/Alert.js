import React from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import { Alert as AlertComponent } from '@mui/material';

const Alert = ({ type, children, videoError }) => {
  return (
    <StyledAlert videoError={videoError} variant="filled" severity={type}>
      {children}
    </StyledAlert>
  );
};

export default Alert;

const showAlert = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const StyledAlert = styled(AlertComponent)`
  && {
    z-index: 10000;
    width: 80vmin;
    position: fixed;
    top: ${({ videoError }) => (videoError ? 0 : '76px')};
    left: 50%;
    transform: translateX(-50%);
    animation: ${showAlert} 500ms ease-out;
    border-radius: 0 0 5px 5px;
  }
`;

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error']),
  videoError: PropTypes.string,
  children: PropTypes.string.isRequired,
};

Alert.defaultProps = {
  type: 'error',
  videoError: '',
};
