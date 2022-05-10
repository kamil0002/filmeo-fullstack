import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, Paper, Rating } from '@mui/material';
import Typography from 'components/Typography/Typography';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Tooltip } from '@mui/material';
import Alert from 'components/Alert/Alert';
import axios from 'utils/axios';

const ReviewCard = ({
  profile,
  title,
  description,
  createdAt,
  rating,
  author,
  movie,
  verified,
  reviewId,
}) => {
  const [errMessage, setErrMessage] = useState(null);
  const [successMessage, setSuccesMessage] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const deleteReview = async (id) => {
    try {
      const obj = await axios.delete(`/api/v1/reviews/${id}`);
      if (obj.data !== '') {
        throw new Error(obj.data.message);
      }
      setSuccesMessage('Opinia została pomyślnie usunięta!');
    } catch (err) {
      console.log(err);
      setErrMessage(err.message);
    } finally {
      setTimeout(() => {
        setErrMessage(null);
        setSuccesMessage(null);
      }, 2000);
    }
  };

  return (
    <>
      {successMessage && <Alert type="success">{successMessage}</Alert>}
      {errMessage && <Alert>{errMessage}</Alert>}
      <Paper
        sx={{
          paddingTop: 2,
          paddingBottom: 3,
          height: '100%',
          position: 'relative',
        }}
        elevation={4}
      >
        {(user?.role === 'administrator' || user?.role === 'moderator') &&
          !profile && (
            <DeleteButton
              onClick={() => deleteReview(reviewId)}
              color="error"
              variant="text"
            >
              Usuń
            </DeleteButton>
          )}
        {verified ? (
          <Tooltip title="Zweryfikowana wypożyczeniem">
            <VerifiedIcon
              sx={{
                color: '#31CC79',
                position: 'absolute',
                right: '3%',
                top: '3%',
              }}
            ></VerifiedIcon>
          </Tooltip>
        ) : (
          ''
        )}
        <ReviewContent>
          <Typography fontWeight={700} align={'center'}>
            {title}
          </Typography>
          <Typography
            fontSize={14}
            marginTop={1}
            marginBottom={10}
            align={'center'}
            sx={{ wordBreak: 'break-word' }}
          >
            {description}
          </Typography>
        </ReviewContent>
        <ReviewDetails>
          <Rating
            name="read-only"
            value={rating}
            precision={0.1}
            defaultValue={0.0}
            size={'small'}
            readOnly
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          />
          {profile && (
            <Button onClick={() => deleteReview(reviewId)} variant="text">
              Usuń
            </Button>
          )}
          {!profile && (
            <Typography fontSize={12}>
              {new Intl.DateTimeFormat('pl-PL', {
                dateStyle: 'medium',
              }).format(new Date(createdAt))}
            </Typography>
          )}
        </ReviewDetails>
        <ReviewCardFooter>{profile ? movie : author}</ReviewCardFooter>
      </Paper>
    </>
  );
};

export default ReviewCard;

const DeleteButton = styled(Button)`
  && {
    font-family: inherit;
    position: absolute;
    left: 1.5%;
    top: 0;
    font-weight: ${({ theme }) => theme.fontBold};
  }
`;

const ReviewContent = styled.div`
  padding: 1.1rem 0.8rem 0;
`;

const ReviewDetails = styled.div`
  margin: 0.4rem auto;
  padding: 0 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 57px;
`;

const ReviewCardFooter = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  font-weight: 500;
  color: ${({ theme }) => theme.darkBlue};
  background: ${({ theme }) => theme.primaryLight};
  padding: 0.5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 0 4px 4px;
  text-align: center;
`;

ReviewCard.propTypes = {
  profile: PropTypes.bool,
  reviewId: PropTypes.number,
  author: PropTypes.string,
  movie: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  verified: PropTypes.any,
};

ReviewCard.defaultProps = {
  profile: true,
};
