import React from 'react';
import ButtonFocus from './ButtonFocus';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function GamePopup ({ title, description, yesText, handleYes, handleClose }) {
  return (
    <>
      <Dialog
        open={true}
        onClose={handleClose}
        aria-labelledby="game-popup-title"
        aria-describedby="game-popup-description"
      >
        <DialogTitle id="game-start-popup-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="game-start-popup-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonFocus onClick={handleYes} autoFocus>
            {yesText}
          </ButtonFocus>
          <ButtonFocus onClick={handleClose}>Close</ButtonFocus>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default GamePopup;
