import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Box, Drawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, ThemeProvider, CssBaseline, Typography } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LoginIcon from '@mui/icons-material/Login';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import MapIcon from '@mui/icons-material/Map';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
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
import UpdateEmployeeModal from './utils/employeeUpdate';

function App() {
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalUser, setModalUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    function toggleDrawer(newOpen) {
        setOpen(newOpen);
    }

    const commonItems = [
        { to: "/allitems", icon: <WarehouseIcon />, text: "Raktárkészlet" },
        { to: "/ingredients", icon: <EggIcon />, text: "Hozzávalók" },
        { to: "/products", icon: <KitchenIcon />, text: "Termékek" },
        { to: "/consumables", icon: <HowToVoteIcon />, text: "Fogyócikkek" },
        { to: "/nonconsumables", icon: <RestaurantIcon />, text: "Tartós cikkek" },
        { to: "/equipments", icon: <OutdoorGrillIcon />, text: "Felszerelések" },
        { to: "/tools", icon: <BlenderIcon />, text: "Eszközök" },
        { to: "/orderlist", icon: <ChecklistIcon />, text: "Rendelési lista" },
    ];

    const adminItems = [
        { to: "/addwarehouse", icon: <AddLocationAltIcon />, text: "Új raktár hozzáadása" },
        { to: "/warehouses", icon: <MapIcon />, text: "Összes raktár listázása" },
        { to: "/warehousedata", icon: <FmdGoodIcon />, text: "Raktár adatok" },
        { to: "/employees", icon: <GroupsIcon />, text: "Alkalmazottak" },
        { to: "/addemployee", icon: <PersonAddIcon />, text: "Alkalmazott hozzáadása" },
    ];

    const managerItems = [
        { to: "/warehousedata", icon: <FmdGoodIcon />, text: "Raktár adatok" },
        { to: "/employees", icon: <GroupsIcon />, text: "Alkalmazottak" },
        { to: "/addemployee", icon: <PersonAddIcon />, text: "Alkalmazott hozzáadása" },
    ];

    const roleItems = {
        Admin: adminItems,
        Manager: managerItems,
        User: [],
    };

    const InventoryDrawerList = (
        <Box sx={{ width: '20vw' }} role="presentation" onClick={() => toggleDrawer(false)}>
            <List>
                {user && roleItems[user.role]?.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemButton component={Link} to={item.to}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {user && <Divider />}
                {user && commonItems.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemButton component={Link} to={item.to}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    async function deleteCookie() {
        try {
            const response = await fetch("api/auth/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Logout failed");
            } else {
                setModalOpen(false);
                if (location.pathname !== "/") {
                    navigate("/");
                }
                window.location.reload();
            }
        } catch (error) {
            console.error("Logout Error:", error);
        }
    }

    async function getUser() {
        try {
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
                // Set modal state to show modal
                setModalUser(userData);
                setModalOpen(true);
            } else {
                setUser(userData);
            }
        } catch (error) {
            console.error(error);
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
                {modalUser && (
                    <UpdateEmployeeModal
                        selectedEmployee={modalUser}
                        open={modalOpen}
                        onClose={() => deleteCookie()}
                    />
                )}
            </div>
        </ThemeProvider>
    );
}

export default App;