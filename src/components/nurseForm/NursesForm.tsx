import React, {ChangeEvent, useEffect, useState} from 'react';
import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import "./nurses-form.css";
import axios from "axios";
import {Link, useLocation, useNavigate} from "react-router-dom";

interface FormNurseProps {
    id: number,
    firstName: string,
    lastName: string,
    headOfForm: string,
}

const NursesForm = () => {
    const [nurseId, setNurseId] = useState<number | null>(null);
    const [nurseFirstName, setNurseFirstName] = useState<string>('')
    const [nurseLastName, setNurseLastName] = useState<string>('')
    const navigator = useNavigate()
    const location = useLocation();
    const formNurseProps: FormNurseProps = location.state as FormNurseProps;

    useEffect(() => {
        setNurseId(formNurseProps.id)
        setNurseFirstName(formNurseProps.firstName);
        setNurseLastName(formNurseProps.lastName);
    }, [formNurseProps])


    const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNurseFirstName(event.target.value)
    }

    const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNurseLastName(event.target.value)
    }

    const saveNurse = async () => {
        await axios.post('http://localhost:8088/nurses', {
            firstName: nurseFirstName,
            lastName: nurseLastName,
            patientIds: []
        }).then(() => {
            navigator('/nurses')
        })
    }

    const updateNurse = async () => {
      await axios.put(`http://localhost:8088/nurses/${nurseId}`, {
          id: nurseId,
          firstName: nurseFirstName,
          lastName: nurseLastName,
      }).then(() => {
          navigator('/nurses')
      })
    }

    return (
        <div className="nurse-form-container">
            <Box className="form-box">
                <PersonAddIcon color="primary" sx={{
                    display: 'flex',
                    margin: '0 auto',
                    fontSize: 40,
                }}/>
                <Stack spacing={2}>
                    <Typography className="form-header" variant="h3">{formNurseProps.headOfForm}</Typography>
                    <TextField onChange={handleFirstNameChange} value={nurseFirstName} className="input" id="outlined-basic" label="First name" variant="outlined"/>
                    <TextField onChange={handleLastNameChange} value={nurseLastName} className="input" id="outlined-basic" label="Last name" variant="outlined"/>
                </Stack>
                <Stack className="button-stack" direction="row" spacing={2}>
                    <Link style={{ textDecoration: 'none'}} to={'/nurses'}>
                        <Button variant="contained" color="inherit" sx={{maxWidth: 87.3}}>Cancel</Button>
                    </Link>
                       <Button onClick={nurseId === null ? saveNurse : updateNurse} variant="contained" sx={{maxWidth: 110}}>Submit</Button>
                </Stack>
            </Box>
        </div>
    );
};

export default NursesForm;