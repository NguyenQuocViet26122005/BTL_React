import { Navigate, useLocation } from 'react-router-dom';

const JobFilterPage = () => {
  const location = useLocation();
  const query = location.search || '';
  return <Navigate to={`/jobs${query}`} replace />;
};

export default JobFilterPage;
