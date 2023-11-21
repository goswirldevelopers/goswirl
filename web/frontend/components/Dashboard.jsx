import {DropZone, LegacyStack, Thumbnail, Text, Card, Grid} from '@shopify/polaris';
import {
	Layout,
	FormLayout,
	TextField,
  Toast,
  Spinner,
  Icon,
  Page
} from "@shopify/polaris";
import react, {useState, useCallback} from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import "../assets/css/dashboard.css"
import Button from 'react-bootstrap/Button';
import { useAppBridge } from '@shopify/app-bridge-react'
import { Redirect } from '@shopify/app-bridge/actions';

export default function Dashboard(props) {

    const [analytic, setAnalytic] = useState({
        product:[
        {
            label:"Products",
            value:'',
            link: "/productlist"
        },
        {
            label:"Videos",
            value: '',
            link: "/listVideo"
        },
        {
            label:"Playlist",
            value:'',
            link: "/playListItems"
        }
    ],
    analytic:[
        {
            label:"Total views",
            value: 1458
        },
        {
            label: "Unique views",
            value: 1247
        },
        {
            label:"Total watch time",
            value: 58
        }
    ]
    })
  
  const fetch = useAuthenticatedFetch();

//   const {
//     data
//   } = useAppQuery({
//     url: "/api/products",
//     reactQueryOptions: {
//       onSuccess: (response) => {
//         console.log(response, "response is---")
//         setProduct(response.data)

//       },
//     },
//   });
    const app = useAppBridge();

  const handleCardClick = (item) => {
    Redirect.create(app).dispatch(Redirect.Action.APP, item);
  };
 
  return (
    <div style={{height: "100vh"}}>
    <div className='dashboard-heading'>
        <span>Welcome to GoSwirl</span>
    </div>
      {analytic ? (
        <div>
            <Grid>
                {analytic.product.map(item => (
                    
                    <Grid.Cell columnSpan={{xs: 3, sm: 3, md: 4, lg: 4, xl: 4}} >
                        <div className='grid-container' style={{    cursor: "pointer"}} onClick={()=>handleCardClick(item.link)}>
                            <div className='container-detail' >
                                <div className='label-text'>
                                    <span>{item.label}</span>
                                </div>
                                <div className='value-text'>
                                    <span >{item.value}</span>
                                </div>
                            </div>
                            
                        </div>
                    </Grid.Cell>
                ))}
            </Grid>
            {/* <div className='dashboard-heading' style={{marginTop: "32px"}}>
                <div style={{position:"relative", display:"flex"}}>
                    <div>
                        <span>Analytics</span>
                    </div>
                    <div style={{marginLeft:"auto", marginRight:"0"}}>
                        <Button variant="secondary" >View reports</Button>
                    </div>
                </div>
            </div>
            <Grid>
                {analytic.analytic.map(item => (
                    
                    <Grid.Cell columnSpan={{xs: 3, sm: 3, md: 4, lg: 4, xl: 4}}>
                        <div className='grid-container'>
                            <div className='container-detail'>
                                <div className='label-text'>
                                    <span>{item.label}</span>
                                </div>
                                <div className='value-text'>
                                    <span >{item.value}</span>
                                </div>
                            </div>
                            
                        </div>
                    </Grid.Cell>
                ))}
            </Grid> */}
        </div>
      ):(
        null
      )}
    </div>
  );
}