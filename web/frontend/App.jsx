import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import {  Link } from 'react-router-dom';

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import "./assets/css/sidebar.css"
export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

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
            <div style={{ display: 'flex', height: '960px', color:'#FFFFFF', position:"fixed"}}>
          <Sidebar backgroundColor="black" width="250px" >
            <Menu className="custom-sidebar" style={{color: "#FFFFFF"}}
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
              <MenuItem component={<Link to="/" />} className="sidebar-header-logo"><h2 className="sidebar-heading">SWIRL</h2></MenuItem>
              <MenuItem component={<Link to="/" />} className="sidebar-item menu-items"> Dashboard </MenuItem>
              <MenuItem component={<Link to="/productlist" />} className="sidebar-item "> Products </MenuItem>
              <MenuItem component={<Link to="/listVideo" />} className="sidebar-item"> Video </MenuItem>
              <MenuItem component={<Link to="/playListItems" />} className="sidebar-item"> Playlist </MenuItem>
              {/* <MenuItem component={<Link to="/settings" />} className="sidebar-item"> Settings </MenuItem> */}
              <MenuItem component={<Link to="/integration" />} className="sidebar-item"> Integration </MenuItem>
              
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
