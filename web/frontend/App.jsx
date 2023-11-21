import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import { Link } from 'react-router-dom';

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import "./assets/css/sidebar.css"
import { useEffect } from "react";
export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  // const actDeactivNavTabs = () => {
  //   console.log("running");
  // // Get all the menu items
  // const menuItems = document.querySelectorAll('.sidebar-item');

  // // Loop through each menu item
  // menuItems.forEach(item => {
  //   // Get the link inside the menu item
  //   const link = item.querySelector('a');

  //   // Check if the link's href matches the current pathname
  //   if (link.getAttribute('href') === window.location.pathname) {
  //     // Add the active class if it matches
  //     item.style.backgroundColor = "red"
  //     item.classList.add('sidebar-active-item');

  //   } else {
  //     // Remove the active class if it doesn't match
  //     item.classList.remove('sidebar-active-item');
  //     item.style.backgroundColor = "black"
  //   }
  // });
  // }


  const actDeactivNavTabs = (href) => {
    // Get all the menu items
    const menuItems = document.querySelectorAll('.sidebar-item');

    // Loop through each menu item
    menuItems.forEach(item => {
      // Get the link inside the menu item
      const link = item.querySelector('a');

      // Check if the link's href matches the current pathname
      if (link.getAttribute('href') === href) {
        // Add the active class if it matches
        item.style.backgroundColor = "#424242"
        item.classList.add('sidebar-active-item');

      } else {
        // Remove the active class if it doesn't match
        item.classList.remove('sidebar-active-item');
        item.style.backgroundColor = "black"
      }
    });
  }

  useEffect(() => {
    if(document && window.location.pathname === "/"){
       // Get all the menu items
    const menuItems = document.querySelectorAll('.sidebar-item');

    // Loop through each menu item
    menuItems.forEach(item => {
      // Get the link inside the menu item
      const link = item.querySelector('a');

      // Check if the link's href matches the current pathname
      if (link.getAttribute('href') === "/") {
        // Add the active class if it matches
        item.style.backgroundColor = "#424242"
        item.classList.add('sidebar-active-item');

      } else {
        // Remove the active class if it doesn't match
        item.classList.remove('sidebar-active-item');
        item.style.backgroundColor = "black"
      }
    });
    }else{
        // Get all the menu items
    const menuItems = document.querySelectorAll('.sidebar-item');
// Loop through each menu item
menuItems.forEach(item => {
  // Get the link inside the menu item
  const link = item.querySelector('a');

  // Check if the link's href matches the current pathname
  if (link.getAttribute('href') === window.location.pathname) {
    // Add the active class if it matches
    item.style.backgroundColor = "#424242"
    item.classList.add('sidebar-active-item');

  } else {
    // Remove the active class if it doesn't match
    item.classList.remove('sidebar-active-item');
    item.style.backgroundColor = "black"
  }
});
    }
   
  }, [])
  

  return (
    <>

      <PolarisProvider>
        <BrowserRouter>
          <AppBridgeProvider>
            <QueryProvider>
              {/* <NavigationMenu
              navigationLinks={[
                
                {
                  // label: "Playlist",
                  destination: "/playListItems",
                },
                {
                  destination: "/listVideo",
                }

              ]}
            /> */}
              <div style={{ display: 'flex', height: '960px', color: '#FFFFFF', position: "fixed" }}>
                <Sidebar backgroundColor="black" width="250px" >
                  <Menu className="custom-sidebar" style={{ color: "#FFFFFF" }}
                    menuItemStyles={{
                      button: {
                        // the active class will be added automatically by react router
                        // so we can use it to style the active menu item
                        [`&.active`]: {
                          backgroundColor: '#13395e',
                          color: 'white',
                        },
                      },
                    }}
                  >
                    <MenuItem component={<Link to="/" />} className="sidebar- -logo" onClick={() => actDeactivNavTabs("/")}><h2 className="sidebar-heading">SWIRL</h2></MenuItem>
                    <MenuItem component={<Link to="/" />} className="sidebar-item menu-items" onClick={() => actDeactivNavTabs("/")}> Dashboard </MenuItem>
                    <MenuItem component={<Link to="/productlist" />} className="sidebar-item " onClick={() => actDeactivNavTabs("/productlist")}> Products </MenuItem>
                    <MenuItem component={<Link to="/listVideo" />} className="sidebar-item" onClick={() => actDeactivNavTabs("/listVideo")}> Video </MenuItem>
                    <MenuItem component={<Link to="/playListItems" />} className="sidebar-item" onClick={() => actDeactivNavTabs("/playListItems")}> Playlist </MenuItem>
                    {/* <MenuItem component={<Link to="/settings" />} className="sidebar-item"> Settings </MenuItem> */}
                    <MenuItem component={<Link to="/integration" />} className="sidebar-item" onClick={() => actDeactivNavTabs("/integration")}> Integration </MenuItem>

                  </Menu>
                </Sidebar>
              </div>
              <Routes pages={pages} />
            </QueryProvider>
          </AppBridgeProvider>
        </BrowserRouter>
      </PolarisProvider>
      {/* <Router> */}



      {/* <Route path='/' component={}></Route> */}
      {/* </Router> */}
    </>
  );
}
