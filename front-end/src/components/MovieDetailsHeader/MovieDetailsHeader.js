import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@mui/material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Typography from 'components/Typography/Typography';
import responsive from 'theme/responsive';
import ProcessingSpinner from 'components/ProcessingSpinner/ProcessingSpinner';
import Cookies from 'js-cookie';

const MovieDetailsHeader = ({
  rentMovieFn,
  title,
  time,
  releaseYear,
  cost,
  poster,
  processing,
  ownedByUser,
  user,
}) => {
  return (
    <Wrapper>
      <Header>
        <MovieTitle>{title}</MovieTitle>
        <MovieHeaderInfo>
          <Time>
            <MovieTime></MovieTime>
            <Typography fontWeight={700} color={'#fff'} fontSize={24}>
              {time}m
            </Typography>
          </Time>
          <ReleaseDate>
            <MovieReleaseDate></MovieReleaseDate>
            <Typography fontWeight={700} color={'#fff'} fontSize={24}>
              {releaseYear}
            </Typography>
          </ReleaseDate>
        </MovieHeaderInfo>
        <MovieCost>
          <MovieCostIcon></MovieCostIcon>
          <Typography fontWeight={700} color={'#fff'} fontSize={24}>
            {cost} zł/48h
          </Typography>
        </MovieCost>
        <HeaderAction>
          {ownedByUser || user?.role === 'administrator' ? (
            <HeaderButton disabled variant="contained">
              Zamów teraz!
            </HeaderButton>
          ) : Cookies.get('token') ? (
            <HeaderButton onClick={rentMovieFn} variant="contained">
              Zamów teraz!
              {processing ? <ProcessingSpinner /> : ''}
            </HeaderButton>
          ) : (
            <HeaderButton
              variant="contained"
              LinkComponent={Link}
              to="/logowanie"
            >
              Zaloguj się aby zamówić
            </HeaderButton>
          )}
        </HeaderAction>
        <HeaderImage src={`http://127.0.0.1:8000/images/movies/${poster}`} />
        <ImageOverlay></ImageOverlay>
      </Header>
    </Wrapper>
  );
};

export default MovieDetailsHeader;

const Wrapper = styled.div`
  width: 100%;
  height: 75vh;
  position: relative;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 9vw), 0 100%);
  -webkit-clip-path: polygon(0 0, 100% 0, 100% calc(100% - 9vw), 0 100%);
`;

const Header = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  inset: 0;
`;

const HeaderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 25%;
  z-index: -1;
`;

const ImageOverlay = styled.div`
  background: rgb(67, 65, 88);
  background: linear-gradient(
    90deg,
    rgba(67, 65, 88, 0.6674019949776786) 0%,
    rgba(63, 63, 133, 0.6786064767703957) 35%,
    rgba(47, 133, 150, 0.6505952722886029) 100%
  );
  position: absolute;
  inset: 0;
  height: 100%;
`;

const MovieTitle = styled(Typography)`
  && {
    color: ${({ theme }) => theme.secondaryLight};
    position: absolute;
    z-index: 2;
    left: 0;
    right: 0;
    text-align: center;
    top: 15%;
    text-decoration: underline;
    font-size: ${({ theme }) => theme.fontSize.md};
    font-weight: ${({ theme }) => theme.fontBold};
    padding: 0 1rem;

    @media ${responsive.mobile} {
      top: 10%;
      font-size: ${({ theme }) => theme.fontSize.lg};
    }

    @media ${responsive.laptop} {
      font-size: ${({ theme }) => theme.fontSize['3xl']};
    }
  }
`;

const MovieHeaderInfo = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 35%;
  z-index: 2;
  display: flex;
  justify-content: space-around;

  @media ${responsive.tablet} {
    top: 30%;
    width: 500px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Time = styled.div`
  display: flex;
  align-items: center;
`;

const MovieTime = styled(AccessTimeOutlinedIcon)`
  && {
    color: #85b6ff;
    font-size: 2.5rem;
    margin-right: 0.4rem;
  }
`;

const ReleaseDate = styled.div`
  display: flex;
  align-items: center;
`;

const MovieReleaseDate = styled(CalendarMonthIcon)`
  && {
    color: #85b6ff;
    font-size: 2.5rem;
    margin-right: 0.4rem;
  }
`;

const MovieCost = styled.div`
  position: absolute;
  left: 0%;
  right: 0%;
  top: 45%;
  transform: translateX(-50);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
`;

const MovieCostIcon = styled(AttachMoneyIcon)`
  && {
    color: #85b6ff;
    font-size: 2.5rem;
    margin-right: 0.4rem;
  }
`;

const HeaderAction = styled.div`
  position: absolute;
  top: 60%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 2;
  margin-top: 3rem;

  @media ${responsive.mobileM} {
    margin-top: 1.4rem;
  }
`;

const HeaderButton = styled(Button)`
  && {
    font-family: 'Poppins';

    @media ${responsive.tablet} {
      font-size: ${({ theme }) => theme.fontSize.m};
    }
  }
`;

MovieDetailsHeader.propTypes = {
  rentMovieFn: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  releaseYear: PropTypes.string.isRequired,
  cost: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  processing: PropTypes.bool,
  ownedByUser: PropTypes.bool,
  user: PropTypes.object,
};
