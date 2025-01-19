import Cookies from 'js-cookie';



export const isAuthenticated = () => {
  const token = Cookies.get('jwt'); 
  if (token) {
    return true;
  }
    
    return false;
  
};
