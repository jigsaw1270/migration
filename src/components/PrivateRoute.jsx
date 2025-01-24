import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './loader/Loader';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>
       <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    </div>;
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;