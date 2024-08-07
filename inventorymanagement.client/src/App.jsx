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
                        <ListItem>
                            <ListItemButton component={Link} to="/addwarehouse">
                                <ListItemIcon><AddLocationAltIcon /></ListItemIcon>
                                <ListItemText primary={"Új raktár hozzáadása"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/warehouses">
                                <ListItemIcon><MapIcon /></ListItemIcon>
                                <ListItemText primary={"Összes raktár listázása"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/updatewarehouse">
                                <ListItemIcon><EditLocationAltIcon /></ListItemIcon>
                                <ListItemText primary={"Raktár adatok frissítése"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/deletewarehouse">
                                <ListItemIcon><WrongLocationIcon /></ListItemIcon>
                                <ListItemText primary={"Raktár törlése"} />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemButton component={Link} to="/inventory">
                                <ListItemIcon><FmdGoodIcon /></ListItemIcon>
                                <ListItemText primary={"Raktár adatok"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/employees">
                                <ListItemIcon><GroupsIcon /></ListItemIcon>
                                <ListItemText primary={"Alkalmazottak"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/registration">
                                <ListItemIcon><PersonAddIcon /></ListItemIcon>
                                <ListItemText primary={"Alkalmazott hozzáadása"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/removeemployee">
                                <ListItemIcon><PersonRemoveIcon /></ListItemIcon>
                                <ListItemText primary={"Alkalmazott törlése"} />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemButton component={Link} to="/allitems">
                                <ListItemIcon><WarehouseIcon /></ListItemIcon>
                                <ListItemText primary={"Raktárkészlet"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/ingredients">
                                <ListItemIcon><EggIcon /></ListItemIcon>
                                <ListItemText primary={"Hozzávalók"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/products">
                                <ListItemIcon><KitchenIcon /></ListItemIcon>
                                <ListItemText primary={"Termékek"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/consumables">
                                <ListItemIcon><HowToVoteIcon /></ListItemIcon>
                                <ListItemText primary={"Fogyócikkek"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/nonconsumables">
                                <ListItemIcon><RestaurantIcon /></ListItemIcon>
                                <ListItemText primary={"Tartós cikkek"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/equipments">
                                <ListItemIcon><OutdoorGrillIcon /></ListItemIcon>
                                <ListItemText primary={"Felszerelések"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/tools">
                                <ListItemIcon><BlenderIcon /></ListItemIcon>
                                <ListItemText primary={"Eszközök"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/orderlist">
                                <ListItemIcon><ChecklistIcon /></ListItemIcon>
                                <ListItemText primary={"Rendelési lista"} />
                            </ListItemButton>
                        </ListItem>
                    </>
                ) : user.role === "Manager" ? (
                    <>
                        <ListItem>
                            <ListItemButton component={Link} to="/inventory">
                                <ListItemIcon><FmdGoodIcon /></ListItemIcon>
                                <ListItemText primary={"Raktár adatok"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/employees">
                                <ListItemIcon><GroupsIcon /></ListItemIcon>
                                <ListItemText primary={"Alkalmazottak"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/registration">
                                <ListItemIcon><PersonAddIcon /></ListItemIcon>
                                <ListItemText primary={"Alkalmazott hozzáadása"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/removeemployee">
                                <ListItemIcon><PersonRemoveIcon /></ListItemIcon>
                                <ListItemText primary={"Alkalmazott törlése"} />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemButton component={Link} to="/allitems">
                                <ListItemIcon><WarehouseIcon /></ListItemIcon>
                                <ListItemText primary={"Raktárkészlet"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/ingredients">
                                <ListItemIcon><EggIcon /></ListItemIcon>
                                <ListItemText primary={"Hozzávalók"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/products">
                                <ListItemIcon><KitchenIcon /></ListItemIcon>
                                <ListItemText primary={"Termékek"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/consumables">
                                <ListItemIcon><HowToVoteIcon /></ListItemIcon>
                                <ListItemText primary={"Fogyócikkek"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/nonconsumables">
                                <ListItemIcon><RestaurantIcon /></ListItemIcon>
                                <ListItemText primary={"Tartós cikkek"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/equipments">
                                <ListItemIcon><OutdoorGrillIcon /></ListItemIcon>
                                <ListItemText primary={"Felszerelések"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/tools">
                                <ListItemIcon><BlenderIcon /></ListItemIcon>
                                <ListItemText primary={"Eszközök"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/orderlist">
                                <ListItemIcon><ChecklistIcon /></ListItemIcon>
                                <ListItemText primary={"Rendelési lista"} />
                            </ListItemButton>
                        </ListItem>
                    </>
                ) : user.role === "User" ? (
                    <>
                        <ListItem>
                            <ListItemButton component={Link} to="/allitems">
                                <ListItemIcon><WarehouseIcon /></ListItemIcon>
                                <ListItemText primary={"Raktárkészlet"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/ingredients">
                                <ListItemIcon><EggIcon /></ListItemIcon>
                                <ListItemText primary={"Hozzávalók"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/products">
                                <ListItemIcon><KitchenIcon /></ListItemIcon>
                                <ListItemText primary={"Termékek"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/consumables">
                                <ListItemIcon><HowToVoteIcon /></ListItemIcon>
                                <ListItemText primary={"Fogyócikkek"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/nonconsumables">
                                <ListItemIcon><RestaurantIcon /></ListItemIcon>
                                <ListItemText primary={"Tartós cikkek"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/equipments">
                                <ListItemIcon><OutdoorGrillIcon /></ListItemIcon>
                                <ListItemText primary={"Felszerelések"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/tools">
                                <ListItemIcon><BlenderIcon /></ListItemIcon>
                                <ListItemText primary={"Eszközök"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton component={Link} to="/orderlist">
                                <ListItemIcon><ChecklistIcon /></ListItemIcon>
                                <ListItemText primary={"Rendelési lista"} />
                            </ListItemButton>
                        </ListItem>
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
                    <Typography component={Link} to="/" variant="h1" sx={{
                        color: themes[theme].palette.text.primary,
                        textDecoration: 'none',
                        '&:hover': {
                            color: themes[theme].palette.text.primary,
                            textDecoration: 'none',
                        },
                        '&:visited': {
                            color: themes[theme].palette.text.primary,
                            textDecoration: 'none',
                        },
                        '&:active': {
                            color: themes[theme].palette.text.primary,
                            textDecoration: 'none',
                        }
                    }}>Raktár Manager</Typography>
                    <ButtonGroup variant="outlined" size="large" aria-label="header button group">
                        {!isVerificationPage && !isLoginPage && (
                            <>
                                {!user ? (
                                    <Button component={Link} to="/login" startIcon={<LoginIcon />}>Belépés</Button>
                                ) : user.role === "Admin" || user.role === "Manager" ? (
                                    <>
                                        <ThemeSelect sx={{ mx: 1 }} currentTheme={theme} setTheme={setTheme} />
                                        <LogoutButton />
                                        <Button component={Link} to="/profile" sx={{ mx: 1 }} startIcon={<ManageAccountsIcon />}>Profil</Button>
                                        <Button sx={{ mx: 1 }} startIcon={<WarehouseIcon />} onClick={() => toggleDrawer(true)}>Raktár</Button>
                                        <Drawer anchor={'right'} open={open} onClose={() => toggleDrawer(false)}>
                                            {InventoryDrawerList}
                                        </Drawer>
                                    </>
                                ) : (
                                    <>
                                        <ThemeSelect sx={{ mx: 1 }} currentTheme={theme} setTheme={setTheme} />
                                        <LogoutButton />
                                        <Button component={Link} to="/profile" sx={{ mx: 1 }} startIcon={<ManageAccountsIcon />}>Profil</Button>
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