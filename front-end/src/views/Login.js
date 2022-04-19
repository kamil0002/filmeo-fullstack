import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { Paper } from '@mui/material';
import Typography from 'components/Typography/Typography';
import Form from 'components/Form/Form';
import FormInput from 'components/Form/FormInput';
import { useForm } from 'react-hook-form';
import responsive from 'theme/responsive';
import axios from 'utils/axios';
import { setUser } from 'slices/authSlice';
import Alert from 'components/Alert/Alert';
import clearAsyncMessages from 'utils/clearAsyncMessages';
import routes from 'routes';

const Login = () => {
  const [errMessage, setErrMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldFocusError: false,
  });

  const onSubmit = async (data) => {
    try {
      setProcessing(true);
      await axios.get('/sanctum/csrf-cookie');
      const login = await axios.post('/api/v1/login', data);
      if (login.data.statusCode === 401) {
        throw new Error(login.data.message);
      }
      Cookies.set('token', login.data.token, { path: '' });
      dispatch(setUser(login.data.data));
      setSuccessMessage('Pomyślnie zalogowano.');
      setTimeout(() => {
        setSuccessMessage(null);
        navigate('/profil');
        location.reload();
      }, 1500);
    } catch (err) {
      setErrMessage(err.message);
    } finally {
      clearAsyncMessages(setSuccessMessage, setErrMessage, setProcessing);
    }
  };

  return (
    <Wrapper>
      {errMessage && <Alert>{errMessage}</Alert>}
      {successMessage && <Alert type="success">{successMessage}</Alert>}

      <StyledPaper elevation={8}>
        <Heading
          fontFamily="Poppins"
          textTransform={'uppercase'}
          fontWeight={700}
        >
          Zaloguj się do swojego konta
        </Heading>
        <Form
          submitFn={handleSubmit(onSubmit)}
          buttonText="Zaloguj się"
          processing={processing}
        >
          <FormInput
            validator={{
              ...register('email', {
                required: true,
                pattern: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/i,
              }),
            }}
            id="email"
            label="Adres E-Mail"
            type="email"
            isValid={errors.email ? true : false}
            helperText="Adres E-mail nie poprawny"
          />
          <FormInput
            validator={{
              ...register('password', {
                required: true,
                pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
              }),
            }}
            id="password"
            label="Hasło"
            type="password"
            isValid={errors.password ? true : false}
            helperText="Hasło musi zawierać dużą oraz małą literę, cyfrę i mieć długość co najmniej 6 znaków"
          />
        </Form>
        <Typography fontFamily="Poppins" marginTop={5} fontSize={13}>
          Nie masz jeszcze konta?
          <StyledLink to={routes.register}>Załóż konto!</StyledLink>
        </Typography>
      </StyledPaper>
    </Wrapper>
  );
};

export default Login;

const Wrapper = styled.div`
  min-height: calc(100vh - 76px - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Heading = styled(Typography)`
  && {
    font-size: ${({ theme }) => theme.fontSize.s};
    font-weight: ${({ theme }) => theme.fontBold};

    @media ${responsive.tablet} {
      font-size: ${({ theme }) => theme.fontSize.m};
    }

    @media ${responsive.desktop} {
      font-size: ${({ theme }) => theme.fontSize.md};
    }
  }
`;

const StyledPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: 2rem 3rem;
  width: 96vw;

  @media ${responsive.mobile} {
    width: 80vw;
  }

  @media ${responsive.mobileM} {
    width: 65vw;
  }

  @media ${responsive.tablet} {
    width: 53vw;
  }

  @media ${responsive.laptop} {
    width: 40vw;
  }

  @media ${responsive.desktop} {
    width: 30vw;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: underline;
  margin-left: 0.3rem;
  color: ${({ theme }) => theme.darkBlue};
`;
