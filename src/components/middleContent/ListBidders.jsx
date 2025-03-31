import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import { ServiceRequest } from '../../app/apis/serviceReq';
import { Box } from '@mui/material';
import { setShowChat } from '../../pages/pageSlice';
import { useDispatch } from 'react-redux';



export default  function BidLists({ onClose, open, bids,fetchBids,setBidder }) {
 const dispatch = useDispatch();

  const handleClose = () => {
    onClose(false);
    setBidder(null);
  };

  const handleListItemClick = (value) => {
    setBidder(value);
     dispatch(setShowChat(true));
     onClose(false);
  };

  const [accepted, setAccepted] = React.useState(false);

  const handleAcceptBid = async (bidId,productId) => {
    try {
     await ServiceRequest.callPostApi(`/accept/${bidId}`, { productId });
      setAccepted(true); // Change background color for all bids
      fetchBids(); // Refresh bid list
    } catch (error) {
      console.error("Error accepting bid:", error);
    }
  };

  return (
<Dialog onClose={handleClose} open={open}>
      <DialogTitle>List of Bidders</DialogTitle>
      {bids.length > 0 ? (
        <List sx={{ width: "300px", maxHeight: "400px", overflowY: "auto", p: 1 }}>
          {bids.map((value) => (
            <ListItem
              key={value.buyerId}
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                backgroundColor: accepted ? 'gray' : "white",
                borderRadius: 1,
                mb: 1
              }}
              
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600], width: 30, height: 30 }} >
                  <PersonIcon fontSize="small" />
                </Avatar>
              </ListItemAvatar>

              <Box sx={{ flex: 1, textAlign: "left" }} onClick={()=>handleListItemClick(value.buyerId)}>
                <Typography variant="body2" fontWeight="bold">{value.buyerId}</Typography>
                <Typography variant="caption">${value.bidAmount}</Typography>
              </Box>

              <Button 
                variant="contained" 
                size="small" 
                color="primary" 
                disabled={accepted} 
                onClick={() => handleAcceptBid(value._id,value.productId)}
              >
                Accept
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography sx={{ p: 2 }}>No Bidders</Typography>
      )}
    </Dialog>
  );
}



