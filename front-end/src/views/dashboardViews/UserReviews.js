import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import styled from 'styled-components';
import Typography from 'components/Typography/Typography';
import ReviewCard from 'components/ReviewCard/ReviewCard';
import responsive from 'theme/responsive';
import axios from 'utils/axios';
import Spinner from 'components/Spinner/Spinner';

const UserReviews = () => {
  const [myReviews, setMyReviews] = useState(null);
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  useEffect(async () => {
    try {
      setSpinnerVisible(true);
      const {
        data: { data: reviews },
      } = await axios.get('/api/v1/myReviews');
      setSpinnerVisible(false);
      if (!reviews) return;
      setMyReviews(reviews[0]);
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  return (
    <Wrapper>
      <Typography fontSize={24} fontWeight={700} marginBottom={4}>
        Wystawione Opinie
      </Typography>
      {spinnerVisible && <Spinner />}
      {myReviews && (
        <GridContainer container columnSpacing={3} rowSpacing={3}>
          {myReviews.length === 0 && (
            <Typography marginLeft={3}>Nic jeszcze nie oceniłeś!</Typography>
          )}
          {myReviews.map((review) => (
            <GridItem key={review.id} item xs={11} sm={6} lg={4} xl={3}>
              <ReviewCard
                profile={true}
                title={review.title}
                movie={review.movie_title}
                description={review.description}
                rating={+review.rating}
                createdAt={review.created_at}
                reviewId={review.id}
              />
            </GridItem>
          ))}
        </GridContainer>
      )}
    </Wrapper>
  );
};

export default UserReviews;

const Wrapper = styled.div`
  height: 900px;
  overflow-y: scroll;
  padding: 0.7rem 0;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const GridContainer = styled(Grid)`
  && {
    padding: 0;
    justify-content: center;

    @media ${responsive.mobileM} {
      padding: 0 0.6rem;
      justify-content: flex-start;
    }
  }
`;

const GridItem = styled(Grid)`
  && {
    max-width: 275px;
  }
`;
