import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavItem = ({ to, active, children, desktop }) => {
  return (
    <ListItem desktop={desktop} as={Link} active={active} to={to}>
      {children}
    </ListItem>
  );
};

export default NavItem;

const ListItem = styled.li`
  display: block;
  text-decoration: none;
  margin: ${({ desktop }) => (desktop ? '0 0.5rem' : '1rem 0')};
  list-style: none;
  cursor: pointer;
  color: ${({ theme, active }) =>
    active ? theme.primaryLight : theme.darkBlue};
  padding: ${({ desktop }) => (desktop ? '0.4rem 1.35rem' : '1rem 0')};
  border-radius: 50px;
  transition: background 250ms ease-out;
  background: ${({ theme, active }) =>
    active ? theme.primaryBlue : ' transparent'};

  a {
    text-decoration: none;
    color: ${({ theme, active }) =>
      active ? theme.primaryLight : theme.darkBlue};
  }

  &:hover {
    background-color: ${({ theme }) => theme.primaryBlue};
    opacity: 0.45;
    color: ${({ theme }) => theme.primaryLight};
  }
`;

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  active: PropTypes.string,
  desktop: PropTypes.string,
};

NavItem.defaultProps = {
  desktop: '',
};
