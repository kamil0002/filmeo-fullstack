import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminPanel from './dashboardViews/AdminPanel';
import UserMovies from './dashboardViews/UserMovies';
import UserReviews from './dashboardViews/UserReviews';
import UserStats from './dashboardViews/UserStats';
import UserSettings from './dashboardViews/UserSettings';
import DashboardTemplate from 'templates/DashboardTemplate';
import axios from 'utils/axios';
import clearAsyncMessages from 'utils/clearAsyncMessages';
import Alert from 'components/Alert/Alert';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  const [currentView, setCurrentView] = useState(
    user?.role === 'administrator' ? 'admin' : 'movies'
  );
  const { search } = useLocation();
  const [errMessage, setErrMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleCurrentViewChange = (newView) => setCurrentView(newView);

  useEffect(async () => {
    //* Transaction
    try {
      if (search.length !== 0) {
        const searchParams = new URLSearchParams(search);
        console.log(searchParams);

        const movieId = +searchParams.get('movie');
        const rentalId = +searchParams.get('rental');
        console.log(movieId, rentalId);
        const res = await axios.patch('api/v1/renewRental', {
          movieId,
          rentalId,
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

  return (
    <>
      {errMessage && <Alert>{errMessage}</Alert>}
      {successMessage && <Alert type="success">{successMessage}</Alert>}
      <DashboardTemplate
        handleViewChange={handleCurrentViewChange}
        currentView={currentView}
      >
        {currentView === 'movies' && <UserMovies />}
        {currentView === 'reviews' && <UserReviews />}
        {currentView === 'stats' && <UserStats />}
        {currentView === 'settings' && <UserSettings />}
        {currentView === 'admin' && <AdminPanel />}
      </DashboardTemplate>
    </>
  );
};

export default Dashboard;
