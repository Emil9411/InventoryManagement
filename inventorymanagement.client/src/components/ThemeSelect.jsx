import React from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const ThemeSelect = ({ currentTheme, setTheme }) => {
    const handleChange = (event) => {
        setTheme(event.target.value);
    };

    return (
        <FormControl variant="outlined" size="small">
            <InputLabel id="theme-select-label">Theme</InputLabel>
            <Select
                labelId="theme-select-label"
                id="theme-select"
                value={currentTheme}
                onChange={handleChange}
                label="Theme"
            >
                {['light', 'dark'].map((theme) => (
                    <MenuItem key={theme} value={theme}>
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default ThemeSelect;
