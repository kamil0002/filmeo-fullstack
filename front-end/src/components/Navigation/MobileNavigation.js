import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import routes from 'routes';
import Cookies from 'js-cookie';
import NavItem from './NavItem';

const MobileNavigation = ({ children, visible }) => {
  const location = useLocation();

  return (
    <>
      <Wrapper visible={visible}>
        {children}
        <MobileNavList userLoggedIn={Cookies.get('token') ? true : false}>
          <NavItem
            as={Link}
            to={routes.home}
            active={location.pathname === routes.home ? '1' : ''}
          >
            Strona główna
          </NavItem>
          <NavItem
            to={routes.movies}
            as={Link}
            active={location.pathname === routes.movies ? '1' : ''}
          >
            Filmy
          </NavItem>
        </MobileNavList>
      </Wrapper>
    </>
  );
};

export default MobileNavigation;

const Wrapper = styled.nav`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 75vw;
  height: 100vh;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  background: linear-gradient(
    116.82deg,
    rgba(236, 239, 241, 0.99) 0%,
    rgba(246, 248, 250, 0.97) 100%
  );

  transition: all 500ms ease-out;
  transform: ${({ visible }) =>
    visible ? 'translateX(0)' : 'translateX(100%)'};
`;

const MobileNavList = styled.ul`
  width: 70%;
  border-top: 1px solid
    ${({ theme, userLoggedIn }) =>
      userLoggedIn ? 'transparent' : theme.darkGray};
  margin-top: 2rem;
  padding: 2rem 0;
  text-align: center;
`;

MobileNavigation.propTypes = {
  children: PropTypes.any,
  visible: PropTypes.bool.isRequired,
};
