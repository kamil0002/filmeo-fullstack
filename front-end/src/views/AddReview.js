import React, { useState } from 'react';
import styled from 'styled-components';
import { Navigate } from 'react-router-dom';
import { FormControl, Paper, Rating } from '@mui/material';
import Typography from 'components/Typography/Typography';
import responsive from 'theme/responsive';
import Form from 'components/Form/Form';
import FormInput from 'components/Form/FormInput';
import { useForm } from 'react-hook-form';
import Lottie from 'react-lottie';
import lottieAnimation from 'lotties/review-lottie.json';
import axios from 'utils/axios';
import Alert from 'components/Alert/Alert';
import { useParams } from 'react-router-dom';
import clearAsyncMessages from 'utils/clearAsyncMessages';

const AddReview = () => {
  const [redirect, setRedirect] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [errMessage, setErrMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const params = useParams();

  const {
    register: register,
    handleSubmit: handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    shouldFocusError: false,
  });
  const onSubmit = async (data) => {
    try {
      setProcessing(true);
      if (ratingValue === 0)
        throw new Error('Oceń film w skali 1-5 zanim dodasz opinię!');
      const review = await axios.post(`/api/v1/reviews/movie/${params.slug}`, {
        title: data.title,
        description: data.description,
        rating: +ratingValue,
      });

      setSuccessMessage('Opinia została dodana!');
      reset();
      setRatingValue(0);
      setTimeout(() => {
        setRedirect(true);
        setSuccessMessage(null);
      }, 1500);
      if (review.data.status !== 'success') {
        throw new Error(review.data.message);
      }
    } catch (err) {
      if (err.message.includes(401)) {
        setErrMessage('Musisz się zalogować aby dodać opinię!');
      } else setErrMessage(err.message);
    } finally {
      clearAsyncMessages(setSuccessMessage, setErrMessage, setProcessing);
    }
  };

  if (redirect) {
    return <Navigate to={`/film/${params.slug}`} />;
  }

  return (
    <Wrapper>
      {errMessage && <Alert>{errMessage}</Alert>}
      {successMessage && <Alert type="success">{successMessage}</Alert>}
      <StyledPaper elevation={8}>
        <Typography
          fontFamily="Poppins"
          textTransform={'uppercase'}
          fontWeight={700}
          align={'center'}
          marginBottom={3}
        >
          Dodaj opinię
        </Typography>
        <Lottie
          height={150}
          width={150}
          speed={0.75}
          options={{
            loop: true,
            autoplay: true,
            animationData: lottieAnimation,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice',
            },
          }}
        />
        <Form
          submitFn={handleSubmit(onSubmit)}
          buttonText="Dodaj"
          processing={processing}
        >
          <FormInput
            validator={{
              ...register('title', {
                required: true,
                minLength: 5,
              }),
            }}
            id="title"
            label="Tytuł"
            isValid={errors.title ? true : false}
            helperText="Podaj tytuł o długości co najmniej 5 znaków"
          />
          <FormInput
            validator={{
              ...register('description', {
                required: true,
                minLength: 15,
              }),
            }}
            type="text"
            multiline
            rows={5}
            id="title"
            label="Opis"
            isValid={errors.description ? true : false}
            helperText="Podaj opis o długości co najmniej 15 znaków"
          />
          <FormControl required={true} margin="normal">
            <Typography
              component="legend"
              color="text.secondary"
              marginBottom={0.5}
            >
              Ocena
            </Typography>
            <Rating
              name="movie-rating"
              value={ratingValue}
              precision={0.5}
              sx={{ marginLeft: -0.5 }}
              onChange={(event, newValue) => {
                setRatingValue(newValue);
              }}
            />
          </FormControl>
        </Form>
      </StyledPaper>
    </Wrapper>
  );
};

export default AddReview;

const Wrapper = styled.div`
  min-height: calc(100vh - 76px - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;

  @media ${responsive.tablet} {
    margin: 4rem 0;
  }
`;

const StyledPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
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
