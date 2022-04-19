import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Navigate, useParams } from 'react-router-dom';
import Typography from 'components/Typography/Typography';
import responsive from 'theme/responsive';
import axios from 'utils/axios';
import Alert from 'components/Alert/Alert';
import routes from 'routes';

const WatchMovie = () => {
  const [redirect, setRedirect] = useState(false);
  const [info, setInfo] = useState(true);
  const [errMessage, setErrMessage] = useState(null);
  const [infoFirstTimeShown, setInfoFirstTimeShown] = useState(false);
  const [movieUrl, setMovieUrl] = useState(null);
  const params = useParams();

  useEffect(async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/rentals/${params.rentalId}/movies/${params.slug}/video`
      );
      if (data.status !== 'success') {
        throw new Error(data.message);
      }
      setMovieUrl(data.data[0][0].movie_url);
    } catch (err) {
      setErrMessage(err.message);
      setTimeout(() => setRedirect(true), 5000);
    }
  }, []);

  useEffect(() => {
    setTimeout(
      () => {
        setInfo(false);
        setInfoFirstTimeShown(true);
      },
      infoFirstTimeShown ? 7000 : 3000
    );
  }, [info]);

  useEffect(() => {
    window.addEventListener('mousemove', () => {
      setInfo(true);
    });
  });

  if (redirect) {
    return <Navigate to={routes.dashboard} />;
  }

  return (
    <>
      {errMessage && <Alert videoError={'1'}>{errMessage}</Alert>}

      {movieUrl && (
        <>
          <Information className="frame" info={info ? 1 : 0}>
            Naciśnij F11 aby wypełnić/pomniejszyć wyświetlany obraz
          </Information>
          <Movie log src={movieUrl} />
        </>
      )}
    </>
  );
};

export default WatchMovie;

const Movie = styled.iframe`
  width: 100vw;
  height: 100vh;
  border: 0;
  padding: 0;
`;

const Information = styled(Typography)`
  && {
    opacity: ${({ info }) => (info ? 1 : 0)};
    transition: opacity 250ms ease;
    user-select: none;
    left: 0;
    right: 0;
    text-align: center;
    position: fixed;
    top: 25%;
    z-index: 1;
    font-weight: ${({ theme }) => theme.fontBold};
    color: ${({ theme }) => theme.primaryLight};
    font-size: ${({ theme }) => theme.fontSize.sm};

    @media ${responsive.tablet} {
      font-size: ${({ theme }) => theme.fontSize.m};
    }

    @media ${responsive.desktop} {
      font-size: ${({ theme }) => theme.fontSize.lg};
    }
  }
`;
