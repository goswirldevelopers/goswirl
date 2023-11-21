import React, { useState, useCallback } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import {CalloutCard} from '@shopify/polaris';
import {Layout} from '@shopify/polaris';
import {Card} from '@shopify/polaris';
import {Page, Grid, ButtonGroup, Toast, Frame} from '@shopify/polaris';
import {Spinner} from '@shopify/polaris';
import {MediaCard, VideoThumbnail} from '@shopify/polaris';
import "../../assets/css/playlistInstall.css"
import { Player, BigPlayButton } from "video-react";
import Form from 'react-bootstrap/Form';
import { step3 } from "../../assets"
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import VideoList from './VideoList';
import { useAppBridge } from '@shopify/app-bridge-react'
import { Redirect } from '@shopify/app-bridge/actions';

export default function Install(props){
    console.log(props, "install props")
    // const [videoList, setVideoList] = useState([])
    // const [loading, setLoading] = useState(true)
    const [allchecked, setAllChecked] = useState([]);
    const [backButton, setBackButton] = useState(false)
    const [nextButton, setNextButton] =  useState(false)
    const [active, setActive] = useState(false);
    const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false)

    const fetch = useAuthenticatedFetch()

    const app = useAppBridge();

   const handleNextButton = async() => {
    console.log("redirect page----")
    //redirect to playlist items
    Redirect.create(app).dispatch(Redirect.Action.APP, '/playListItems');

   }

   const handleBackButton = async() => {
    setBackButton(true)
   }
   
   const toggleActive = useCallback(() => setActive((active) => !active), []);

   const toastMarkup = active ? (
    <Toast content={message} onDismiss={toggleActive} error={error} />
    ) : null;

    const showToast = (msg, err) => {
        err ? setError(true) : setError(false);
        setMessage(msg);
        toggleActive();
    };

    const copyCode = async()=>{
        if (props.source == 'productPage') {
            navigator.clipboard.writeText(`
            <div id="swirl-short-videos" data-code="${props.playlist_data.brand_code}" data-playlist=""  data-pdp="product/,products/,collection/" ></div>
            <script type="text/javascript" async src="https://apigoswirl.com/short_video/shopify/swirl-short-video.min.js"></script>
            `)
            return alert('Copied')
        }
        else {
            navigator.clipboard.writeText(`
            <div id="swirl-short-videos" data-code="${props.playlist_data.brand_code}" data-playlist="${props.playlist_data.playlist_code}"  data-pdp="product/,products/,collection/"></div>
            <script type="text/javascript" async src="https://apigoswirl.com/short_video/shopify/swirl-short-video.min.js"></script>
            `)
            return alert('Copied')
        }
    }

    const handleEditor = () => {
        if (window.location.ancestorOrigins) {
            window.open(`${window.location.ancestorOrigins['0']}/admin/themes`, '_blank' )
            return;
        }
        alert('No playlist code copied')
    }

    return (
        <Frame>
            { (!backButton && !nextButton) ? (
            <div style={{height: "100vh"}}>
            <div style={{position: "relative", display:"flex"}}>
                <div>
                <h2 style={{fontWeight: "300", width:"118px", height:"46px", marginTop: "8px"}}>Playlist</h2>
                </div>
                
                <div text-center>
                <input
                    className='disable-title' 
                    value={props.playlist_data.name}
                    disabled
                />
                </div>
                <div className='action-button-group'>
                
                {!loading ? 
                    <ButtonGroup >
                        {/* <Button variant="light" onClick={handleBackButton}>Back</Button> */}
                        <Button variant="dark" onClick={handleNextButton}>Finish</Button>
                    </ButtonGroup>
                :
                    <Spinner
                        accessibilityLabel="Loading form field"
                        hasFocusableParent={loading}
                    />
                }
                    
                
                </div>
            </div>
            <div className='divider-line'></div>
            <div className='navigation-step-2'>
                <img src={step3}/>
            </div>
                
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

            </div> 
            ):(
                <>
                    {nextButton? (
                        null
                    ): (<VideoList/>)}
                </>
            )}
            {toastMarkup}
        </Frame>
      
    );
}