import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Typography from 'components/Typography/Typography';
import responsive from 'theme/responsive';
import Form from 'components/Form/Form';
import FormInput from 'components/Form/FormInput';
import { useForm } from 'react-hook-form';
import axios from 'utils/axios';
import Alert from 'components/Alert/Alert';
import clearAsyncMessages from 'utils/clearAsyncMessages';
import ProcessingSpinner from 'components/ProcessingSpinner/ProcessingSpinner';

const AdminPanel = () => {
  const [selectMod, setSelectMod] = useState('');
  const [processingUserBan, setProcessingUserBan] = useState(false);
  const [processingUserUnban, setProcessingUserUnban] = useState(false);
  const [processingAddModerator, setProcessingAddModerator] = useState(false);
  const [processingDeleteMod, setProcessingDeleteMod] = useState(false);
  const [processingDeleteMovie, setProcessingDeleteMovie] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const [errMessage, setErrMessage] = useState();
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectUnban, setSelectUnban] = useState('');
  const [bannedUsers, setBannedUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [moderators, setModerators] = useState([]);

  const {
    register: registerUserBlock,
    handleSubmit: handleSubmitUserBlock,
    formState: { errors: errors1 },
  } = useForm({ shouldFocusError: false });

  const {
    register: registerAddModerator,
    handleSubmit: handleSubmitAddModerator,
    formState: { errors: errors2 },
  } = useForm({ shouldFocusError: false });

  useEffect(async () => {
    try {
      const users = await axios.get('/api/v1/users');

      const bannedUsers = users.data.data[0]
        .filter((user) => user.banned === 1)
        .map((user) => ({
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
        }));
      setBannedUsers(bannedUsers);

      const movies = await axios.get('/api/v1/movies');
      setMovies(movies.data.data[0]);
      const moderators = await axios.get('/api/v1/users?moderators=true');

      setModerators(moderators.data.data[0]);
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  const deleteMovie = async () => {
    try {
      setProcessingDeleteMovie(true);
      const res = await axios.delete(`/api/v1/admin/movies/${selectedMovie}`);
      if (res.data !== '') {
        throw new Error(res.data.message);
      }
      setSuccessMessage('Film został usunięty');
    } catch (err) {
      setErrMessage(err.message);
    } finally {
      clearAsyncMessages(
        setSuccessMessage,
        setErrMessage,
        setProcessingDeleteMovie
      );
    }
  };

  const blockUser = async (data) => {
    try {
      setProcessingUserBan(true);
      await axios.put('/api/v1/admin/ban', data);
      setSuccessMessage(
        `Użytkownik o adresie email ${data.email} został zbanowany`
      );
    } catch (err) {
      setErrMessage(err.message);
    } finally {
      clearAsyncMessages(
        setSuccessMessage,
        setErrMessage,
        setProcessingUserBan
      );
    }
  };

  const unbanUser = async () => {
    try {
      setProcessingUserUnban(true);
      await axios.put('/api/v1/admin/unban', {
        userId: selectUnban,
      });
      setSuccessMessage(`Użytkownik o id ${selectUnban} został odbanowany`);
      setBannedUsers((prevState) =>
        prevState.filter((user) => user.id !== selectUnban)
      );
      setSelectUnban('');
    } catch (err) {
      setErrMessage(err.message);
    } finally {
      clearAsyncMessages(
        setSuccessMessage,
        setErrMessage,
        setProcessingUserUnban
      );
    }
  };

  const addModerator = async (data) => {
    try {
      setProcessingAddModerator(true);
      const res = await axios.put('/api/v1/admin/add-moderator', data);
      if (res.data.status !== 'success') {
        throw new Error(res.data.message);
      }
      setSuccessMessage(res.data.message);
    } catch (err) {
      setErrMessage(err.message);
    } finally {
      clearAsyncMessages(
        setSuccessMessage,
        setErrMessage,
        setProcessingAddModerator
      );
    }
  };

  const deleteMod = async () => {
    try {
      setProcessingDeleteMod(true);
      await axios.put('/api/v1/admin/delete-moderator', {
        userId: selectMod,
      });
      setSuccessMessage(
        `Użytkownik o id ${selectMod} stracił rangę moderatora!`
      );
      setModerators((prevState) =>
        prevState.filter((user) => user.id !== selectMod)
      );
      setSelectMod('');
    } catch (err) {
      setErrMessage(err.message);
    } finally {
      clearAsyncMessages(
        setSuccessMessage,
        setErrMessage,
        setProcessingDeleteMod
      );
    }
  };

  return (
    <>
      {errMessage && <Alert>{errMessage}</Alert>}
      {successMessage && <Alert type="success">{successMessage}</Alert>}
      <DeleteMovieWrapper>
        <Typography fontWeight={700}>Panel Admina</Typography>
        <StyledForm>
          <Typography marginTop={3}>Usuwanie Filmów</Typography>
          <FormControl sx={{ marginY: 2 }}>
            <InputLabel id="movie">Film</InputLabel>
            <StyledSelect
              labelId="movie"
              id="movie-select"
              value={selectedMovie}
              label="Film"
              inputProps={{
                MenuProps: { disableScrollLock: true },
              }}
              onChange={(e) => setSelectedMovie(e.target.value)}
            >
              {movies.map((movie) => (
                <MenuItem key={movie.id} value={movie.id}>
                  {movie.title}
                </MenuItem>
              ))}
            </StyledSelect>
          </FormControl>
          <StyledButton onClick={deleteMovie} variant="outlined">
            Usuń film
            {processingDeleteMovie && <ProcessingSpinner spinnerDark={true} />}
          </StyledButton>
          <Typography
            color="#C02020"
            sx={{ marginTop: 2, fontWeight: 600, fontSize: 11 }}
          >
            Uwaga! Film zostanie usunięty łącznie z wszystkimi wypożyczeniami
            oraz recenzjami!
          </Typography>
        </StyledForm>
      </DeleteMovieWrapper>
      <BlockUserWrapper>
        <Typography marginTop={3}>Zablokuj użytkownika</Typography>
        <Form
          submitFn={handleSubmitUserBlock(blockUser)}
          buttonText="Wykonaj"
          buttonType="outlined"
          spinnerDark={true}
          processing={processingUserBan}
        >
          <FormInput
            validator={{
              ...registerUserBlock('email', {
                required: true,
                pattern: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/i,
              }),
            }}
            id="email"
            label="Adres E-Mail"
            type="email"
            isValid={errors1.email ? true : false}
            helperText="Adres E-mail nie poprawny"
          />
        </Form>
      </BlockUserWrapper>
      <UnblockUserWrapper>
        <Typography marginTop={3} marginBottom={3}>
          Odblokuj użytkownika
        </Typography>
        <FormControl>
          <InputLabel id="blocked-user">Wybierz</InputLabel>

          <StyledSelect
            labelId="blocked-user"
            id="blocked-users"
            value={selectUnban}
            label="Wybierz"
            inputProps={{ MenuProps: { disableScrollLock: true } }}
            onChange={(e) => setSelectUnban(e.target.value)}
          >
            {bannedUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name} {user.surname} ({user.email}, {user.id})
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
        <StyledButton onClick={unbanUser} variant="outlined">
          Wykonaj
          {processingUserUnban && <ProcessingSpinner spinnerDark={true} />}
        </StyledButton>
      </UnblockUserWrapper>
      <AddModeratorWrapper>
        <Typography marginTop={3}>Dodaj moderatora</Typography>
        <Form
          submitFn={handleSubmitAddModerator(addModerator)}
          buttonText="Dodaj"
          buttonType="outlined"
          processing={processingAddModerator}
          spinnerDark={true}
        >
          <FormInput
            validator={{
              ...registerAddModerator('email', {
                required: true,
                pattern: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/i,
              }),
            }}
            id="email"
            label="Adres E-Mail"
            type="email"
            isValid={errors2.email ? true : false}
            helperText="Adres E-mail nie poprawny"
          />
        </Form>
      </AddModeratorWrapper>
      <DeleteModeratorWrapper>
        <Typography marginTop={3} marginBottom={3}>
          Usuń moderatora
        </Typography>
        <FormControl>
          <InputLabel id="moderators">Wybierz</InputLabel>

          <StyledSelect
            labelId="moderator"
            id="modeerator"
            value={selectMod}
            label="Wybierz"
            inputProps={{ MenuProps: { disableScrollLock: true } }}
            onChange={(e) => setSelectMod(e.target.value)}
          >
            {moderators.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name} {user.surname} ({user.email}, {user.id})
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
        <StyledButton
          onClick={deleteMod}
          sx={{ marginTop: 2 }}
          variant="outlined"
        >
          Wykonaj
          {processingDeleteMod && <ProcessingSpinner spinnerDark={true} />}
        </StyledButton>
      </DeleteModeratorWrapper>
    </>
  );
};

export default AdminPanel;

const StyledForm = styled.form`
  margin-left: 1rem;
  display: flex;
  flex-direction: column;

  &:not(:nth-of-type(0)) {
    margin-top: 2rem;
  }
`;

const StyledButton = styled(Button)`
  && {
    align-self: baseline;
    font-family: 'Poppins';
    display: flex;
    align-items: center;
    margin-top: 1.4rem;
    font-size: ${({ theme }) => theme.fontSize.xs};

    @media ${responsive.mobile} {
      font-size: ${({ theme }) => theme.fontSize.s};
    }
  }
`;

const StyledSelect = styled(Select)`
  && {
    width: 150px;

    @media ${responsive.mobileM} {
      width: 200px;
    }
  }
`;

const BlockUserWrapper = styled.div`
  margin-left: 1rem;
  margin-top: 5rem;
`;

const DeleteMovieWrapper = styled.div``;

const AddModeratorWrapper = styled(BlockUserWrapper)``;

const UnblockUserWrapper = styled(BlockUserWrapper)``;

const DeleteModeratorWrapper = styled(BlockUserWrapper)``;
