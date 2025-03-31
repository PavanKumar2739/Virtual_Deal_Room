import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { ServiceRequest } from "../../app/apis/serviceReq";
import { useDispatch, useSelector } from "react-redux";
import { setProductData } from "../../pages/pageSlice";

const AddProductModal = ({ open, onClose, onProductAdded }) => {
    const dispatch = useDispatch();
   const productForm =  { name: "", description: "", price: 0, count:0,sellerId : sessionStorage.getItem('username') }
    const [newProduct, setNewProduct] = useState(productForm);
    const product = useSelector(state=>state.page.product);
    const type = sessionStorage.getItem('usertype');
    // Handle Input Change
    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if(open && product){
            console.log(product);
            for(const key in product){
                
                setNewProduct((prevProduct) => ({
                    ...prevProduct, 
                    ...product // Spread the product object to update state properly
                }));
             }
         }else{
            dispatch(setProductData(null));
            setNewProduct(productForm);
         }
           
        }, [open]);

const editProduct=async()=>{
    try{
    const response = await ServiceRequest.callPostApi(`/updateProduct/${newProduct._id}`,newProduct);
    onProductAdded(); // Refresh product list
    onClose(); // Close modal
    dispatch(setProductData(null));
} catch (error) {
    console.error("Error adding product:", error);
}

}
    // Add Product to DB
    const handleCreateProduct = async () => {
        try {
            const response = await ServiceRequest.callPostApi('/addProduct',newProduct);
            if (!response.message) throw new Error("Failed to add product");

            onProductAdded(); // Refresh product list
            onClose(); // Close modal
            dispatch(setProductData(null));
        } catch (error) {
            console.error("Error adding product:", error);
        }
    }; 

    const handleCreateBid = async () => {
        try {
            
            const response = await ServiceRequest.callPostApi(`/placeBid/${product._id}`,{bidAmount:newProduct.price,buyerId:sessionStorage.getItem('username')});
            if (!response.message) throw new Error("Failed to add product");

            onProductAdded(); // Refresh product list
            onClose(); // Close modal
            dispatch(setProductData(null));
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };


    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "white",
                boxShadow: 24,
                p: 4,
                width: 400,
                borderRadius: 2
            }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Add New Product</Typography>

                <TextField 
                    fullWidth 
                    label="Product Name" 
                    name="name" 
                    value={newProduct.name} 
                    onChange={handleChange} 
                    sx={{ mb: 2 }}
                    disabled={type==='Buyer'?true:false}
                />
                <TextField 
                    fullWidth 
                    label="Description" 
                    name="description" 
                    value={newProduct.description} 
                    onChange={handleChange} 
                    sx={{ mb: 2 }}
                    disabled={type==='Buyer'?true:false}
                />
                <TextField 
                    fullWidth 
                    label="Price" 
                    name="price" 
                    value={newProduct.price} 
                    onChange={handleChange} 
                    type="number" 
                    sx={{ mb: 2 }}
                   
                />
                <TextField 
                    fullWidth 
                    label="Available Count" 
                    name="count" 
                    value={newProduct.count} 
                    onChange={handleChange} 
                    type="number" 
                    sx={{ mb: 2 }}
                    disabled={type==='Buyer'?true:false}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Button onClick={onClose} variant="contained" color="error">Close</Button>
                    <Button variant="contained" color="primary" onClick={product?type==='Buyer'?handleCreateBid:editProduct:handleCreateProduct}>
                       {product?type==='Buyer'?'Bid':"Update":"Add Product"} 
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddProductModal;
