import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Paper } from '@mui/material';
import Form from 'components/Form/Form';
import FormInput from 'components/Form/FormInput';
import { useForm } from 'react-hook-form';
import Typography from 'components/Typography/Typography';
import responsive from 'theme/responsive';
import routes from 'routes';
import axios from 'utils/axios';
import Cookies from 'js-cookie';
import clearAsyncMessages from 'utils/clearAsyncMessages';
import { useDispatch } from 'react-redux';
import { setUser } from 'slices/authSlice';
import Alert from 'components/Alert/Alert';

const Register = () => {
  const [errMessage, setErrMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [processing, setProcessing] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ shouldFocusError: false });

  const onSubmit = async (data) => {
    try {
      if (data.password !== data.password_confirmation) {
        throw new Error('Hasła nie pasują do siebie!');
      }

      if (new Date(data.birth_date).getTime() > Date.now()) {
        throw new Error('Podaj poprawną datę urodzenia!');
      }
      setProcessing(true);
      await axios.get('/sanctum/csrf-cookie');
      const register = await axios.post('/api/v1/register', data);
      console.log(register);
      if (register.data.status !== 'success') {
        throw new Error(register.data.message);
      }
      Cookies.set('token', register.data.token, { path: '' });
      dispatch(setUser(register.data.data));
      setSuccessMessage(
        'Twoje konto zostało utworzone, zostajesz automatycznie zalogowany.'
      );
      setTimeout(() => {
        setSuccessMessage(null);
        navigate('/profil');
        location.reload();
      }, 2000);
    } catch (err) {
      if (err.message.includes('email')) {
        setErrMessage('Ten adres e-mail jest już zajęty!');
      } else setErrMessage(err.message);
    } finally {
      clearAsyncMessages(setSuccessMessage, setErrMessage, setProcessing);
    }
  };

  return (
    <Wrapper>
      {errMessage && <Alert>{errMessage}</Alert>}
      {successMessage && <Alert type="success">{successMessage}</Alert>}
      <StyledPaper elevation={8}>
        <Heading>Zarejestruj się!</Heading>
        <Form
          submitFn={handleSubmit(onSubmit)}
          processing={processing}
          buttonText="Załóż konto"
        >
          <FormInput
            validator={{
              ...register('name', {
                required: true,
                minLength: 2,
              }),
            }}
            id="name"
            label="Imię"
            isValid={errors.name ? true : false}
            helperText="Nie podane imienia"
          />
          <FormInput
            validator={{
              ...register('surname', {
                required: true,
                minLength: 2,
              }),
            }}
            id="surname"
            label="Nazwisko"
            isValid={errors.surname ? true : false}
            helperText="Nie podane nazwisko"
          />
          <FormInput
            validator={{
              ...register('address', {
                required: true,
                minLength: 2,
              }),
            }}
            id="address"
            label="Adres zamieszkania"
            isValid={errors.address ? true : false}
            helperText="Nie podane adresu"
          />
          <FormInput
            validator={{
              ...register('birth_date', {
                required: true,
              }),
            }}
            InputLabelProps={{
              shrink: true,
            }}
            id="birth_date"
            label="Data urodzenia"
            type="date"
            isValid={errors.birth_date ? true : false}
            helperText="Nie podane daty urodzenia"
          />
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
                pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{6,}/,
              }),
            }}
            id="password"
            label="Hasło"
            type="password"
            isValid={errors.password ? true : false}
            helperText="Hasło musi zawierać dużą oraz małą literę, cyfrę i mieć długość co najmniej 6 znaków"
          />
          <FormInput
            validator={{
              ...register('password_confirmation', {
                required: true,
                pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{6,}/,
              }),
            }}
            id="passwordConfirm"
            label="Potwórz hasło"
            type="password"
            isValid={errors.password_confirmation ? true : false}
            helperText="Hasło musi zawierać dużą oraz małą literę, cyfrę i mieć długość co najmniej 6 znaków"
          />
        </Form>
        <Typography marginTop={5} fontSize={13}>
          Masz już konto?
          <StyledLink to={routes.login}>Zaloguj się!</StyledLink>
        </Typography>
      </StyledPaper>
    </Wrapper>
  );
};

export default Register;

const Wrapper = styled.div`
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 4rem 0;

  @media ${responsive.tablet} {
    min-height: calc(100vh - 76px - 70px);
  }
`;

const StyledPaper = styled(Paper)`
  padding: 1rem 2rem;
  width: 96vw;

  @media ${responsive.tablet} {
    width: 50vw;
  }

  @media ${responsive.desktop} {
    width: 30vw;
  }
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

const StyledLink = styled(Link)`
  text-decoration: underline;
  margin-left: 0.3rem;
  color: ${({ theme }) => theme.darkBlue};
`;
