import {DropZone, LegacyStack, Thumbnail, Text, Card, Grid} from '@shopify/polaris';
import react, {useState, useCallback} from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import SplitButton from 'react-bootstrap/SplitButton';
import "../assets/css/integration.css"
import { na } from "../assets"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function Integration() {

    const [loading, setLoading] = useState(true)
    const [searchTitle, setSearchTitle] = useState('Search playlist')
    const [playlist, setPlaylist] = useState([])
    const [scriptVisible, setScriptVisible] = useState(false)
    const [scriptData, setScriptData] = useState()

    const fetch = useAuthenticatedFetch();

    const {data, refetch: refetchList} =  useAppQuery({url: `/api/swril/getPlaylist`,
    reactQueryOptions: {
        onSuccess: (response) => {   
            if (response.data) {
                setPlaylist(response.data.data)
                setLoading(false)
            }
        },
    },
    });


    const filterData = async(item) => {
        setSearchTitle(item.name)
        console.log(item, "item")
        if (item.playlist_id) {
            setScriptVisible(true)
            setScriptData(item)
        }
        // call API for stronfront script..

        

    }

    const copyCode = async()=>{
        if (scriptData) {
            navigator.clipboard.writeText(`
            <div id="swirl-short-videos" data-code="${scriptData.brand_code}"  data-playlist="${scriptData.playlist_code}"  data-pdp="product/,products/,collection/"></div>
            <script type="text/javascript" async src="https://apigoswirl.com/short_video/shopify/swirl-short-video.min.js"></script>
            
        `)
        return alert('Copied')
        }
        else{
            alert('no playlist selected')
        }
    }

    const handleEditor = () => {
        if (scriptData && window.location.ancestorOrigins) {
            window.open(`${window.location.ancestorOrigins['0']}/admin/themes`, '_blank' )
            return;
        }
        alert('No playlist code copied')
    }


  return (
    
         
          <div style={{height: "100vh"}}>
            <div style={{position: "relative", display:"flex"}}>
                    <div>
                        <h2 style={{lineHeight:"45.54px",fontWeight: "500", width:"183px", height:"46px", marginTop: "8px", fontSize: "36px"}}>Integration</h2>
                    </div>
                
                    
                </div>
                <div className='divider-line' ></div>
          {data ? (
            <>
            {(playlist.length>0) ? (
                  <div style={{position: "relative", display: "block", textAlign: "left", marginBottom:"28px"}}>
                  <DropdownButton id="dropdown-basic-button" title={searchTitle} className='integration-filter'>
                    {playlist.map(item => (
                        <Dropdown.Item as="button" onClick={()=> filterData(item)}>{item.name}</Dropdown.Item>
                    ))}
                  </DropdownButton>
                
                  </div>
            ): ("No playlist found")}
            </>
            ) : (
              "Loading..."
            )}

            {scriptVisible ? (
                <Container>
                <Row className='install-container-row'>
                    <Col className='first-col'>
                        <div  className='heading-first-col'>
                            <span>Install SWIRL video playlist in code editor</span>
                        </div>
                        <div className='detail-first-col'>
                            <span>
                                1. Click on “Copy Code” button below to copy the installation code <br/>
                                2. Open your theme editor and select the page where you want to place videos<br/>
                                3. Click on edit code<br/>
                                4. Paste the code where you want the video playlist to be displayed<br/>
                            </span>
                        </div>
                        <div className='copy-code-button'>
                            <Button variant="dark" onClick={copyCode}>Copy Code</Button>
                        </div>
                    </Col>
                    <Col className='second-col' >
                        <div  className='heading-second-col'>
                            <span>or Install as a section</span>
                        </div>
                        <div className='detail-second-col'>
                            <span>
                                1. Go to the Shopify Theme Editor. <br/>
                                2. Click on Add section, search for “SWIRL video playlist”.<br/>
                                3. Click on the SWIRL section and select the video playlist you just created from the dropdown list.<br/>
                            </span>
                        </div>
                        <div className='open-editor-button'>
                            <Button variant="dark" onClick={handleEditor}>Open theme editor</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
            ): null}
    
    </div>
  );
}