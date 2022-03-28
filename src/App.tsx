import React from 'react';
import Header from "./components/header/Header";
import NursesForm from "./components/nurseForm/NursesForm";
import AddButton from "./components/addButton/AddButton";

const App = () => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.boxSizing = 'border-box'
    document.body.style.fontFamily = 'Ubuntu, sans-serif'

  return (
      <div>
          <Header/>
      </div>
  );
};

export default App;

