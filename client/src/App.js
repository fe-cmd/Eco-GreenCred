import { BrowserRouter,Routes,Route} from 'react-router-dom';
import './App.css';
import React from 'react';
import Home from './Pages/Home';
import ScrollToTopButton from './Pages/ScrollToTopButton';
import Teams from './Pages/Teams';
import Contact from './Pages/Contact';
import LoginSignup from './Pages/LoginSignup';
import Onboard from './Pages/Onboard';
import Mode from './Pages/Mode';
import AdminLogin from './Pages/AdminLogin';
import Dashboard from './Pages/Dashboard';
import LogActivityStart from './Pages/LogActivityStart';
import Redeem from './Pages/Redeem';
import UploadActivity from './Pages/UploadActivity';
import ViewProgress from './Pages/ViewProgress';
import AdminDashboard from './Pages/AdminDashboard';
import AdminUploadReview from './Pages/AdminUploadReview';
import Leaderboard from './Pages/Leaderboard';
import EarningInfo from './Pages/EarningInfo';
import Partner from './Pages/Partner';
import QuizIntro from './Pages/QuizIntro';
import QuizPage from './Pages/QuizPage';
import QuizResultPage from './Pages/QuizResultPage';






function App() {
  return (
    <div>
      <BrowserRouter>

      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/teams_expertise" element={<Teams />} />
      <Route path="/company_contacts" element={<Contact />} />
      <Route path="/auth" element={<LoginSignup />} />
      <Route path='/page-loading' element={<Onboard/>}/>
      <Route path='/modeselect' element={<Mode/>}/>
      <Route path='/admin_auth' element={<AdminLogin/>}/>
      <Route path='/dashboard/:username' element={<Dashboard/>}/>
      <Route path='/log-activity/:username/start' element={<LogActivityStart/>}/>
      <Route path='/rewards/:username/start' element={<Redeem/>}/>
      <Route path='/partner/:username/start' element={<Partner/>}/>
      <Route path="/log-activity/:username/upload" element={<UploadActivity />} />
      <Route path="/progress/:username" element={<ViewProgress />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
      <Route path="/admin/user/:username/upload/:uploadId" element={<AdminUploadReview />} />
      <Route path="/leaderboard/:username" element={<Leaderboard />} />
      <Route path="/rewards/:username/earn" element={<EarningInfo />} />
      <Route path="/quiz-intro/:username" element={<QuizIntro />} />
      <Route path="/quiz/:username/start" element={<QuizPage />} /> {/* your quiz interface */}
      <Route path="/quiz/:username/result" element={<QuizResultPage />} />











      </Routes>
      <ScrollToTopButton /> 

      </BrowserRouter>

    </div>
  );
}

export default App;
