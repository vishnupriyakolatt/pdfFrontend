import { Routes,Route } from "react-router-dom";
import Header from "./components/Header";
import React from "react";
import Auth from './components/Auth'

import { useSelector } from 'react-redux';
import AddPdf from "./components/AddPdf";
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Allpdf from "./components/Allpdf";
import PdfComp from "./components/PdfComp";


function App() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn); 
  console.log(isLoggedIn);
  return (
 <React.Fragment>
  <header>
  <Header/>
  </header>
  <main>
    <Routes>
      <Route path="/" element={<Auth/>}/>
      <Route path="/blogslist" element={<Allpdf/>}/>
      <Route path="/blogslist/add" element={<AddPdf/>}/>
      <Route path="/blogslist/:id" element={<PdfComp/>}/>
    </Routes>

  </main>



 </React.Fragment>
  );
}

export default App;
