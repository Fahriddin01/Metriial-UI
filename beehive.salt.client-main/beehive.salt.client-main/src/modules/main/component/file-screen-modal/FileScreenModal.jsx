import React from 'react';
import { Dialog, DialogActions, DialogContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

export default function FileScreenModal({ openDialog, dialogClose, image }) {
  return (
    <Dialog open={openDialog} onClose={dialogClose}>
      <DialogContent>
        {image ? (
          <img
            alt="image_common"
            width="500px"
            height="500px"
            src={`${process.env.REACT_APP_UPLOAD_IMAGE_URL}/${image.fileName}`}
          />
        ) : null}
      </DialogContent>
      <DialogActions>
        <CloseIcon onClick={dialogClose} />
      </DialogActions>
    </Dialog>
  );
}
