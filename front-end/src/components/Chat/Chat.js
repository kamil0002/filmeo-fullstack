import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Pusher from 'pusher-js';
import { darken, Paper, TextField } from '@mui/material';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import ChatIcon from '@mui/icons-material/Chat';
import FormControl from '@mui/material/FormControl';
import Typography from 'components/Typography/Typography';
import Alert from 'components/Alert/Alert';
import responsive from 'theme/responsive';
import ChatMessage from './ChatMessage';
import axios from 'utils/axios';
import clearAsyncMessages from 'utils/clearAsyncMessages';

const Chat = ({ id }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errMessage, setErrMessage] = useState(null);

  const user = useSelector((state) => state.auth.user);

  useEffect(async () => {
    //* Get already sent messages from last 12hrs from database
    try {
      const {
        data: {
          data: [messages],
        },
      } = await axios.get('/api/v1/getMessages');

      if (!messages) return;
      const formattedMessages = messages.map((msg) => ({
        senderId: msg.user_id,
        senderName: msg.user.name,
        senderAvatar: msg.user.avatar,
        date: {
          date: msg.created_at,
        },
        message: msg.message,
      }));

      setMessages(formattedMessages);
      const messagesContainer = document.querySelector('.messages-container');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  useEffect(() => {
    //* Configure Pusher
    Pusher.logToConsole = false;

    const pusher = new Pusher('8fb8f8eb332cab7a0878', {
      cluster: 'eu',
    });

    const channel = pusher.subscribe('chat');
    channel.bind('message', function (data) {
      if (data.message.startsWith('/')) return;
      setMessages((prevState) => [...prevState, data]);

      const messagesContainer = document.querySelector('.messages-container');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      if (message.startsWith('/')) {
        const command = message.slice(1);
        if (
          !command.startsWith('mute') &&
          !command.startsWith('unmute') &&
          user.role !== 'user'
        ) {
          setErrMessage(
            'Ta komenda nie jest dostępna, wykonaj /mute {ID} lub /unmute {ID}'
          );
          setMessage('');
          return;
        }

        //* Mute user
        if (command.startsWith('mute')) {
          const res = await axios.put('api/v1/admin/mute', {
            userId: +command.split(' ')[1],
          });
          if (res.data.status !== 'success') {
            throw new Error(res.data.message);
          }
          setSuccessMessage(res.data.message);
          setMessage('');
        }

        //* Unmute user
        if (command.startsWith('unmute')) {
          const res = await axios.put('api/v1/admin/unmute', {
            userId: +command.split(' ')[1],
          });
          if (res.data.status !== 'success' || res.data.statusCode === 500) {
            throw new Error(res.data.message);
          }

          setSuccessMessage(res.data.message);
          setMessage('');
        }

        setMessage('');
        return;
      }

      const res = await axios.post(
        '/api/v1/message',
        JSON.stringify({
          message,
        })
      );
      //* Inform user that he is muted
      if (res.data.status !== 'success') {
        throw new Error(res.data.message);
      }
    } catch (err) {
      if (err.message.includes('401')) {
        setErrMessage('Aby pisać na chacie musisz być zalogowany!');
      } else setErrMessage(err.message);
    } finally {
      clearAsyncMessages(setSuccessMessage, setErrMessage);
    }

    e.target.parentNode.previousSibling.scrollTo(
      0,
      e.target.parentNode.previousSibling.scrollHeight
    );

    setMessage('');

    const messagesContainer = document.querySelector('.messages-container');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  return (
    <Wrapper id={id}>
      {errMessage && <StyledAlert>{errMessage}</StyledAlert>}
      {successMessage && (
        <StyledAlert type="success">{successMessage}</StyledAlert>
      )}

      <ChatWrapper elevation={8} className="messages-wrapper">
        <ChatHeading fontWeight={700} color={'#fff'}>
          Chat - podziel się wrażeniami
        </ChatHeading>
        <Messages className="messages-container">
          {messages.map((message, i) => {
            return (
              <ChatMessage
                key={i}
                userName={message.senderName}
                text={message.message}
                userPhoto={message.senderAvatar}
                self={+message.senderId === user?.id}
                senderId={+message.senderId}
                date={new Date(message.date.date).toLocaleDateString('pl-PL', {
                  weekday: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              />
            );
          })}
        </Messages>
        <Actions>
          <Form onSubmit={(e) => sendMessage(e)}>
            <FormControl
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <ChatInput
                hiddenLabel
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                value={message || ''}
                placeholder="Message"
                variant="standard"
                size="medium"
                color="primary"
                autoComplete="off"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ChatIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <SendButton
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}
              >
                Wyślij
              </SendButton>
            </FormControl>
          </Form>
        </Actions>
      </ChatWrapper>
    </Wrapper>
  );
};

export default Chat;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 5rem 0;
`;

const StyledAlert = styled(Alert)`
  position: fixed;
  top: 70px;
  z-index: 500000;
`;

const ChatWrapper = styled(Paper)`
  && {
    width: 90vw;
    height: 600px;
    border-radius: 20px;
    background: ${({ theme }) => theme.primaryLight};

    @media ${responsive.tablet} {
      width: 70vw;
    }

    @media ${responsive.desktop} {
      width: 55vw;
    }
  }
`;

const ChatHeading = styled(Typography)`
  background: ${({ theme }) => theme.primaryBlue};
  border-radius: 15px 15px 0 0;
  text-align: center;
  padding: 1rem 0;
  color: ${({ theme }) => theme.primaryLight};
`;

const Messages = styled.div`
  overflow-y: scroll;
  height: 72%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${({ theme }) => theme.lightGray};

  &::-webkit-scrollbar {
    width: 13px;
    border: 1px solid ${({ theme }) => theme.lightGray};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => darken(theme.lightBlue, 0.25)};
    cursor: pointer;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => darken(theme.lightBlue, 0.2)};
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.lightGray};
  }
`;

const Form = styled.form`
  display: block;
  width: 100%;
`;

const Actions = styled.div`
  position: relative;
  height: 65px;
  margin: 0 auto;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.secondaryLight};
  display: flex;
  align-items: center;
  width: 95%;
  transform: translateY(35%);

  @media ${responsive.tablet} {
    width: 80%;
  }
`;

const ChatInput = styled(TextField)`
  && {
    margin: 0 1.1rem 0 0.8rem;
    display: flex;
    align-items: center;
    width: 55%;

    @media ${responsive.mobileM} {
      align-items: stretch;
      width: 64%;
    }

    @media ${responsive.tablet} {
      width: 60%;
      margin: 0 1.4rem;
    }

    @media ${responsive.laptop} {
      width: 65%;
      margin: 0 1.8rem;
    }
    @media ${responsive.desktop} {
      width: 73%;
    }
  }
`;

const SendButton = styled(Button)`
  && {
    width: 95px;
    height: 35px;
    display: flex;
    align-items: center;
    @media ${responsive.tablet} {
      width: 110px;
      height: 37px;
    }
  }
`;

Chat.propTypes = {
  id: PropTypes.string.isRequired,
};
