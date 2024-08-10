import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Box, Typography, Button } from '@mui/material';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '25vw',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

function MessageModal({ open, onClose, title, children, actions }){
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={modalStyle}>
                {title && (
                    <Typography id="modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                )}
                <Box mt={2}>{children}</Box>
                {actions && (
                    <Box mt={3} display="flex" justifyContent="space-between" flexDirection="row-reverse">
                        {actions.map((action, index) => (
                            <Button
                                key={index}
                                onClick={action.onClick}
                                color={action.color || 'primary'}
                                variant={action.variant || 'contained'}
                                sx={{ ml: index > 0 ? 2 : 0 }}
                                startIcon={action.startIcon}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </Box>
                )}
            </Box>
        </Modal>
    );
}

MessageModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
            color: PropTypes.string,
            variant: PropTypes.string,
            startIcon: PropTypes.element,
        })
    ),
};

export default MessageModal;
