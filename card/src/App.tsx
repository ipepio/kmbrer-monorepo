import { RouterProvider } from 'react-router-dom';
import router from '@/config/router';

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
