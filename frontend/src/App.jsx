import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';                           // Optional utility classes
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS
import  './ToastMessage.css';
import { ProfileProvider } from './context/ProfileContext';
import HomePageMock from './Pages/HomePageMock';
import Login from './Pages/login/Login';
import LandingPage from './Pages/Signup/LandingPage';
import SignupUser from './Pages/Signup/SignupUser';
import SignupProvider from './Pages/Signup/SignupProvider';
import UserLandingPage from './Pages/UserLandingPage/UserLandingPage';
import UserDetails from './Pages/UserDetails';
import User_details from './Pages/AdditionalDetails/User_details';
import Provider_details from './Pages/AdditionalDetails/Provider_details';
import Hero from './Pages/ServiceLandingpages/Hero.jsx';
import ServiceDetails from './Pages/ServiceDetail/ServiceDetails.jsx';
import BookPage from './Pages/ProviderBookingByUser/BookPage.jsx';
import PaymentPage from './Pages/Payment/PaymentPage.jsx';
import AdminPanel from './Pages/Admin/AdminPannel.jsx';
import SearchResults from './Pages/SearchResults.jsx';


const App = () => {
  return (
    <ProfileProvider>
      <Router>
         {/* Enhanced ToastContainer with custom styling from ToastMessage.jsx */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="custom-toast-container"
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"
          progressClassName="custom-progress"
          closeButtonStyle={{
            color: '#64748b',
            opacity: 0.7
          }}
        />
        <Routes>
          <Route path="/sample" element={<HomePageMock />} />
          <Route path="/" element={<UserLandingPage />} />
          <Route path="/userDetails" element={<UserDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<LandingPage />} />
          <Route path="/signup/user" element={<SignupUser />} />
          <Route path="/signup/provider" element={<SignupProvider />} />
          <Route path="/additional-details/user" element={<User_details />} />
          <Route path="/additional-details/provider" element={<Provider_details/>} />
          <Route path="/hero" element={<Hero/>} />
          <Route path='/serviceDetails/:serviceName' element={<ServiceDetails/>} />
          <Route path='/book' element={<BookPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </Router>
    </ProfileProvider>
  );
};

export default App;