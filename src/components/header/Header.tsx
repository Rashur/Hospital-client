import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import {Link} from "react-router-dom";


const pages = [{name: 'Patients', url: '/patients'}, {name: 'Nurses', url: '/nurses'}];

const Header = () => {

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 500,
                            fontSize: 30,
                            fontFamily: 'Ubuntu, sans-serif'
                    }}
                    >
                        HOSPITAL
                    </Typography>
                    <Box sx={{
                        flexGrow: 1,
                        display: { xs: 'none', md: 'flex' }
                    }}>
                        {pages.map((page, idx) => (
                         <Link style={{
                             textDecoration: 'none',
                         }}
                               to={page.url}>
                             <Button
                             key={idx}
                             sx={{
                                 my: 2,
                                 color: 'white',
                                 display: 'block',
                                 fontSize: 20,
                                 fontFamily: 'Ubuntu, sans-serif' }}
                         >
                             {page.name}
                         </Button>
                         </Link>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default Header;