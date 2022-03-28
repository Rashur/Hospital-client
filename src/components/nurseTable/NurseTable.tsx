import * as React from 'react';
import {useEffect, useState} from 'react';
import axios from "axios";
import "./nurse-table.css";
import {
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    useTheme
} from '@mui/material';
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
    patientList: Patient[],
}

interface Patient {
    id: number,
    firstName: string,
    lastName: string,
    diagnosis: string,
    illnessDate: Date,
}


function Row(props: { row: Nurse, getAll: () => void }) {
    const {row} = props;

    const deleteNurse = async (id: number) => {
        await axios.delete(`http://localhost:8088/nurses/${id}`)
        props.getAll();
    }

    return (
            <TableRow>
                <TableCell align="left">{row.firstName}</TableCell>
                <TableCell align="left">{row.lastName}</TableCell>
                <TableCell align="right" component="th" scope="row">
                    <Tooltip title={"Edit"}>
                        <Link to={'/nurses/form'}
                              state={
                            {id: row.id, firstName: row.firstName, lastName: row.lastName, headOfForm: 'Update Nurse'}}>
                            <IconButton>
                                <EditIcon color='primary'/>
                            </IconButton>
                        </Link>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => deleteNurse(row.id)}>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
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
    const { count, page, rowsPerPage, onPageChange } = props;

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
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

export default function NurseTable() {

    const [nurses, getNurses] = useState<Nurse[]>([]);

    useEffect(() => {
        getAll()
    }, []);

    const getAll = async () => {
        await axios.get('http://localhost:8088/nurses')
            .then((response) =>  {
                const allNurses = response.data;
                getNurses(allNurses);
                console.log(allNurses);
            })
            .catch(error => console.error(`Error: ${error}`));
    }

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - nurses.length) : 0;

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
                    <TableCell className="table-head-cell" align="left">First name</TableCell>
                    <TableCell className="table-head-cell" align="left">Last name</TableCell>
                    <TableCell className="table-head-cell" align="right"> </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {(rowsPerPage > 0
                        ? nurses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : nurses
                ).map((nurse: Nurse) => (
                    <Row key={nurse.id} getAll={getAll} row={nurse}/>
                ))}
                {emptyRows > 0 && (
                    <TableRow style={{ height: 76.84 * emptyRows }}>
                        <TableCell colSpan={6} />
                    </TableRow>
                )}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={3}
                        count={nurses.length}
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