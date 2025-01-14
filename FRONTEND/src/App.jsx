import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Components/Home/Home"
import Login_Signup from "./Components/Authentication/Login_Signup/Login_Signup";
import Forgot_Password from "./Components/Authentication/Forgot_Password/Forgot_Password";
import Reset_Password from "./Components/Authentication/Reset_Password/Reset_Password"
import Form_Page from "./Components/Form_Generation/Form_Page/Form_Page";
import Edit_Form from "./Components/Form_Generation/Edit_Form/Edit_Form"
import Form_submission from "./Components/Form_Submission/Form_submission";
import Footer from "./Components/Footer/Footer";
import All_submissions from "./Components/Form_Generation/All_submissions/All_submissions"
import { useState, useEffect } from "react";
import IndividualResponse from "./Components/Form_Generation/IndividualResponse/IndividualResponse";
import Verify_Otp from "./Components/Authentication/Verify_otp/Verify_Otp";

function App() {
  const [quesOrRes, setQuesOrRes] = useState(true)
  const [copyrightClass, setCopyrightClass] = useState('copyright');
  const location = useLocation();
  
  useEffect(() => {
    const path = location.pathname;
    setCopyrightClass(path === '/login_signup' ? 'copyrightLoginSignup' : 'copyright');
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login_signup" element={<Login_Signup/> } />
        <Route path="/verify_otp/:email" element={<Verify_Otp />} />
        <Route path="/forgot_password" element={<Forgot_Password />} />
        <Route path="/reset_password/:token" element={<Reset_Password />} />
        <Route path="/form" element={<Form_Page />} />
        <Route path="/form/:formId/edit" element={<Edit_Form quesOrRes={quesOrRes} setQuesOrRes={setQuesOrRes}/>} />
        <Route path="/form/:formId/response" element={<Form_submission />} />
        <Route path="/form/:formId/allSubmissions" element={< All_submissions quesOrRes={quesOrRes} setQuesOrRes={setQuesOrRes}/>} />
        <Route path="/form/:formId/:userId/individualResponse" element={< IndividualResponse/>} />
      </Routes>
      <Footer copyrightClass={copyrightClass} />
    </>
  );
}

export default App;