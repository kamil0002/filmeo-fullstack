import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Grid } from '@mui/material';
import Typography from 'components/Typography/Typography';
import MovieCard from './MovieCardItem';

const MovieCardGrid = ({ movies, heading, backgroundColor, allMovies }) => {
  return (
    <OuterWrapper>
      <Wrapper backgroundColor={backgroundColor}>
        <Typography
          component="h2"
          variant="h4"
          fontWeight={700}
          align="center"
          letterSpacing={0.5}
        >
          {heading}
        </Typography>
        <GridContainer
          allmovies={allMovies ? 1 : 0}
          container
          spacing={4}
          marginTop={4}
          paddingX={allMovies ? 6 : 2}
        >
          {movies.map((movie) => (
            <Grid item key={movie.id}>
              <MovieCard
                title={movie.title}
                slug={movie.slug}
                genres={movie.genres.map((genre) => genre.name)}
                poster={movie.poster}
                ratingAverage={+movie.rating_average || 0}
                ratingQuantity={movie.rating_quantity}
                description={movie.short_description}
                releaseDate={movie.release_date}
                time={movie.running_time}
              />
            </Grid>
          ))}
        </GridContainer>
      </Wrapper>
    </OuterWrapper>
  );
};

export default MovieCardGrid;

const OuterWrapper = styled.div`
  margin: 0 auto;
  width: 100%;
`;

const Wrapper = styled.section`
  background-color: ${({ backgroundColor }) => backgroundColor};
  padding: 3rem 0;
`;

const GridContainer = styled(Grid)`
  && {
    justify-content: center;

    margin-bottom: ${({ allmovies }) => (allmovies ? '3rem' : 0)};
  }
`;

MovieCardGrid.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object).isRequired,
  heading: PropTypes.string,
  backgroundColor: PropTypes.string,
  allMovies: PropTypes.bool,
};

MovieCardGrid.defaultProps = {
  allMovies: false,
};
