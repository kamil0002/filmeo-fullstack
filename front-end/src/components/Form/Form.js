import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import ProcessingSpinner from 'components/ProcessingSpinner/ProcessingSpinner';

const Form = ({
  submitFn,
  children,
  buttonText,
  buttonType,
  processing,
  spinnerDark,
}) => {
  return (
    <StyledForm onSubmit={submitFn}>
      {children}
      <StyledButton type="submit" variant={buttonType}>
        {buttonText}{' '}
        {processing && <ProcessingSpinner spinnerDark={spinnerDark} />}
      </StyledButton>
    </StyledForm>
  );
};

export default Form;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const StyledButton = styled(Button)`
  && {
    align-self: baseline;
    margin-top: 1.5rem;
    font-family: inherit;
  }
`;

Form.propTypes = {
  submitFn: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonType: PropTypes.string,
  processing: PropTypes.bool,
  spinnerDark: PropTypes.bool,
};

Form.defaultProps = {
  buttonType: 'contained',
  spinnerDark: false,
};
