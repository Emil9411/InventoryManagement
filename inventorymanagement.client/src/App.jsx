import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button, ButtonGroup, Box, Drawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, ThemeProvider, CssBaseline, Typography } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LoginIcon from '@mui/icons-material/Login';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import MapIcon from '@mui/icons-material/Map';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import KitchenIcon from '@mui/icons-material/Kitchen';
import EggIcon from '@mui/icons-material/Egg';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import BlenderIcon from '@mui/icons-material/Blender';
import ChecklistIcon from '@mui/icons-material/Checklist';
import './index.css';
import { themes } from './utils/themes';
import ThemeSelect from './components/ThemeSelect';
import LogoutButton from './components/LogoutButton';
import handleUpdateEmployeeData from './utils/employeeUpdate';

function App() {
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const location = useLocation();

    const inventoryDrawerListAdminPart = [
        { "Új raktár hozzáadása": <AddLocationAltIcon /> },
        { "Összes raktár listázása": <MapIcon /> },
        { "Raktár adatok frissítése": <EditLocationAltIcon /> },
        { "Raktár törlése": <WrongLocationIcon /> }
    ];
    const inventoryDrawerListManagerPart = [
        { "Raktár adatok": <FmdGoodIcon /> },
        { "Alkalmazottak": <GroupsIcon /> },
        { "Alkalmazott hozzáadása": <PersonAddIcon /> },
        { "Alkalmazott törlése": <PersonRemoveIcon /> }
    ];
    const inventoryDrawerListUserPart = [
        { "Raktárkészlet": <WarehouseIcon /> },
        { "Hozzávalók": <EggIcon /> },
        { "Termékek": <KitchenIcon /> },
        { "Fogyócikkek": <HowToVoteIcon /> },
        { "Tartós cikkek": <RestaurantIcon /> },
        { "Felszerelések": <OutdoorGrillIcon /> },
        { "Eszközök": <BlenderIcon /> },
        { "Rendelési lista": <ChecklistIcon /> }
    ];

    const adminDrawerList = [...inventoryDrawerListAdminPart, ...inventoryDrawerListManagerPart, ...inventoryDrawerListUserPart];
    const managerDrawerList = [...inventoryDrawerListManagerPart, ...inventoryDrawerListUserPart];

    function toggleDrawer(newOpen) {
        setOpen(newOpen);
    }

    const InventoryDrawerList = (
        <Box sx={{ width: '20vw' }} role="presentation" onClick={() => toggleDrawer(false)}>
            <List>
                {user === null ? (
                    null
                ) : user.role === "Admin" ? (
                    <>
                        {adminDrawerList.map((item, index) => (
                            <>
                                {index === 4 || index === 8 ? (
                                    <>
                                        <Divider />
                                        <ListItem key={index}>
                                            <ListItemButton>
                                                <ListItemIcon>{Object.values(item)[0]}</ListItemIcon>
                                                <ListItemText primary={Object.keys(item)[0]} />
                                            </ListItemButton>
                                        </ListItem>
                                    </>
                                ) : (
                                    <ListItem key={index}>
                                        <ListItemButton>
                                            <ListItemIcon>{Object.values(item)[0]}</ListItemIcon>
                                            <ListItemText primary={Object.keys(item)[0]} />
                                        </ListItemButton>
                                    </ListItem>
                                )}
                            </>
                        ))}
                    </>
                ) : user.role === "Manager" ? (
                    <>
                        {managerDrawerList.map((item, index) => (
                            <>
                                {index === 4 ? (
                                    <>
                                        <Divider />
                                        <ListItem key={index}>
                                            <ListItemButton>
                                                <ListItemIcon>{Object.values(item)[0]}</ListItemIcon>
                                                <ListItemText primary={Object.keys(item)[0]} />
                                            </ListItemButton>
                                        </ListItem>
                                    </>
                                ) : (
                                    <ListItem key={index}>
                                        <ListItemButton>
                                            <ListItemIcon>{Object.values(item)[0]}</ListItemIcon>
                                            <ListItemText primary={Object.keys(item)[0]} />
                                        </ListItemButton>
                                    </ListItem>
                                )}
                            </>
                        ))}
                    </>
                ) : user.role === "User" ? (
                    <>
                        {inventoryDrawerListUserPart.map((item, index) => (
                            <ListItem key={index}>
                                <ListItemButton>
                                    <ListItemIcon>{Object.values(item)[0]}</ListItemIcon>
                                    <ListItemText primary={Object.keys(item)[0]} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </>
                ) : (
                    null
                )}
            </List>
        </Box>
    );

    async function getUser() {
        const response = await fetch("api/auth/check", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        const userDataResponse = await fetch(`api/auth/user/${data.email}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const userData = await userDataResponse.json();
        console.log(userData);
        if (userData.firstName === null) {
            handleUpdateEmployeeData(userData);
        } else {
            setUser(userData);
        }
    }

    useEffect(() => {
        getUser();
    }, [location.pathname]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const isVerificationPage = location.pathname.startsWith('/verify');
    const isLoginPage = location.pathname.startsWith('/login');

    return (
        <ThemeProvider theme={themes[theme] || themes.light}>
            <CssBaseline />
            <div className="App">
                <header style={{ backgroundColor: themes[theme].palette.background.default, color: themes[theme].palette.text.primary }}>
                    <Link to="/">
                        <Typography variant="h1" sx={{ color: themes[theme].palette.text.primary }}>Raktár Manager</Typography>
                    </Link>
                    <ButtonGroup variant="outlined" size="large" aria-label="header button group">
                        {!isVerificationPage && !isLoginPage && (
                            <>
                                {!user ? (
                                    <Link to="/login">
                                        <Button startIcon={<LoginIcon />}>Belépés</Button>
                                    </Link>
                                ) : user.role === "Admin" || user.role === "Manager" ? (
                                    <>
                                        <ThemeSelect sx={{ mx: 1 }} currentTheme={theme} setTheme={setTheme} />
                                        <LogoutButton />
                                        <Link to="/registration">
                                            <Button sx={{ mx: 1 }} startIcon={<PersonAddIcon />}>Regisztráció</Button>
                                        </Link>
                                        <Link to="/employees">
                                            <Button sx={{ mx: 1 }} startIcon={<GroupsIcon />}>Alkalmazottak</Button>
                                        </Link>
                                        <Link to="/profile">
                                            <Button sx={{ mx: 1 }} startIcon={<ManageAccountsIcon />}>Profil</Button>
                                        </Link>
                                        <Button sx={{ mx: 1 }} startIcon={<WarehouseIcon />} onClick={() => toggleDrawer(true)}>Raktár</Button>
                                        <Drawer anchor={'right'} open={open} onClose={() => toggleDrawer(false)}>
                                            {InventoryDrawerList}
                                        </Drawer>
                                    </>
                                ) : (
                                    <>
                                        <ThemeSelect sx={{ mx: 1 }} currentTheme={theme} setTheme={setTheme} />
                                        <LogoutButton />
                                        <Link to="/profile">
                                            <Button sx={{ mx: 1 }} startIcon={<ManageAccountsIcon />}>Profil</Button>
                                        </Link>
                                        <Button sx={{ mx: 1 }} startIcon={<WarehouseIcon />} onClick={() => toggleDrawer(true)}>Raktár</Button>
                                        <Drawer anchor={'right'} open={open} onClose={() => toggleDrawer(false)}>
                                            {InventoryDrawerList}
                                        </Drawer>
                                    </>
                                )}
                            </>
                        )}
                    </ButtonGroup>
                </header>
                <main style={{ backgroundColor: themes[theme].palette.background.default, color: themes[theme].palette.text.primary }}>
                    <Outlet />
                </main>
                <footer style={{ backgroundColor: themes[theme].palette.background.default, color: themes[theme].palette.text.primary }}>
                    <Typography variant="subtitle1">© 2024 Raktár Manager</Typography>
                    <Typography variant="subtitle1">Created by: EM&EM Software</Typography>
                    <Typography variant="subtitle1">Contact: <a href="mailto:emandemsoftware@gmail.com">emandemsoftware@gmail.com</a></Typography>
                    <Typography variant="subtitle1">(Under registration)</Typography>
                </footer>
            </div>
        </ThemeProvider>
    );
}

export default App;