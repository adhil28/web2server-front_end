import './App.css';
import axios from 'axios'
import { Button, CircularProgress, TextField } from '@mui/material';
import { useState } from 'react';
import logo from './logo.png';

import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
function App() {
  const [showLoading, setShowloading] = useState(false)
  const [loadingText, setloadingText] = useState('Building')
  const [percent, setpercent] = useState('0')
  const [downloading, setdownloading] = useState(false)
  let name, site, logo_link;

  const firebaseConfig = {
    apiKey: "AIzaSyAf03E1R4ScJueYzYDq1NY0v6c6E8ppu1g",
    authDomain: "web2linux.firebaseapp.com",
    projectId: "web2linux",
    storageBucket: "web2linux.appspot.com",
    messagingSenderId: "351952684565",
    appId: "1:351952684565:web:e87fd85d94ad3cc5ccf01c",
    measurementId: "G-HP9F4JQTP5"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);


  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
  };


  return (
    <center style={{ margin: '50px' }} >
      {showLoading ?
        <div>
          <h2>Building in progress. It may take more than 5 minute please do not leave the site.</h2>
          <img alt='logo' style={{ height: '250px', marginTop: ((window.innerHeight / 2) - 300) + 'px' }} src='https://i.pinimg.com/originals/9b/0a/9c/9b0a9c1c9f8cfc6d77a31fea93d4bc2a.gif' />
          <h2>{loadingText}</h2>
          {downloading ? <LinearProgressWithLabel value={percent} /> : <div></div>}
        </div> : <div>
          <img alt='logo' style={{ marginTop: ((window.innerHeight / 2) - 270) + 'px', width: '150px' }} src={logo} />
          <h3 style={{ textTransform: 'uppercase' }}>Convert your website to linux app</h3>
          <TextField onChange={(e) => {
            name = e.target.value
          }} label="Name of your app" fullWidth />
          <TextField  onChange={(e) => {
            site = e.target.value
          }} style={{ marginTop: '10px' }} label="Website link" fullWidth />
         
          <Button onClick={() => {
            if (name != null && site != null) {
              setShowloading(true)
              axios.post('https://web2linux.herokuapp.com/gen', { site, name, logo: logo_link }, {
                responseType: 'blob', onDownloadProgress: (progressEvent) => {
                  setloadingText('Downloading')
                  setdownloading(true)
                  let downloadCount = {
                    timeStamp: progressEvent.timeStamp,
                    total: progressEvent.total,
                    loaded: progressEvent.loaded
                  }
                  let percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );
                  setpercent(percentCompleted);

                }, timeout: (1000 * 60 * 5), withCredentials: false, headers: { 'Access-Control-Allow-Origin': 'https://web2linux.web.app' }
              }).then((res) => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'linux.zip');
                document.body.appendChild(link);
                name = ''
                site = ''
                link.click();
                setTimeout(() => {
                  setpercent('0');
                  setloadingText('Building')
                  setdownloading(false)
                  setShowloading(false)
                }, 1000 * 3);
              }).catch((e) => {
                console.log(e);
                setShowloading(false)
              })
            } else {
              alert('Enter name and website link')
            }
          }} variant="contained" fullWidth style={{ marginTop: '10px', padding: '10px' }}>Generate linux app</Button>
        </div>}
    </center>
  );
}

export default App;
