import { createTheme } from '@mui/material/styles';

export const themes = {
    light: createTheme({
        spacing: 4,
        palette: {
            mode: 'light',
            primary: { main: '#1976d2' },
            secondary: { main: '#dc004e' },
            background: {
                default: '#ffffff',
            },
            text: {
                primary: '#000000',
            },
        },
    }),
    dark: createTheme({
        spacing: 4,
        palette: {
            mode: 'dark',
            primary: { main: '#90caf9' },
            secondary: { main: '#f48fb1' },
            background: {
                default: '#333333',
            },
            text: {
                primary: '#ffffff',
            },
        },
    })
};
