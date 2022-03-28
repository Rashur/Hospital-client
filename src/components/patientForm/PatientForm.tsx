import React, {ChangeEvent, useEffect, useState} from 'react';
import {
    Box,
    Button, Chip,
    FormControl, InputLabel, MenuItem, OutlinedInput, Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Theme,
    Typography,
    useTheme,
    Autocomplete, ListItem
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {Link, useLocation, useNavigate} from "react-router-dom";
import './patient-form.css'
import axios from "axios";

interface Nurse {
    id: number,
    firstName: string,
    lastName: string,
}

interface FormPatientProps {
    id: number,
    firstName: string,
    lastName: string,
    diagnosis: string,
    nurseList: Nurse[],
    headOfForm: string,
}

const PatientForm = () => {
    const [nurses, setNurses] = useState<Nurse[]>([]);
    const [patientId, setPatientId] = useState<number | null>(null);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [diagnosis, setDiagnosis] = useState<string>('')
    const [selectedNurse, setSelectedNurse] = useState<number[]>([]);
    const navigator = useNavigate();
    const location = useLocation();
    const formPatientProps: FormPatientProps = location.state as FormPatientProps;

    useEffect(() => {
        getAll();
    }, []);

    useEffect(() => {
        console.log(formPatientProps)
        setPatientId(formPatientProps.id);
        setFirstName(formPatientProps.firstName);
        setLastName(formPatientProps.lastName);
        setDiagnosis(formPatientProps.diagnosis);
    }, [formPatientProps])

    const getAll = async () => {
        await axios.get<Nurse[]>('http://localhost:8088/nurses')
            .then((response) =>  {
                const allNurses = response.data;
                setNurses(allNurses);
                console.log(allNurses);
            })
            .catch(error => console.error(`Error: ${error}`));
    }

    const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value);
    }

    const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value);
    }

    const handleDiagnosisChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDiagnosis(event.target.value);
    }

    const handleNurseChange = (event: any, arg2: Nurse[]) => {
        setSelectedNurse(arg2.map(nurse => nurse.id));
    };

    const savePatient = async () => {
        await axios.post('http://localhost:8088/patients', {
            firstName: firstName,
            lastName: lastName,
            diagnosis: diagnosis,
            nurseIds: selectedNurse,
        }).then(() => {
            navigator('/patients')
        })
    }

    const updateNurse = async () => {
        console.log(selectedNurse);
        await axios.put(`http://localhost:8088/patients/${patientId}`, {
            id: patientId,
            firstName: firstName,
            lastName: lastName,
            diagnosis: diagnosis,
            nurseIds: selectedNurse,
        }).then(() => {
            navigator('/patients')
        })
    }

    return (
        <div className="patient-form-container">
            <Box className="form-box">
                <PersonAddIcon color="primary" sx={{
                    display: 'flex',
                    margin: '0 auto',
                    fontSize: 40,
                }}/>
                <Stack spacing={2}>
                    <Typography className="form-header" variant="h3">{formPatientProps.headOfForm}</Typography>
                    <TextField className="input" id="outlined-basic" value={firstName} label="First name" onChange={handleFirstNameChange} variant="outlined"/>
                    <TextField className="input" id="outlined-basic" value={lastName} label="Last name" onChange={handleLastNameChange} variant="outlined"/>
                    <TextField className="input" id="outlined-basic" value={diagnosis} label="Diagnosis" onChange={handleDiagnosisChange} variant="outlined"/>
                    <FormControl sx={{m: 1, width: 468}}>
                        <Autocomplete
                            multiple
                            disableClearable
                            disableCloseOnSelect
                            options={nurses}
                            filterSelectedOptions
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`
                            }
                            onChange={handleNurseChange}
                            renderOption={(props, option) => {
                                return (
                                    <ListItem {...props}>
                                        {option.firstName} {option.lastName}
                                    </ListItem>
                                )
                            }}
                            renderInput={(params) => (
                                <TextField label={'Nurses'} {...params}/>
                            )
                            }
                        />
                    </FormControl>
                </Stack>
                <Stack className="button-stack" direction="row" spacing={2}>
                    <Link style={{textDecoration: 'none'}} to={'/patients'}>
                        <Button variant="contained" color="inherit" sx={{maxWidth: 87.3}}>Cancel</Button>
                    </Link>
                    <Button variant="contained" onClick={
                        patientId === null ? savePatient : updateNurse
                    } sx={{maxWidth: 110}}>Submit</Button>
                </Stack>
            </Box>
        </div>
    );
};

export default PatientForm;