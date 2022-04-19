import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Button from '@mui/material/Button';
import MobileNavigation from './MobileNavigation';
import responsive from 'theme/responsive';
import DesktopNavigation from './DesktopNavigation';
import Typography from 'components/Typography/Typography';
import axios from 'utils/axios';
import Cookies from 'js-cookie';
import Alert from 'components/Alert/Alert';
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { Box } from '@mui/system';
import Tooltip from '@mui/material/Tooltip';
import { setUser } from 'slices/authSlice';
import routes from 'routes';

const Navigation = ({ display }) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [navVisible, setNavVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post('/api/v1/logout');
      Cookies.remove('token', { path: '' });
      setSuccessMessage('Pomyślnie wylogowano.');
      setTimeout(() => {
        setSuccessMessage(null);
        dispatch(setUser({}));
        navigate(routes.home);
        location.reload();
      }, 1500);
    } catch (err) {
      console.log(err);
    }
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!display) return '';

  return (
    <Wrapper>
      {successMessage && <Alert type="success">{successMessage}</Alert>}
      <Brand>
        <BrandImage src="/images/brand.svg" />
        <Title
          variant="h5"
          fontWeight="bold"
          component="h2"
          marginLeft="1.2rem"
        >
          Filmeo
        </Title>
      </Brand>
      <Actions>
        <DesktopNavigation>
          {!Cookies.get('token') ? (
            <>
              <StyledButton
                variant="contained"
                classes={{ root: 'root' }}
                color="primary"
                spacing="true"
                LinkComponent={Link}
                to={routes.login}
              >
                Logowanie
              </StyledButton>
              <StyledButton
                variant="contained"
                classes={{ root: 'root' }}
                color="primary"
                spacing="true"
                LinkComponent={Link}
                to={routes.register}
              >
                Rejestracja
              </StyledButton>
            </>
          ) : (
            ''
          )}
        </DesktopNavigation>
        {Cookies.get('token') ? (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Tooltip title="Zarządzaj swoim profilem">
                <IconButton
                  onClick={handleClick}
                  size="medium"
                  sx={{ ml: 2, mr: 2 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar
                    src={`http://127.0.0.1:8000/images/avatars/${user?.avatar}`}
                    sx={{ width: 40, height: 40 }}
                  ></Avatar>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              disableScrollLock={true}
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 2,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 23,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Link
                style={{ textDecoration: 'none', color: '#040714' }}
                to={routes.dashboard}
              >
                <MenuItem>
                  <Avatar />
                  Konto
                </MenuItem>
              </Link>
              <Divider />
              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Wyloguj
              </MenuItem>
            </Menu>
          </>
        ) : (
          ''
        )}

        <HamburgerMenu
          classes={{ root: 'root' }}
          onClick={() => setNavVisible(!navVisible)}
        />
      </Actions>
      <MobileNavigation visible={navVisible}>
        {!Cookies.get('token') ? (
          <>
            <StyledButton
              variant="contained"
              classes={{ root: 'root' }}
              color="primary"
              LinkComponent={Link}
              to="/logowanie"
            >
              Logowanie
            </StyledButton>
            <StyledButton
              variant="contained"
              classes={{ root: 'root' }}
              color="primary"
              LinkComponent={Link}
              to="/rejestracja"
            >
              Rejestracja
            </StyledButton>
          </>
        ) : (
          ''
        )}
      </MobileNavigation>
    </Wrapper>
  );
};

export default Navigation;

const Wrapper = styled.div`
  background: linear-gradient(
    116.82deg,
    rgba(236, 239, 241, 0.85) 0%,
    rgba(246, 248, 250, 0.8) 100%
  );

  padding: 0 0.4rem 0 0.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.lightGray};
  position: fixed;
  right: 0;
  left: 0;
  z-index: 200;
  height: ${({ theme }) => theme.navHeight};

  @media ${responsive.laptop} {
    padding: 0 2rem 0 2rem;
  }
`;

const Brand = styled.div`
  font-size: ${({ theme }) => theme.fontSize.lg};
  display: flex;
  align-items: center;

  @media ${responsive.laptop} {
    font-size: ${({ theme }) => theme.fontSize.xl};
  }
`;

const BrandImage = styled.img``;

const Title = styled(Typography)`
  && {
    font-family: 'Lobster', cursive;
    color: ${({ theme }) => theme.primaryBlue};
    letter-spacing: 3px;
    font-size: ${({ theme }) => theme.fontSize.m};

    @media ${responsive.laptop} {
      font-size: ${({ theme }) => theme.fontSize.xl};
    }
  }
`;

const Actions = styled.div`
  z-index: 5;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HamburgerMenu = styled(MenuRoundedIcon)`
  &.root {
    font-size: ${({ theme }) => theme.fontSize.xl};
    cursor: pointer;

    @media ${responsive.tablet} {
      display: none;
    }
  }
`;

const StyledButton = styled(Button)`
  &.root {
    font-family: inherit;
    width: 140px;
    height: 35px;
    font-size: ${({ theme }) => theme.fontSize.s};
    margin: 1rem 0;

    ${({ spacing }) =>
      spacing &&
      css`
        margin: 0.5rem;

        @media ${responsive.laptop} {
          margin: 0 1rem;
        }
      `}
  }
`;

Navigation.propTypes = {
  display: PropTypes.bool,
};

Navigation.defaultProps = {
  display: true,
};
