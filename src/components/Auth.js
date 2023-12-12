import React, { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { useNavigate } from "react-router-dom";

function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = useState(false);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequest = async (type = "login") => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/user/${type}`,
        {
          name: inputs.name,
          email: inputs.email,
          password: inputs.password,
        }
      );

      const data = response.data;
      console.log("Request successful. Response data:", data);
      return data;
    } catch (error) {
      console.error(
        "Error in sendRequest:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (isSignup) {
        const signupData = await sendRequest("signup");
        console.log(signupData);
        const userId = signupData.user._id;
  
        if (!userId) {
          throw new Error('User ID is undefined');
        }
  
        localStorage.setItem("userId", userId);
        await dispatch(authActions.login());
        navigate("/blogslist");
  
        console.log("Signup successful. User ID:", userId);
      } else {
        const loginData = await sendRequest();
        console.log(loginData);
  
        const userId = loginData.userId;
        localStorage.setItem("userId", userId);
        await dispatch(authActions.login());
        navigate("/blogslist");
  
        console.log("Login successful. User ID:", userId);
      }
    } catch (error) {
      console.error("Error during authentication:", error.message);
      
    }
  };
  
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          maxWidth={400}
          flexDirection={"column"}
          alignItems="center"
          justifyContent="center"
          boxShadow="10px 10px 20px #ccc"
          padding={3}
          margin="auto"
          marginTop={10}
          borderRadius={5}
          marginLeft="20"
        >
          <Typography variant="h2" padding={3} textAlign="center"
           style={{ fontFamily: 'YourCustomFont', fontSize: '54px', fontWeight: 'bold', color: '#000' }}>
            {isSignup ? "Signup" : "Login"}
          </Typography>
          {isSignup && (
            <TextField
              name="name"
              onChange={handleChange}
              value={inputs.name}
              placeholder="Name"
              margin="normal"
              fontFamily= 'YourCustomFont'
              
            />
          )}
          <TextField
            name="email"
            value={inputs.email}
            onChange={handleChange}
            placeholder="Email"
            type={"email"}
            margin="normal"
            fontFamily= 'YourCustomFont'
          />
          <TextField
            name="password"
            value={inputs.password}
            onChange={handleChange}
            placeholder="Password"
            type={"password"}
            margin="normal"
            fontFamily= 'YourCustomFont'
          />
          <Button
            type="submit"
            sx={{ borderRadius: "3", marginTop:2 ,backgroundColor: '#000' ,  color: '#fff', fontFamily:'YourCustomFont',fontSize: '18px', fontWeight: 'bold', fontWeight: 'bold',  '&:hover': {
              backgroundColor: 'warning.dark'  
            },}}
            color="warning"
          >
            Submit
          </Button>
          <Button
            onClick={() => setIsSignup(!isSignup)}
            sx={{ borderRadius: "3", marginTop:2,color:'#000', fontWeight:'bold',fontFamily: 'YourCustomFont',fontSize: '18px', fontWeight: 'bold',}}
          >
            Change to {isSignup ? "Login" : "Signup"}
          </Button>
        </Box>
      </form>
    </div>
  );
}

export default Auth;
