import React, { useEffect, useState } from 'react';
import Typography from 'components/Typography/Typography';
import styled from 'styled-components';
import Paper from '@mui/material/Paper';
import DoughnutChart from 'components/DoughnutChart/DoughnutChart';
import responsive from 'theme/responsive';
import LineChart from 'components/LineChart/LineChart';
import BarChart from 'components/BarChart/BarChart';
import axios from 'utils/axios';
import Spinner from 'components/Spinner/Spinner';

const UserStats = () => {
  const [myBaseData, setMyBaseData] = useState(null);
  const [myFavouriteGenres, setMyFavouriteGenres] = useState(null);
  const [myLastSpendings, setMyLastSpendings] = useState(null);
  const [rentalsNumber, setRentalsNumber] = useState(null);

  useEffect(async () => {
    const baseDataURL = axios.get('api/v1/myBaseStats');
    const favouriteGenresURL = axios.get('api/v1/myFavouriteGenres');
    const lastWeekRentalsNumberURL = axios.get(
      'api/v1/last-7-days-rentals-number'
    );
    const lastWeekSpendingURL = axios.get('api/v1/last-7-days-spendings');
    const [
      baseData,
      favouriteGenres,
      lastWeekRentalsNumber,
      lastWeekSpendings,
    ] = await Promise.all([
      baseDataURL,
      favouriteGenresURL,
      lastWeekRentalsNumberURL,
      lastWeekSpendingURL,
    ]);

    //* Setters
    setMyBaseData(baseData.data);
    setMyFavouriteGenres(favouriteGenres.data.data.slice(0, 6));
    setMyLastSpendings(lastWeekSpendings.data.data[0]);
    setRentalsNumber(lastWeekRentalsNumber.data.data[0]);
  }, []);

  return (
    <Wrapper>
      <Typography fontSize={24} fontWeight={700} marginBottom={4}>
        Statystyki
      </Typography>
      {!myBaseData && <Spinner />}
      {myBaseData && (
        <>
          <TopRow>
            <GeneralStats elevation={4}>
              <GeneralStatsHeading marginBottom={6} align="center">
                Ogólne Dane
              </GeneralStatsHeading>
              <TotalMoviesRented>
                <GeneralStatsHeaders>Łącznie wypożyczone</GeneralStatsHeaders>
                <Typography
                  align="center"
                  marginTop={0.5}
                  fontWeight={600}
                  fontSize={36}
                  color="#1465C0"
                >
                  {myBaseData.totalBorrowed || ''}
                </Typography>
              </TotalMoviesRented>

              <TotalExpanses>
                <TotalMoviesRented>
                  <GeneralStatsHeaders>Łącznie wydatki</GeneralStatsHeaders>
                  <Typography
                    align="center"
                    marginTop={0.5}
                    fontWeight={600}
                    fontSize={36}
                    color="#1465C0"
                  >
                    {myBaseData.payments || '-'} PLN
                  </Typography>
                </TotalMoviesRented>
              </TotalExpanses>
            </GeneralStats>

            <DoughnutChartWrapper elevation={4}>
              {myFavouriteGenres && <DoughnutChart data={myFavouriteGenres} />}
            </DoughnutChartWrapper>
          </TopRow>
          <BottomRow>
            <LineChartWrapper>
              {myLastSpendings && <LineChart data={myLastSpendings} />}
            </LineChartWrapper>
            <BarChartWrapper>
              {rentalsNumber && <BarChart data={rentalsNumber} />}
            </BarChartWrapper>
          </BottomRow>
        </>
      )}
    </Wrapper>
  );
};

export default UserStats;

const Wrapper = styled.div`
  min-height: 900px;
  padding: 0.7rem 0;
`;

const GeneralStats = styled(Paper)`
  && {
    width: max-content;
    padding: 1rem 2rem;
    font-size: ${({ theme }) => theme.fontSize.s};
    align-self: stretch;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media ${responsive.laptop} {
      width: 47%;
    }
  }
`;

const GeneralStatsHeading = styled(Typography)`
  && {
    font-size: ${({ theme }) => theme.fontSize.s};
    font-weight: ${({ theme }) => theme.fontBold};
    @media ${responsive.tablet} {
      font-size: ${({ theme }) => theme.fontSize.m};
    }
  }
`;

const GeneralStatsHeaders = styled(Typography)`
  && {
    text-align: center;
    margin-top: 0.5rem;
    font-size: ${({ theme }) => theme.fontSize.xs};

    @media ${responsive.mobileM} {
      font-size: ${({ theme }) => theme.fontSize.s};
    }

    @media ${responsive.laptop} {
      font-size: ${({ theme }) => theme.fontSize.m};
    }
  }
`;

const TotalMoviesRented = styled.div``;

const TotalExpanses = styled.div`
  margin-top: 1rem;
`;

const TopRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: auto;

  @media ${responsive.laptop} {
    justify-content: space-around;
  }
`;

const DoughnutChartWrapper = styled(Paper)`
  margin-top: 3rem;
  width: 100%;
  height: 300px;
  padding: 0.2rem 0.6rem;

  @media ${responsive.laptop} {
    width: 47%;
    height: 400px;
    padding: 1.4rem 1rem;
    margin-top: 0;
  }
`;

const BottomRow = styled.div`
  display: flex;
  margin-top: 5rem;
  flex-direction: column;
  align-items: stretch;
  padding: 0.1rem 0.3rem;

  @media ${responsive.laptop} {
    justify-content: space-around;
    align-items: stretch;
    flex-direction: row;
    padding: 1.4rem 1rem;
  }
`;

const LineChartWrapper = styled.div`
  width: 100%;
  height: 300px;

  @media ${responsive.laptop} {
    width: 47%;
  }
`;

const BarChartWrapper = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 4rem;

  @media ${responsive.laptop} {
    width: 47%;
    margin-top: 0;
  }
`;
