import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Button, Grid, Paper } from '@mui/material';
import { CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from 'components/Typography/Typography';
import responsive from 'theme/responsive';
import ReviewCard from 'components/ReviewCard/ReviewCard';
import { Navigate } from 'react-router-dom';
import axios from 'utils/axios';
import { loadStripe } from '@stripe/stripe-js';
import Header from 'components/MovieDetailsHeader/MovieDetailsHeader';
import MovieTrailer from 'components/MovieTrailer/MovieTrailer';
import Alert from 'components/Alert/Alert';
import clearAsyncMessages from 'utils/clearAsyncMessages';
import ProcessingSpinner from 'components/ProcessingSpinner/ProcessingSpinner';
import Cookies from 'js-cookie';
import routes from 'routes';
import userAge from 'utils/userAge';

const MovieDetails = () => {
  const [ownedByUser, setOwnedByUser] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [redirectToReviews, setRedirectToReviews] = useState(false);
  const [movie, setMovie] = useState(null);
  const [errMessage, setErrMessage] = useState(null);
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const params = useParams();

  useEffect(async () => {
    try {
      setSpinnerVisible(true);
      const movie = await axios.get(`api/v1/movies/slug/${params.slug}`);
      console.log(movie);
      if (movie.data.status !== 'success') {
        throw new Error(movie.data.message);
      }

      setMovie(movie.data.data[0][0]);

      if (Cookies.get('token')) {
        const res = await axios.get(
          `api/v1/hasUserMovie/${movie.data.data[0][0].id}`
        );

        setOwnedByUser(res.data.owned);
      }

      setSpinnerVisible(false);
    } catch (err) {
      console.log(err);
      setErrMessage(err.message);
    } finally {
      clearAsyncMessages(null, setErrMessage, setProcessing);
    }
  }, []);

  const handleRedirectToReviews = () => {
    setRedirectToReviews(true);
  };

  const rentMovie = async (e) => {
    try {
      e.preventDefault();

      if (movie.age_limit > userAge(user.birth_date)) {
        throw new Error(
          'Przykro nam, lecz nie masz wystarczająco lat aby wypożyczyć ten film!'
        );
      }

      setProcessing(true);
      const stripe = await loadStripe(
        'pk_test_51Kf8hsKYZjL0RBuc6T5sIluifzljkgB78Q4ZVuciIorxA5IbJhZD26wE9LpqDCuslwPyYcIPhlReykc0SmYZFe4V00TqKNhMsE'
      );
      const session = await axios.get(
        `api/v1/getSession/${movie.id}/rental/-1`
      );

      await stripe.redirectToCheckout({
        sessionId: session.data.id,
      });
    } catch (err) {
      if (err.message.includes('Przykro')) setErrMessage(err.message);
      else setErrMessage('Transakcja zakończyła się niepowodzeniem!');
    } finally {
      clearAsyncMessages(null, setErrMessage, setProcessing);
    }
  };

  if (redirectToReviews)
    return <Navigate to={`/film/${params.slug}/dodaj-opinie`} />;

  return (
    <Wrapper>
      {spinnerVisible && <Spinner />}
      {movie && (
        <>
          {errMessage && <Alert>{errMessage}</Alert>}
          <Header
            rentMovieFn={rentMovie}
            title={movie.title}
            time={+movie.running_time}
            poster={movie.poster}
            releaseYear={movie.release_date.split('-')[0]}
            cost={movie.cost}
            processing={processing}
            ownedByUser={ownedByUser}
          />
          <MovieData>
            <MovieInformationWrapper>
              <Typography
                fontWeight={700}
                align={'center'}
                paddingX={2}
                marginTop={2}
                marginBottom={7}
                fontSize={22}
                color="#1465C0"
                textTransform="uppercase"
              >
                Podstawowe informacje
              </Typography>
              <MovieInformation>
                <img src="/images/movie-genre.png" alt="movie-genre" />
                <MovieInformationText>
                  {movie.genres.map((genre) => genre.name).join(', ')}
                </MovieInformationText>
              </MovieInformation>
              <MovieInformation>
                <img src="/images/movie-director.png" alt="movie-director" />
                <MovieInformationText>{movie.director}</MovieInformationText>
              </MovieInformation>
              <MovieInformation>
                <img src="/images/age-limit.png" alt="movie-age-limit" />
                <MovieInformationText>{movie.age_limit}</MovieInformationText>
              </MovieInformation>
              <MovieInformation>
                <img src="/images/movie-rating.png" alt="movie-rating" />
                <MovieInformationText>
                  {movie.rating_average && `${movie.rating_average}/5`}
                </MovieInformationText>
              </MovieInformation>
              <MovieInfoButton
                variant="outlined"
                href={movie.details_url}
                target="_blank"
              >
                Więcej informacji
              </MovieInfoButton>
            </MovieInformationWrapper>
            <MovieDescription>
              <Typography
                fontWeight={700}
                align={'center'}
                paddingX={2}
                marginTop={2}
                marginBottom={7}
                fontSize={22}
                color="#1465C0"
                textTransform="uppercase"
              >
                Opis fabuły
              </Typography>
              <Typography fontSize="inherit">{movie.description}</Typography>
            </MovieDescription>
          </MovieData>
          <MovieTrailer url={movie.trailer_url} />
          <Reviews>
            <ReviewsHeader
              marginBottom={3.5}
              fontWeight={700}
              paddingX={2}
              marginTop={2}
              fontSize={22}
              color="#1465C0"
              textTransform="uppercase"
            >
              Opinie
            </ReviewsHeader>
            <AddReviewButton
              variant="outlined"
              onClick={handleRedirectToReviews}
            >
              Dodaj Opinię
            </AddReviewButton>
            <GridContainer
              gridRow={2}
              container
              columnSpacing={3}
              rowSpacing={3}
            >
              {movie.reviews.length === 0 ? (
                <NoReviewsText>
                  Ten film nie ma jeszcze żadnych opnii
                </NoReviewsText>
              ) : (
                movie.reviews
                  .reverse()
                  .map(
                    ({
                      author,
                      title,
                      id,
                      description,
                      created_at,
                      rating,
                      verified,
                    }) => (
                      <GridItem
                        key={id}
                        item
                        xs={10}
                        sm={6}
                        md={4}
                        lg={3}
                        xl={2}
                      >
                        <DeleteReviewIcon />
                        <ReviewCard
                          title={title}
                          description={description}
                          verified={verified}
                          rating={+rating}
                          createdAt={created_at}
                          profile={false}
                          author={author}
                          reviewId={id}
                        />
                      </GridItem>
                    )
                  )
              )}
            </GridContainer>
          </Reviews>
          <RentMovieWrapper>
            <RentMovie elevation={14}>
              <img
                src={`http://127.0.0.1:8000/images/movies/${movie.poster}`}
                alt="movie-poster"
              />
              {ownedByUser ? (
                <StyledButton disabled variant="contained">
                  Wypożycz
                </StyledButton>
              ) : Cookies.get('token') ? (
                <StyledButton onClick={rentMovie} variant="contained">
                  Wypożycz
                  {processing && <ProcessingSpinner />}
                </StyledButton>
              ) : (
                <StyledButton
                  LinkComponent={Link}
                  to={routes.login}
                  variant="contained"
                >
                  Zaloguj się ...
                </StyledButton>
              )}
            </RentMovie>
          </RentMovieWrapper>
        </>
      )}
    </Wrapper>
  );
};

export default MovieDetails;

const MovieInformation = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 280px;
  height: 70px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 1rem;

  @media ${responsive.laptop} {
    width: 350px;
    margin-left: 1.4rem;
  }

  img {
    display: block;
    width: 48px;
  }
`;

const MovieInformationText = styled(Typography)`
  && {
    margin-left: 1rem;
    font-size: ${({ theme }) => theme.fontSize.xs};
    font-weight: ${({ theme }) => theme.fontBold};
    color: ${({ theme }) => theme.primaryBlue};

    @media ${responsive.mobileM} {
      font-size: ${({ theme }) => theme.fontSize.s};
    }

    @media ${responsive.desktop} {
      font-size: ${({ theme }) => theme.fontSize.m};
    }
  }
`;

const Wrapper = styled.div`
  min-height: 100vh;
  @media ${responsive.desktop} {
    width: 95vw;
    margin: auto;
  }
`;

const MovieData = styled.div`
  display: flex;
  margin-top: -9vw;
  flex-direction: column;

  @media ${responsive.tablet} {
    flex-direction: row;
    align-items: stretch;
    justify-content: space-around;
  }
`;
const MovieInformationWrapper = styled.div`
  position: relative;

  background: rgb(230, 230, 230);
  z-index: -1;
  flex-basis: 50%;
  padding-top: 100px;
  padding-bottom: 90px;

  @media ${responsive.tablet} {
    margin-bottom: 0;
    padding-top: 200px;
  }

  @media ${responsive.laptop} {
    padding-bottom: 50px;
  }

  @media ${responsive.desktop} {
    padding-top: 240px;
  }
`;

const MovieInfoButton = styled(Button)`
  && {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 3rem;
    background-color: #fff;
    font-weight: ${({ theme }) => theme.fontBold};

    @media ${responsive.tablet} {
      width: 285px;
      height: 50px;
      font-weight: ${({ theme }) => theme.fontBold};
      font-size: ${({ theme }) => theme.fontSize.m};
    }
  }
`;

const MovieDescription = styled.div`
  padding: 0 0.5rem;
  text-align: center;
  flex-basis: 50%;
  background: #fff;
  padding: 100px 20px 90px;

  @media ${responsive.tablet} {
    width: 50%;
    padding-top: 200px;
    font-size: ${({ theme }) => theme.fontSize.m};
  }

  @media ${responsive.desktop} {
    padding-top: 240px;
    padding-left: 70px;
    padding-right: 70px;
  }
`;

const GridContainer = styled(Grid)`
  && {
    padding: 0;
    justify-content: center;

    @media only screen and (min-width: 600px) {
      padding: 0 0.6rem;
      justify-content: flex-start;
      padding: 0 3rem;
    }
  }
`;

const GridItem = styled(Grid)`
  && {
    position: relative;
    max-width: 275px;
  }
`;

const Reviews = styled.div`
  padding: 4rem 0;
  background: ${({ theme }) => theme.lightBlue};
`;

const DeleteReviewIcon = styled(DeleteIcon)`
  && {
    position: absolute;
    right: 2.5%;
    top: 17%;
    cursor: pointer;
    color: #c02020;
  }
`;

const AddReviewButton = styled(Button)`
  && {
    margin-bottom: 2rem;
    margin-left: 3rem;
    background: #fff;
  }
`;

const ReviewsHeader = styled(Typography)`
  && {
    font-size: ${({ theme }) => theme.fontSize.sm};
    margin-left: 3rem;
    @media ${responsive.tablet} {
      font-size: ${({ theme }) => theme.fontSize.m};
    }
  }
`;

const NoReviewsText = styled(Typography)`
  && {
    font-size: ${({ theme }) => theme.fontSize.lg};
    font-weight: ${({ theme }) => theme.fontBold};
    color: ${({ theme }) => theme.primaryLight};
    text-align: center;
    padding: 1rem 2rem;
  }
`;

const RentMovieWrapper = styled.div`
  padding-top: 150px;
  padding-bottom: 100px;
  background: ${({ theme }) => theme.secondaryLight};
  display: flex;
  justify-content: center;
`;

const RentMovie = styled(Paper)`
  && {
    width: 90vw;
    display: flex;
    position: relative;
    height: 100px;

    img {
      display: block;
      width: 50%;
      height: 100%;
      object-fit: cover;
      display: block;
      position: absolute;
      left: 0;
      border-radius: 4px 0 0 4px;
    }

    @media ${responsive.tablet} {
      height: 200px;
      width: 80vw;
    }
  }
`;

const StyledButton = styled(Button)`
  && {
    position: absolute;
    right: 5%;
    top: 50%;
    transform: translateY(-50%);
    font-weight: ${({ theme }) => theme.fontBold};

    @media ${responsive.tablet} {
      width: 240px;
      height: 50px;
      font-size: ${({ theme }) => theme.fontSize.m};
    }

    @media ${responsive.laptop} {
      width: 300px;
      height: 70px;
      font-size: ${({ theme }) => theme.fontSize.lg};
    }
  }
`;

const Spinner = styled(CircularProgress)`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%);
`;
