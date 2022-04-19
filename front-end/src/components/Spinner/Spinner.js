import React from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@mui/material';

const SpinnerComponent = () => {
  return <Spinner />;
};

export default SpinnerComponent;

const Spinner = styled(CircularProgress)`
  && {
    display: block;
    margin: 150px auto 50px auto;
  }
`;
