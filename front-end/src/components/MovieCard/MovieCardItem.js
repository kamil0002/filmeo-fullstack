import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from 'components/Typography/Typography';
import Rating from '@mui/material/Rating';
import { Button, CardActionArea, CardActions } from '@mui/material';

const MovieCardItem = ({
  title,
  slug,
  genres,
  poster,
  ratingAverage,
  ratingQuantity,
  description,
  releaseDate,
  time,
}) => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate(`/film/${slug}`);
  };

  return (
    <Card
      sx={{
        maxWidth: 255,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
      }}
      elevation={8}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="150"
          image={`http://127.0.0.1:8000/images/movies/${poster}`}
          alt={title}
        />
        <CardContent sx={{ paddingBottom: 0 }}>
          <Typography
            gutterBottom
            color="#040714"
            variant="h6"
            component="div"
            fontWeight={700}
            marginBottom={0}
            marginTop={-0.75}
          >
            {`${title} (${releaseDate.split('-')[0]})`}
          </Typography>
          <Typography color="text.secondary" marginBottom={2}>{`${genres.join(
            ' '
          )}, ${time}m`}</Typography>
          <Typography fontSize={12.5} variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{
          justifyContent: 'space-between',
          alignSelf: 'flex-end',
          width: '100%',
        }}
      >
        <RatingWrapper>
          <Rating
            sx={{ zIndex: 100 }}
            readOnly
            value={ratingAverage}
            precision={0.1}
            defaultValue={0.0}
            size="small"
          />
          <Typography
            fontWeight={500}
            color="#3A3D42"
            fontSize={12}
            sx={{ zIndex: 100 }}
            marginLeft={1}
          >
            {`(${ratingQuantity})`}
          </Typography>
        </RatingWrapper>
        <Button
          onClick={handleRedirect}
          sx={{ fontFamily: 'inherit' }}
          size="small"
          color="primary"
        >
          Więcej
        </Button>
      </CardActions>
    </Card>
  );
};

export default MovieCardItem;

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
`;

MovieCardItem.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
  description: PropTypes.string.isRequired,
  ratingAverage: PropTypes.number.isRequired,
  ratingQuantity: PropTypes.number.isRequired,
  releaseDate: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
};
