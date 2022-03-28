import React from 'react';
import Header from "../../components/header/Header";
import AddButton from "../../components/addButton/AddButton";
import PatientTable from "../../components/patientTable/PatientTable";

const PatientPage = () => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.boxSizing = 'border-box';
    document.body.style.fontFamily = 'Ubuntu, sans-serif';

    return (
        <div>
            <Header/>
            <PatientTable/>
            <AddButton state={{id: null, firstName: '', lastName: '', diagnosis: '', nurseList: [], headOfForm: 'Add Patient'}} link='/patients/form'/>
        </div>
    );
};

export default PatientPage;