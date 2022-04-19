import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Typography from 'components/Typography/Typography';
import { Avatar } from '@mui/material';
import responsive from 'theme/responsive';
import Cookie from 'js-cookie';

const ChatMessage = ({ text, userName, date, self, userPhoto, senderId }) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <Message self={self} variant="body1" as="div" fontSize={14}>
      <UserData>
        <UserAvatar
          alt="User"
          src={`http://127.0.0.1:8000/images/avatars/${userPhoto}`}
        />
        <Typography fontSize={12} fontWeight={700}>
          {userName}, {date}{' '}
          {user?.role === 'user' || !Cookie.get('token') ? '' : `(${senderId})`}
        </Typography>
      </UserData>
      <Typography>{text}</Typography>
    </Message>
  );
};

export default ChatMessage;

const Message = styled(Typography)`
  && {
    background-color: ${({ theme }) => theme.secondaryLight};
    width: 70%;
    font-size: ${({ theme }) => theme.fontSize.xs};
    margin: ${({ self }) =>
      self ? '1.2rem 1rem 1.2rem auto' : '1.2rem 3rem 1.2rem 1rem'};
    padding: 0.6rem 1.2rem;
    border-radius: 5px;
    -webkit-box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.17);
    -moz-box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.17);
    box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.17);

    @media ${responsive.tablet} {
      padding: 0.8rem 2rem;
      margin: ${({ self }) =>
        self ? '1.3rem 1.5rem 1.3rem auto' : '1.3rem auto 1.3rem 1.5rem'};
      font-size: ${({ theme }) => theme.fontSize.s};
    }
  }
`;

const UserData = styled.div`
  display: flex;
  align-items: center;
  margin-left: -15px;
  margin-bottom: 1rem;
`;

const UserAvatar = styled(Avatar)`
  margin-right: 0.6rem;
`;

ChatMessage.propTypes = {
  userName: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  self: PropTypes.bool,
  userPhoto: PropTypes.string.isRequired,
  senderId: PropTypes.number,
};
