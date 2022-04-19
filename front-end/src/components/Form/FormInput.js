import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormControl, TextField } from '@mui/material';
import responsive from 'theme/responsive';

const FormInput = ({
  id,
  label,
  type,
  isValid,
  helperText,
  validator,
  settings,
  ...props
}) => {
  return (
    <FormControl required={true} margin="normal">
      <StyledTextField
        autoComplete="new-password"
        settings={settings}
        {...props}
        error={isValid}
        {...validator}
        id={id}
        label={label}
        type={type}
        variant="standard"
        helperText={isValid ? helperText : ''}
        inputProps={{
          autoComplete: 'new-password',
        }}
      />
    </FormControl>
  );
};

export default FormInput;

const StyledTextField = styled(TextField)`
  && {
    @media ${responsive.tablet} {
      width: 350px;
    }

    @media ${responsive.laptop} {
      width: ${({ settings }) => settings && `425px`};
    }

    @media ${responsive.desktop} {
      width: ${({ settings }) => settings && `600px`};
    }
  }
`;

FormInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  validator: PropTypes.any,
  isValid: PropTypes.bool,
  helperText: PropTypes.string.isRequired,
  settings: PropTypes.string,
};

FormInput.defaultProps = {
  type: 'text',
  settings: '',
};
