import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import Typography from 'components/Typography/Typography';
import Form from 'components/Form/Form';
import FormInput from 'components/Form/FormInput';
import { useForm } from 'react-hook-form';
import responsive from 'theme/responsive';
import axios from 'utils/axios';
import Alert from 'components/Alert/Alert';
import { updateUser } from 'slices/authSlice';
import clearAsyncMessages from 'utils/clearAsyncMessages';
import userAge from 'utils/userAge';

const UserSettings = () => {
  const [errMessage, setErrMessage] = useState(null);
  const [processingUserData, setProcessingUserData] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [processingPasswordChange, setProcessingPasswordChange] =
    useState(false);

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const {
    register: registerData,
    handleSubmit: handleSubmitData,
    formState: { errors: errors1 },
  } = useForm({
    shouldFocusError: false,
    defaultValues: {
      name: user.name || '',
      surname: user.surname || '',
      address: user.address || '',
      email: user.email || '',
      birth_date: user.birth_date
        ? new Date(user.birth_date).toISOString().substr(0, 10)
        : null,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errors2 },
    reset,
  } = useForm({ shouldFocusError: false });

  const changeUserData = async (data) => {
    try {
      if (userAge(data.birth_date) < 12) {
        throw new Error('Podaj poprawną datę urodzenia!');
      }
      setProcessingUserData(true);
      await axios.put('/api/v1/updateMyProfile', data);

      setSuccessMessage('Twoje dane zostały zaaktualizowane!');
      dispatch(updateUser(data));
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setErrMessage(err.message);
    } finally {
      clearAsyncMessages(
        setSuccessMessage,
        setErrMessage,
        setProcessingUserData
      );
    }
  };

  const changeUserPassword = async (data) => {
    try {
      console.log(data);
      setProcessingPasswordChange(true);
      const res = await axios.put('/api/v1/updateMyPassword', data);

      if (res.data.status !== 'success') {
        throw new Error(res.data.message);
      }
      setSuccessMessage('Twoje hasło zostało zmienione!');
      reset();
    } catch (err) {
      setErrMessage(err.message);
    } finally {
      clearAsyncMessages(
        setSuccessMessage,
        setErrMessage,
        setProcessingPasswordChange
      );
    }
  };

  return (
    <Wrapper>
      {errMessage && <Alert>{errMessage}</Alert>}
      {successMessage && <Alert type="success">{successMessage}</Alert>}

      <Typography fontSize={24} fontWeight={700}>
        Ustawienia
      </Typography>
      <Typography marginTop={3}>Zmiana danych</Typography>
      <Form
        submitFn={handleSubmitData(changeUserData)}
        buttonText="Zapisz ustawienia"
        buttonType="outlined"
        processing={processingUserData}
        spinnerDark={true}
      >
        <FormInput
          settings="true"
          validator={{
            ...registerData('name', {
              required: true,
              minLength: 2,
            }),
          }}
          id="name"
          label="Imię"
          isValid={errors1.name ? true : false}
          helperText="Nie podane imienia"
        />
        <FormInput
          settings="true"
          validator={{
            ...registerData('surname', {
              required: true,
              minLength: 2,
            }),
          }}
          id="surname"
          label="Nazwisko"
          isValid={errors1.surname ? true : false}
          helperText="Nie podane nazwisko"
        />
        <FormInput
          settings="true"
          validator={{
            ...registerData('address', {
              required: true,
              minLength: 2,
            }),
          }}
          id="address"
          label="Adres zamieszkania"
          isValid={errors1.address ? true : false}
          helperText="Nie podane adresu"
        />
        <FormInput
          settings="true"
          validator={{
            ...registerData('birth_date', {
              required: true,
            }),
          }}
          InputLabelProps={{
            shrink: true,
          }}
          id="date"
          label="Data urodzenia"
          type="date"
          isValid={errors1.birth_date ? true : false}
          helperText="Nie podane daty urodzenia"
        />
        <FormInput
          settings="true"
          validator={{
            ...registerData('email', {
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
      <Separator></Separator>
      <Typography marginTop={3}>Zmiana hasła</Typography>
      <Form
        submitFn={handleSubmitPassword(changeUserPassword)}
        buttonText="Zmień hasło"
        buttonType="outlined"
        processing={processingPasswordChange}
        spinnerDark={true}
      >
        <FormInput
          validator={{
            ...registerPassword('old_password', {
              required: true,
              pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
            }),
          }}
          id="actPassword"
          label="Aktualne hasło"
          type="password"
          isValid={errors2.password ? true : false}
          helperText="Hasło musi zawierać dużą oraz małą literę, cyfrę i mieć długość co najmniej 6 znaków"
        />
        <FormInput
          validator={{
            ...registerPassword('password', {
              required: true,
              pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
            }),
          }}
          id="newPassword"
          label="Nowe hasło"
          type="password"
          isValid={errors2.password ? true : false}
          helperText="Hasło musi zawierać dużą oraz małą literę, cyfrę i mieć długość co najmniej 6 znaków"
        />
        <FormInput
          validator={{
            ...registerPassword('password_confirmation', {
              required: true,
              pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
            }),
          }}
          id="repeatPassword"
          label="Powtórz hasło"
          type="password"
          isValid={errors2.password_confirmation ? true : false}
          helperText="Hasło musi zawierać dużą oraz małą literę, cyfrę i mieć długość co najmniej 6 znaków"
        />
      </Form>
    </Wrapper>
  );
};

export default UserSettings;

const Wrapper = styled.div`
  margin: auto;
  @media ${responsive.tablet} {
    margin-left: 2rem;
  }
`;

const Separator = styled.div`
  height: 40px;
  width: 100%;
`;
