import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {Route, Routes} from "react-router-dom";
import NursePage from "./pages/nursePage/NursePage";
import NurseFormPage from "./pages/nurseFormPage/NurseFormPage";
import PatientFormPage from "./pages/patientFormPage/PatientFormPage";
import PatientPage from "./pages/patientPage/PatientPage";

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path={'/'} element={<App />}/>
            <Route path={'/patients'} element={<PatientPage/>}/>
            <Route path={'/nurses'} element={<NursePage/>}/>
            <Route path={'/nurses/form'} element={<NurseFormPage/>}/>
            <Route path={'/patients/form'} element={<PatientFormPage/>}/>
        </Routes>
    </BrowserRouter>,
  document.getElementById('root')
);

