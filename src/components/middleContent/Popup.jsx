import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { ServiceRequest } from '../../app/apis/serviceReq';
import { setProductData } from '../../pages/pageSlice';

export default function AlertDialog({message,open,setOpen,onProductAdded}) {
    const product = useSelector(state=>state.page.product);
    const dispatch = useDispatch();
    
  const handleDelete = async() => {
    setOpen(false);
    try{
        const response = await ServiceRequest.callPostApi(`/deleteProduct/${product._id}`,product);
        onProductAdded(); // Refresh product list
        
        dispatch(setProductData(null));
    } catch (error) {
        console.error("Error adding product:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Allert"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
