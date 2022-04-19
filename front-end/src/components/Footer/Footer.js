import React from 'react';
import PropTypes from 'prop-types';
import { lighten } from '@mui/material';
import Typography from 'components/Typography/Typography';
import styled from 'styled-components';

const Footer = ({ display }) => {
  if (!display) return '';

  return (
    <Wrapper>
      <Typography color="#fff" fontWeight={700} align="center">
        Wszelkie prawa zastrzeżone &copy; Kamil Noga
      </Typography>
    </Wrapper>
  );
};

export default Footer;

const Wrapper = styled.footer`
  background: ${({ theme }) => lighten(theme.darkBlue, 0.15)};
  height: ${({ theme }) => theme.footerHeight};
  display: flex;
  align-items: center;
  justify-content: center;
`;

Footer.propTypes = {
  display: PropTypes.bool,
};

Footer.defaultProps = {
  display: true,
};
