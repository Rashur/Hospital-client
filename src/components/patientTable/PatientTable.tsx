import * as React from 'react';
import {useEffect, useState} from 'react';
import axios from "axios";
import "./patient-table.css";
import {
    Box,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {KeyboardArrowLeft, KeyboardArrowRight} from "@mui/icons-material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import {Link} from "react-router-dom";

interface Nurse {
    id: number,
    firstName: string,
    lastName: string,
}

interface Patient {
    id: number,
    firstName: string,
    lastName: string,
    diagnosis: string,
    illnessDate: Date,
    nurseList: Nurse[],
}


function Row(props: { row: Patient, getAll: () => void }) {
    const {row} = props;
    const [open, setOpen] = React.useState(false);

    const deletePatient = async (id: number) => {
        await axios.delete(`http://localhost:8088/patients/${id}`)
        props.getAll();
    }

    const removeNurseFromPatient = async (deletingNurse: Nurse, patient: Patient) => {
        patient.nurseList = patient.nurseList.filter((nurse) => {
            return nurse.id !== deletingNurse.id;
        })
        console.log(patient.nurseList)
        await axios.put(`http://localhost:8088/patients/${patient.id}`, {
            id: patient.id,
            firstName: patient.firstName,
            lastName: patient.lastName,
            diagnosis: patient.diagnosis,
            illnessDate: patient.illnessDate,
            nurseIds: patient.nurseList.map(nurse => nurse.id),
        });
        props.getAll();
    }

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell align="left">{row.firstName}</TableCell>
                <TableCell align="left">{row.lastName}</TableCell>
                <TableCell align="left">{row.diagnosis}</TableCell>
                <TableCell align="left">{row.illnessDate}</TableCell>
                <TableCell component="th" scope="row">
                    <Tooltip title={"Edit"}>
                        <Link to={'/patients/form'} state={{
                            id: row.id,
                            firstName: row.firstName,
                            lastName: row.lastName,
                            diagnosis: row.diagnosis,
                            nurseList: row.nurseList,
                            headOfForm: 'Update patient',
                        }}>
                            <IconButton>
                                <EditIcon color='primary'/>
                            </IconButton>
                        </Link>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => deletePatient(row.id)}>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Typography variant="h6" gutterBottom component="div">
                                Nurses
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>First name</TableCell>
                                        <TableCell>Last name</TableCell>
                                        <TableCell align="right"/>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.nurseList.map((nurseRow) => (
                                        <TableRow key={nurseRow.id}>
                                            <TableCell component="th" scope="row">{nurseRow.firstName}</TableCell>
                                            <TableCell component="th" scope="row">{nurseRow.lastName}</TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        onClick={() => removeNurseFromPatient(nurseRow, row)}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const {count, page, rowsPerPage, onPageChange} = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{flexShrink: 0, ml: 2.5}}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/>}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/>}
            </IconButton>
        </Box>
    );
}

export default function PatientTable() {

    const [patients, setPatients] = useState<Patient[]>([]);

    useEffect(() => {
        getAllPatients()
    }, []);

    const getAllPatients = async () => {
        await axios.get('http://localhost:8088/patients')
            .then((response) => {
                const allPatients = response.data;
                setPatients(allPatients);
                console.log(allPatients);
            })
            .catch(error => console.error(`Error: ${error}`));
    }

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - patients.length) : 0;

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Table className="table" style={{
            width: 900, height: 500
        }} aria-label="custom pagination table">
            <TableHead className="table-head">
                <TableRow>
                    <TableCell/>
                    <TableCell className="table-head-cell" align="left">First name</TableCell>
                    <TableCell className="table-head-cell" align="left">Last name</TableCell>
                    <TableCell className="table-head-cell" align="left">Diagnosis</TableCell>
                    <TableCell className="table-head-cell" align="left">Illness date</TableCell>
                    <TableCell className="table-head-cell" align="right"> </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {(rowsPerPage > 0
                        ? patients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : patients
                ).map((patient: Patient) => (
                    <Row key={patient.id} getAll={getAllPatients} row={patient}/>
                ))}
                {emptyRows > 0 && (
                    <TableRow style={{height: 76.84 * emptyRows}}>
                        <TableCell colSpan={6}/>
                    </TableRow>
                )}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, {label: 'All', value: -1}]}
                        colSpan={3}
                        count={patients.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                            inputProps: {
                                'aria-label': 'rows per page',
                            },
                            native: true,
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                    />
                </TableRow>
            </TableFooter>
        </Table>
    );
}