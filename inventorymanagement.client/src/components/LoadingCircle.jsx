import React from 'react';
import { CircularProgress, Box } from '@mui/material';

function LoadingCircle() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
            <React.Fragment>
                <svg width={0} height={0}>
                    <defs>
                        <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#00008B" />
                            <stop offset="20%" stopColor="#0000FF" />
                            <stop offset="40%" stopColor="#0066FF" />
                            <stop offset="60%" stopColor="#3399FF" />
                            <stop offset="80%" stopColor="#00FFFF" />
                            <stop offset="100%" stopColor="#33FFCC" />
                        </linearGradient>
                    </defs>
                </svg>
                <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
            </React.Fragment>
        </Box>
    );
}

export default LoadingCircle;