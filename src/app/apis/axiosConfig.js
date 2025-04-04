import axios from 'axios';

export const apiInstance = axios.create({

baseURL: "http://localhost:4000/api/",

headers: {

'Content-Type': 'application/json'

},

Authorization: 'Auth'

});

apiInstance.interceptors.request.use((config)=>{

config.headers.Authorization = `Bearer ${sessionStorage.getItem('appToken')}`; 
config.headers.user = `${sessionStorage.getItem('username')}`;
 return config;

});

apiInstance.interceptors.response.use((response)=>{
    
    return response; 

},(error)=>{
    if(error.response && error.response.status===403){
        sessionStorage.clear();
    }
});