
import React, { useState, useCallback } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import {Page, Grid} from '@shopify/polaris';
import {Spinner} from '@shopify/polaris';
import "../assets/css/videoItems.css"
import { Player, BigPlayButton, ControlBar } from "video-react";
import {ButtonGroup, Modal} from '@shopify/polaris';
import {option, share} from "../assets"
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';


export default function Settings(props) {
    

    const [playlistAutoPlay, setPlaylistAutoPlay] = useState(0)
    const [playlistTotalViews, setPlaylistTotalViews] = useState(0)
    const [playlistVideoTimes, setPlaylistVideoTimes] = useState(0)
    const [playlistProductCarousel, setPlaylistProductCarousel] = useState(0)
    const [playlistButtonStyle, setPlaylistButtonStyle] = useState(0)
    const [playlistSize, setPlaylistSize] = useState()
    const [playlistIconColor, setPlaylistIconColor] = useState('')
    const [playlistBackground, setPlaylistBackground] = useState('')



    const fetch = useAuthenticatedFetch()
    
    const {data} =  useAppQuery({url: `/api/swril/getVideoSettings`,
    reactQueryOptions: {
        onSuccess: (response) => {   
            if (response.data) {
                console.log(response.data, "response is---")
            }
        },
    },
    });
 


    return (
        <>
            <div style={{height: "100vh"}}>
            <div style={{position: "relative", display:"flex"}}>
                    <div>
                        <h2 style={{lineHeight:"45.54px",fontWeight: "500", height:"46px", marginTop: "8px", fontSize: "36px"}}>Video setting</h2>
                    </div>
                
                    
                </div>
                <div className='divider-line' ></div>
                
            <Grid>
                <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                    <Accordion defaultActiveKey="0">

                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Playlist Setting</Accordion.Header>
                            <Accordion.Body>
                                <div>
                                    <div key={`default-checkbox`} className="" >
                                        <Form.Check
                                            inline
                                            label="Auto Play"
                                            name="group1"
                                            type="checkbox"
                                            checked = {playlistAutoPlay == '1'? true : false}
                                            id={`inline-checkbox-1`}
                                            value="automatic"
                                        />
                                        <Form.Check
                                            inline
                                            label="Total views"
                                            name="group1"
                                            type="checkbox"
                                            checked = {playlistTotalViews == '1'? true : false}
                                            id={`inline-checkbox-2`}
                                            value='custom'
                                        />
                                    </div>
                                    
                                    <div key={`default-checkbox`} className="" style={{marginTop: '16px'}}>
                                        <Form.Check
                                            inline
                                            label="Video time"
                                            name="group1"
                                            type="checkbox"
                                            checked = {playlistAutoPlay == '1'? true : false}
                                            id={`inline-checkbox-1`}
                                            value="automatic"
                                        />
                                        <Form.Check
                                            inline
                                            label="Products on Carsousel"
                                            name="group1"
                                            type="checkbox"
                                            checked = {playlistTotalViews == '1'? true : false}
                                            id={`inline-checkbox-2`}
                                            value='custom'
                                        />
                                    </div>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Player Setting</Accordion.Header>
                            <Accordion.Body>
                            
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Grid.Cell>
                {/* Preview */}
                
            </Grid>
            </div>
        </>
    );
}