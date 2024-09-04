import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const ThemeSelect = ({ currentTheme, setTheme }) => {
    const handleChange = (event) => {
        setTheme(event.target.value);
    };

    return (
        <FormControl variant="outlined" size="small">
            <InputLabel id="theme-select-label">Téma</InputLabel>
            <Select
                labelId="theme-select-label"
                id="theme-select"
                value={currentTheme}
                onChange={handleChange}
                label="Theme"
            >
                {['light', 'dark'].map((theme) => (
                    <MenuItem key={theme} value={theme}>
                        {theme === 'light' ? 'Világos' : 'Sötét'}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default ThemeSelect;
