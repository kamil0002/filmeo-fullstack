import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setMovies } from 'slices/moviesSlice';
import styled from 'styled-components';
import Spinner from 'components/Spinner/Spinner';
import GenresNavigation from 'components/GenresNavigation/GenresNavigation';
import MovieCardGrid from 'components/MovieCard/MovieCardGrid';
import Alert from 'components/Alert/Alert';
import axios from 'utils/axios';
import clearAsyncMessages from 'utils/clearAsyncMessages';

const Movies = () => {
  const genre = useSelector((state) => state.browsingGenre.genreName);
  const movies = useSelector((state) => state.movies.all);
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errMessage, setErrMessage] = useState(null);
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  const { search } = useLocation();

  useEffect(async () => {
    //* Transaction
    try {
      if (search.length !== 0) {
        const searchParams = new URLSearchParams(search);

        const movieId = +searchParams.get('movie');
        console.log(movieId);
        const res = await axios.post('api/v1/rentMovie', {
          movieId,
        });
        if (res.data.status !== 'success') {
          throw new Error(res.data.message);
        }
        setSuccessMessage(res.data.message);
      }
    } catch (err) {
      setErrMessage(err.message);
    } finally {
      clearAsyncMessages(setSuccessMessage, setErrMessage, null);
    }
  }, []);

  useEffect(async () => {
    try {
      if (!genre) return;
      setSpinnerVisible(true);
      const data = await axios.get(`api/v1/movies?genre=${genre}`);
      if (data.data.status !== 'success') {
        throw new Error(data.data.message);
      }
      setSpinnerVisible(false);
      dispatch(setMovies(data.data.data[0]));
    } catch (err) {
      setErrMessage(err.message);
    } finally {
      clearAsyncMessages(null, setErrMessage);
    }
  }, [genre]);

  return (
    <Wrapper>
      {errMessage && <Alert>{errMessage}</Alert>}
      {successMessage && <Alert type="success">{successMessage}</Alert>}
      {errMessage && <Alert>{errMessage}</Alert>}
      <GenresNavigation />
      {spinnerVisible && <Spinner />}
      {movies && !spinnerVisible && (
        <MovieCardGrid movies={movies} allMovies={true} />
      )}
    </Wrapper>
  );
};

export default Movies;

const Wrapper = styled.div`
  min-height: calc(100vh - 76px - 70px);
`;
