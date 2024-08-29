import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header_log3';
import Footer from './footer';
import '../components/afterlogin.css';
import { useForm } from 'react-hook-form';

function Afterlogin() {
  const navigate = useNavigate();
  const [universityData, setUniversityData] = useState([]);

  const { register, handleSubmit, setError } = useForm();

  useEffect(() => {
    fetch('/University.json')
      .then(response => response.json())
      .then(data => setUniversityData(data))
      .catch(error => console.error('Error fetching the university data:', error));
  }, []);

  const handleNavigation1 = async () => {
    try {
      const response = await fetch("http://localhost:3001/pending", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const result = await response.text();
      if (result.includes('Invalid Userid And Password')) {
        setError('t1', { type: 'manual', message: 'Invalid credentials' });
      } else {
        navigate('/Studentdetails');
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const handleNavigation2 = () => {
    navigate('/Delete');
  };

  const handleNavigation3 = () => {
    navigate('/Queform');
  };

  const handleNavigation4 = () => {
    navigate('/Allstudent');
  };

  const handleNavigation5 = () => {
    navigate('/Activate');
  };

  const handleNavigation6 = () => {
    navigate('/Edit');
  };

  const handleNavigation9 = () => {
    navigate('/Notes');
  };

  const handleNavigation7 = () => {
    navigate('/Recharge');
  };

  const handleNavigation8 = () => {
    navigate('/Universitydashboard');
  };

  

  return (
    <div>
      <Header />
      <div id='main'>
        {universityData.length > 0 ? (
          <div className='university-card'>
            <center>
              <h1>Welcome to {universityData[0].institute} Panel</h1>
              <h3> ID:{universityData[0].instituteID} </h3>


            </center>
            <h3 style={{ textAlign: 'right' }}>Established year : {universityData[0].year}</h3>
            <center>
              <h1> Course: {universityData[0].programlist}</h1>
            </center>
          
            <div className='afterlogin'>



              <div className='afterloginbtn' onClick={handleNavigation3}>
                <h1>🖊️</h1>
                <div id='Result'>
                  POST QUESTIONS
                  <p>MCQ</p>
                </div>
              </div>



              <div className='afterloginbtn2' onClick={handleNavigation6}>
                <h1>📚</h1>
                <div id='Result'>
                EDIT QUESTIONS
                <p>MCQ</p>
                </div>
              </div>



              <div className='afterloginbtn3' onClick={handleNavigation2}>
                <h1>🚮</h1>
                <div id='Result'>
                  DELETE QUESTIONS
                  <p>MCQ</p>
                </div>
              </div>




            </div>




            <div className='afterlogin'>



              <div className='afterloginbtn2' onClick={handleNavigation4}>
                <h1>👨‍🎓</h1>
                <div id='Result'>
                  REGISTERED
                  <p>STUDENT</p>
                </div>
              </div>
              



              <div className='afterloginbtn' onClick={handleNavigation5}>
                <h1>👨‍🎓/🔐</h1>
                <div id='Result'>
                  ACTIVE / DEACTIVE
                  <p>ACCOUNT</p>
                </div>
              </div>

              <div className='afterloginbtn2' onClick={handleNavigation1}>
                <h1>📚</h1>
                <div id='Result'>
                  PENDING
                  <p>REQUEST</p>
                </div>
              </div>


              </div>







              <div className='afterlogin'>



<div className='afterloginbtn' onClick={handleNavigation7} >
  <h1>💲</h1>
  <div id='Result'>
    RECHARGE
    <p>PLANS</p>
  </div>
</div>



<div className='afterloginbtn2' onClick={handleNavigation8}>
  <h1>🎒</h1>
  <div id='Result'>
  DASHBOARD
  <p>TEACHER</p>
  </div>
</div>



<div className='afterloginbtn3' onClick={handleNavigation9}>
  <h1>🧑‍🏫</h1>
  <div id='Result'>
    ADD NOTES
    <p> VIDEO LECTURE</p>
  </div>
</div>




</div>




          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Afterlogin;
