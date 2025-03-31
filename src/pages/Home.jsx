import React, { useEffect, useState } from "react";
import { ServiceRequest } from "../app/apis/serviceReq";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";
import AppBarHeader from "../components/header/AppBar";
import AddProductModal from "../components/middleContent/sellerForm";
import Chat from "../components/SocketComp/Chat";
import { setProductData, setShowChat } from "./pageSlice";
import AlertDialog from "../components/middleContent/Popup";
import BidLists from "../components/middleContent/ListBidders";

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const username = sessionStorage.getItem("username");
    const showChat = useSelector(state => state.page.showChat);
    const [products, setProducts] = useState([]);
    const [role, setRole] = useState(sessionStorage.getItem('usertype')); // Determine if user is seller or buyer
    const [openModal, setOpenModal] = useState(false);

    const [openWarning, setOpenWarning] = useState(false);

    const [openBidder, setOpenBidder] = useState(false);
    const [bids, setBids] = useState([]);
    const [bidder,setBidder] = useState();

    const [searchQuery, setSearchQuery] = useState(""); 

   

    useEffect(() => {
        fetchProducts();
        
    }, []);


    const fetchProducts = async () => {
        try {
            const resp = await ServiceRequest.callGetApi("/getProducts");
            setProducts(resp);

        } catch (e) {
            if (e.response?.status === 403) {
                navigate('/login');
            }
            console.log(e);
        
        }
    };

    const fetchBids = async (product) => {
        try {
            const resp = await ServiceRequest.callGetApi(`/getBids/${product._id}`);
            setBids(resp);

        } catch (e) {
            if (e.response?.status === 403) {
                navigate('/login');
            }
            console.log(e);
        
        }
    };

    // const userType =  React.useRef(sessionStorage.getItem('usertype'));

    const handleEditProduct = (product) => {
        dispatch(setProductData(product));
        setOpenModal(true); 
        
    };

    const handleAddProduct = () => {
       setOpenModal(true); 

    };

    const handlePlaceBid = (product) => {

        dispatch(setProductData(product));
        setOpenModal(true);  
    };

    const handleShowBidder =(product)=>{
        fetchBids(product);
        setOpenBidder(true);
        

    }

    const handleDeleteProd=(product)=>{
        dispatch(setProductData(product));
        setOpenWarning(true);

    }

    const handleChatWithSeller = (product) => {
        dispatch(setProductData(product));
        dispatch(setShowChat(true));
        
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

     // Filter products based on search query
     const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) 
    );


    return (
        <Box sx={{ height: "95vh", overflow: "hidden" }}>
        <AppBarHeader />

        <AddProductModal 
            open={openModal} 
            onClose={() => setOpenModal(false)} 
            onProductAdded={fetchProducts} 
        />
        <AlertDialog
            message={"Do you want to delete "}
            onProductAdded={fetchProducts} 
            open={openWarning}
            setOpen={setOpenWarning}
        />

        <BidLists
            open={openBidder} 
            onClose={() => setOpenBidder(false)} 
            bids={bids}
            fetchBids={fetchBids}
            setBidder={setBidder}
        />

        <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "left", marginTop:'1%', gap:'3%' }}>
                <Typography variant="h4">
                    {role === "Seller" ? "Your Products" : "Available Products"}
                </Typography>
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ width: 250 }}
                />
            </Box>

            {filteredProducts.length === 0 ? ( 
                <Typography variant="h6" color="textSecondary">
                    {role === "Seller" ? (
                        <Button variant="contained" color="primary" onClick={handleAddProduct}>
                            Add Product
                        </Button>
                    ) : (
                        "No products available."
                    )}
                </Typography>
            ) : (
                <>
                    {role === "Seller" && (
                        <Button variant="contained" color="primary" onClick={handleAddProduct} sx={{ mb: 2 }}>
                            Add Product
                        </Button>
                    )}

                    <Box sx={{ maxHeight: "80vh", overflowY: "auto" }}> 
                        {filteredProducts.map((product) => (
                            <Card key={product.id} sx={{ mb: 2, p: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" fontWeight="bold">
                                        {product.name}
                                    </Typography>
                                    <Typography>{product.description}</Typography>
                                    <Typography>Price: ${product.price}</Typography>
                                    <Typography>Status: {product.status}</Typography>

                                    {role === "Seller" ? (
                                        <Box sx={{ display: "flex", gap: "1%" }}>
                                            <Button variant="contained" color="primary" onClick={() => handleEditProduct(product)}>
                                                Edit
                                            </Button>
                                            <Button variant="contained" color="primary" onClick={() => handleShowBidder(product)}>
                                                Bidders
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => handleDeleteProd(product)}>
                                                Delete
                                            </Button>
                                        </Box>
                                    ) : (
                                        <>
                                            <Button variant="contained" color="secondary" onClick={() => handlePlaceBid(product)}>
                                                Place Bid
                                            </Button>
                                            <Button variant="outlined" color="primary" sx={{ ml: 2 }} onClick={() => handleChatWithSeller(product)}>
                                                Chat with Seller
                                            </Button>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </>
            )}
        </Box>

        {showChat && <Chat currentUser={username} buyerId={bidder}/>}
    </Box>
        );
};

export default Home;
