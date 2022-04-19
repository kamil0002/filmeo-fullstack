import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeGenre } from 'slices/browsingGenreSlice';
import styled, { css } from 'styled-components';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from 'components/Typography/Typography';
import responsive from 'theme/responsive';
import axios from 'utils/axios';
import Alert from 'components/Alert/Alert';
import { setMovies } from 'slices/moviesSlice';

const GenresNavigation = () => {
  const genre = useSelector((state) => state.browsingGenre.genreName);
  const [navWrapped, setNavWrapped] = useState(false);
  const [allMovies, setAllMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [errMessage, setErrMessage] = useState(null);

  const dispatch = useDispatch();

  const handleActiveGenre = (e) => {
    dispatch(changeGenre(e.target.textContent));
    setSelectedMovie('');
  };

  const handleNavWrap = () => {
    setNavWrapped(!navWrapped);
  };

  const handleMovieChange = async (e, newValue) => {
    try {
      const movieId = e.target.dataset.id;
      const movie = await axios.get(`api/v1/movies/${movieId}`);
      if (movie.data.status !== 'success') {
        throw new Error(movie.data.message);
      }
      dispatch(setMovies(movie.data.data));
      dispatch(changeGenre(null));
      setSelectedMovie(newValue);
    } catch (err) {
      setErrMessage(err.message);
      setTimeout(() => setErrMessage(null), 5000);
    }
  };

  useEffect(async () => {
    try {
      const movies = await axios.get('api/v1/movies?fields=title,id');
      if (movies.data.status !== 'success') {
        throw new Error(movies.data.message);
      }
      setAllMovies(movies.data.data[0]);
    } catch (err) {
      setErrMessage(err.message);
      setTimeout(() => setErrMessage(null), 5000);
    }
  }, []);

  return (
    <Wrapper square>
      {errMessage && <Alert>{errMessage}</Alert>}
      <Menu
        wrapped={navWrapped ? 1 : 0}
        disablePadding
        onClick={(e) => handleActiveGenre(e)}
      >
        <StyledMenuItem active={genre === 'Akcja' ? 1 : 0}>
          <Typography variant="inherit">Akcja</Typography>
        </StyledMenuItem>
        <StyledMenuItem active={genre === 'Thriller' ? 1 : 0}>
          <Typography variant="inherit">Thriller</Typography>
        </StyledMenuItem>
        <StyledMenuItem active={genre === 'Horror' ? 1 : 0}>
          <Typography variant="inherit">Horror</Typography>
        </StyledMenuItem>
        <StyledMenuItem active={genre === 'Fantasy' ? 1 : 0}>
          <Typography variant="inherit">Fantasy</Typography>
        </StyledMenuItem>
        <StyledMenuItem active={genre === 'Sci-Fi' ? 1 : 0}>
          <Typography variant="inherit">Sci-Fi</Typography>
        </StyledMenuItem>
        <StyledMenuItem active={genre === 'Przygodowy' ? 1 : 0}>
          <Typography variant="inherit">Przygodowy</Typography>
        </StyledMenuItem>
        <StyledMenuItem active={genre === 'Dramat' ? 1 : 0}>
          <Typography variant="inherit">Dramat</Typography>
        </StyledMenuItem>
        <StyledMenuItem active={genre === 'Kryminalny' ? 1 : 0}>
          <Typography variant="inherit">Kryminalny</Typography>
        </StyledMenuItem>
        <StyledMenuItem active={genre === 'Animowany' ? 1 : 0}>
          <Typography variant="inherit">Animowany</Typography>
        </StyledMenuItem>
        <StyledMenuItem active={genre === 'Wojenny' ? 1 : 0}>
          <Typography variant="inherit">Wojenny</Typography>
        </StyledMenuItem>
        <StyledMenuItem active={genre === 'Romans' ? 1 : 0}>
          <Typography variant="inherit">Romans</Typography>
        </StyledMenuItem>
        <StyledMenuItem active={genre === 'Komedia' ? 1 : 0}>
          <Typography variant="inherit">Komedia</Typography>
        </StyledMenuItem>
      </Menu>
      <WrapMenuIcon>
        {navWrapped ? (
          <ArrowDropDownIcon
            onClick={handleNavWrap}
            sx={{ cursor: 'pointer' }}
            color="primary"
            fontSize="large"
          ></ArrowDropDownIcon>
        ) : (
          <ArrowDropUpIcon
            onClick={handleNavWrap}
            sx={{ cursor: 'pointer' }}
            color="primary"
            fontSize="large"
          ></ArrowDropUpIcon>
        )}
      </WrapMenuIcon>
      <Autocomplete
        value={selectedMovie}
        onChange={(event, newValue) => handleMovieChange(event, newValue)}
        freeSolo
        disableClearable
        options={allMovies}
        getOptionLabel={(option) => option?.title || ''}
        renderOption={(props, option) => {
          return (
            <li data-id={option.id} {...props} key={option.id}>
              {option.title}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Szukaj filmu"
            variant="filled"
            size="small"
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
    </Wrapper>
  );
};

export default GenresNavigation;

const Wrapper = styled(Paper)`
  && {
    @media ${responsive.laptop} {
      margin: 0 auto;
      width: min-content;
    }
  }
`;

const Menu = styled(MenuList)`
  && {
    display: grid;
    grid-template-rows: ${({ wrapped }) =>
      wrapped ? 'repeat(1, 1fr) ' : 'repeat(3, 1fr)'};
    grid-template-columns: repeat(3, 1fr);
    border-radius: 0;

    @media ${responsive.tablet} {
      grid-template-rows: ${({ wrapped }) =>
        wrapped ? 'repeat(1, 1fr) ' : 'repeat(2, 1fr)'};
      grid-template-columns: repeat(4, 1fr);
    }

    @media ${responsive.laptop} {
      grid-template-rows: repeat(1, 1fr);
      grid-template-columns: repeat(12, 1fr);
    }
  }
  ${({ wrapped }) => css`
    & li:nth-child(n + 4) {
      display: ${wrapped ? 'none' : 'grid'};
    }

    @media ${responsive.tablet} {
      & li:nth-child(-n + 4) {
        display: ${wrapped && 'grid'};
      }
      & li {
        display: ${wrapped && 'none'};
      }
    }
  `}
`;

const StyledMenuItem = styled(MenuItem)`
  && {
    font-size: ${({ theme }) => theme.fontSize.xs};

    border-radius: 0;
    padding-top: 0.65rem;
    padding-bottom: 0.65rem;
    background: ${({ theme, active }) =>
      active === 1 ? `${theme.lightGray}` : '#fff'};

    @media ${responsive.desktop} {
      font-size: ${({ theme }) => theme.fontSize.s};
    }
  }
`;

const WrapMenuIcon = styled.div`
  display: flex;
  justify-content: flex-end;

  @media ${responsive.laptop} {
    display: none;
  }
`;
