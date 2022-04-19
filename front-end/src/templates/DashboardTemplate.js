import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import Alert from 'components/Alert/Alert';
import { Paper, Typography } from '@mui/material';
import responsive from 'theme/responsive';
import { PhotoCamera } from '@mui/icons-material';
import axios from 'utils/axios';
import { setUserPhoto } from 'slices/authSlice';
import clearAsyncMessages from 'utils/clearAsyncMessages';

const DashboardTemplate = ({ children, handleViewChange, currentView }) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errMessage, setErrMessage] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const imageChangeHandler = async (e) => {
    try {
      const formData = new FormData();
      formData.append('avatar', e.target.files[0]);
      const res = await axios.post('/api/v1/uploadAvatar', formData);
      if (res.data.status !== 'success') {
        throw new Error(res.data.message);
      }
      dispatch(setUserPhoto(res.data.data[0]));
      setSuccessMessage('Zdjęcie zostało zmienione.');
    } catch (err) {
      setErrMessage(err.message);
    } finally {
      clearAsyncMessages(setSuccessMessage, setErrMessage);
    }
  };

  return (
    <Wrapper>
      {errMessage && <Alert>{errMessage}</Alert>}
      {successMessage && <Alert type="success">{successMessage}</Alert>}
      <StyledPaper>
        <Sidebar>
          <User>
            <ChangeAvatarInput
              onChange={imageChangeHandler}
              type="file"
              id="file-input"
            />
            <AvatarWrapper htmlFor="file-input">
              <ChangePhotoIcon />
              <Avatar
                src={`http://127.0.0.1:8000/images/avatars/${user?.avatar}`}
                alt="user"
              />
            </AvatarWrapper>
            <UserName marginTop={2} fontFamily="Poppins" fontWeight={500}>
              {user.name} {user.surname}
            </UserName>
          </User>
          <Navigation>
            <NavigationList>
              {user.role !== 'administrator' && (
                <>
                  <NavigationItem
                    currentView={currentView === 'movies'}
                    onClick={() => handleViewChange('movies')}
                  >
                    <img src=".././images/nav-movie.svg" />
                    <span>Filmy</span>
                  </NavigationItem>
                  <NavigationItem
                    currentView={currentView === 'reviews'}
                    onClick={() => handleViewChange('reviews')}
                  >
                    <img src=".././images/nav-reviews.svg" />
                    <span>Oceny</span>
                  </NavigationItem>
                  <NavigationItem
                    currentView={currentView === 'stats'}
                    onClick={() => handleViewChange('stats')}
                  >
                    <img src=".././images/nav-stats.svg" />
                    <span>Wydatki</span>
                  </NavigationItem>
                </>
              )}
              <NavigationItem
                currentView={currentView === 'settings'}
                onClick={() => handleViewChange('settings')}
              >
                <img src=".././images/nav-settings.svg" />
                <span>Ustawienia</span>
              </NavigationItem>
              {user.role === 'moderator' ||
                (user.role === 'administrator' && (
                  <NavigationItem
                    currentView={currentView === 'admin'}
                    onClick={() => handleViewChange('admin')}
                  >
                    <img src=".././images/nav-admin.svg" />
                    <span>Panel Admina</span>
                  </NavigationItem>
                ))}
            </NavigationList>
          </Navigation>
        </Sidebar>
        <Content>{children}</Content>
      </StyledPaper>
    </Wrapper>
  );
};

export default DashboardTemplate;

const Wrapper = styled.div`
  min-height: calc(100vh - 76px - 70px);
`;

const StyledPaper = styled(Paper)`
  && {
    width: 95%;
    margin: 5rem auto;
    min-height: 1000px;
    border-radius: 15px;
    background: #ffffff;
    box-shadow: 2px 4px 30px rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;

    @media ${responsive.laptop} {
      width: 80%;
    }

    @media ${responsive.desktop} {
      width: 75%;
    }
  }
`;

const Sidebar = styled.div`
  width: 80px;
  margin-left: -20px;
  min-height: 100%;
  background: ${({ theme }) => theme.primaryLight};
  border-radius: 15px 0 0 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  @media ${responsive.mobile} {
    width: 100px;
    margin-left: 0;
  }

  @media ${responsive.tablet} {
    width: 200px;
  }
`;

const User = styled.div`
  width: inherit;
  height: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const AvatarWrapper = styled.label`
  width: 40px;
  height: 40px;
  z-index: 100;
  position: relative;

  :hover {
    cursor: pointer;

    svg {
      opacity: 0.95;
    }
  }

  @media ${responsive.mobile} {
    width: 60px;
    height: 60px;
  }

  @media ${responsive.mobile} {
    width: 55px;
    height: 55px;
  }

  @media ${responsive.tablet} {
    width: 96px;
    height: 96px;
  }
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  filter: drop-shadow(2px 4px 30px rgba(0, 0, 0, 0.25));
  object-fit: cover;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const ChangePhotoIcon = styled(PhotoCamera)`
  && {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 101;
    font-size: 20px;
    color: ${({ theme }) => theme.secondaryLight};
    opacity: 0;
    transition: opacity 250ms ease;

    @media ${responsive.mobile} {
      font-size: 25px;
    }

    @media ${responsive.tablet} {
      font-size: 35px;
    }
  }
`;

const ChangeAvatarInput = styled.input`
  display: none;
`;

const UserName = styled(Typography)`
  && {
    width: inherit;
    font-size: 0.6rem;
    text-align: center;
    word-wrap: break-word;
    padding: 0 0.7rem;

    @media ${responsive.tablet} {
      font-size: ${({ theme }) => theme.fontSize.s};
    }
  }
`;

const Navigation = styled.nav`
  height: 80%;
`;

const NavigationList = styled.ul`
  list-style: none;
  margin-top: 5rem;
`;
const NavigationItem = styled.li`
  display: flex;
  padding: 1rem 0;
  align-items: center;
  justify-content: flex-start;
  text-decoration: none;
  color: ${({ theme }) => theme.darkBlue};

  span {
    display: none;
  }

  @media ${responsive.tablet} {
    span {
      display: block;
      margin-left: 0.5rem;
    }
  }

  &::before {
    content: '';
    left: 0;
    right: 0;
    width: 80px;
    position: absolute;
    height: 64px;
    transition: all 250ms ease-out;
    cursor: pointer;
    border-right: 3px solid transparent;
    border-right: ${({ currentView }) => currentView && '3px solid #85B6FF'};

    @media ${responsive.mobile} {
      width: 100px;
    }

    @media ${responsive.tablet} {
      width: 200px;
    }
  }

  &:hover {
    &::before {
      background: rgb(0 0 0 / 20%);
    }
  }
`;

const Content = styled.div`
  padding: 2rem 1rem 2rem 1.2rem;
  width: calc(100% - 100px);

  @media ${responsive.tablet} {
    width: calc(100% - 200px);
  }
`;

DashboardTemplate.propTypes = {
  children: PropTypes.node.isRequired,
  handleViewChange: PropTypes.func.isRequired,
  currentView: PropTypes.string.isRequired,
};
