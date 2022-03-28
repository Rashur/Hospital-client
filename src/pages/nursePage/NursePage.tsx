import * as React from 'react';
import Header from "../../components/header/Header";
import NurseTable from "../../components/nurseTable/NurseTable";
import AddButton from "../../components/addButton/AddButton";

const NursePage = () => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.boxSizing = 'border-box'
    document.body.style.fontFamily = 'Ubuntu, sans-serif'

    return (
        <div>
            <Header/>
            <NurseTable/>
            <AddButton state={{id: null, firstName: '', lastName: '', headOfForm: 'Add nurse'}} link='/nurses/form'/>
        </div>
    );
}

export default NursePage;