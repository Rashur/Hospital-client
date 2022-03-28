import React from 'react';
import AddIcon from "@mui/icons-material/Add";
import {Fab, Tooltip} from "@mui/material";
import "./add-button.css"
import {Link} from "react-router-dom";

const AddButton = (props: { link: string, state: {} }) => {
    return (
        <div className="fab-button">
            <Link to={props.link} state={props.state}>
                <Tooltip title="Add" placement="top" arrow>
                    <Fab color="primary" aria-label="add">
                        <AddIcon/>
                    </Fab>
                </Tooltip>
            </Link>
        </div>
    );
};

export default AddButton;