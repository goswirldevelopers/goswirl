
import React, { useState } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import {Button, CalloutCard} from '@shopify/polaris';
import {Layout} from '@shopify/polaris';
import {Card} from '@shopify/polaris';
import {Page, Grid} from '@shopify/polaris';
import {Spinner} from '@shopify/polaris';
import {MediaCard, VideoThumbnail} from '@shopify/polaris';
import {ButtonGroup, TextField} from '@shopify/polaris';
import { playlistCreate } from '../../assets'
import "../../assets/css/playlistType.css"
import { floatingImg, storyImg, pictureImg, carouselImg, step1, gridImg } from '../../assets';
import VideoList from './VideoList';

export default function ListType(props) {
    const [active, setActive] = useState(false)
    const [playlistType, setPlaylistType] = useState('')
    const [type, setType] = useState([
        {
            label: "Carousel video",
            img: carouselImg,
            value: 1
        },
        // {
        //     label: "story video",
        //     img: storyImg,
        //     value: 2
        // },
        // {
        //     label: "Picture-in-picture video",
        //     img: pictureImg,
        //     value: 3
        // },
        // {
        //     label: "Floating video",
        //     img: floatingImg,
        //     value: 4
        // },
        // {
        //     label: "Grid",
        //     img: gridImg,
        //     value: 5
        // }
    ])

    const fetch = useAuthenticatedFetch()

    const handlePlaylistType = async(item) => {
        setPlaylistType(item)
        setActive(true)
    }
   

    return (
        <>
            { active ? (
                <VideoList title={props.title} playlist={playlistType} source={props.source} product_handle={props.product_handle}/>
            ):(
                <>
                <div style={{position: "relative", display:"flex"}}>
                    <div>
                        <h2 style={{fontWeight: "300", width:"118px", height:"46px", marginTop: "8px"}}>Playlist</h2>
                    </div>
                
                    <div text-center>
                        <input
                            className='disable-title' 
                            value={props.title}
                            disabled
                        />
                    </div>
                    
                </div>
                <div className='divider-line'></div>
                <div className='navigation-step-1'>
                    <img src={step1}/>
                </div>
                <Grid columns={{sm:3}}>
                    
                        {type.map((item, key)=>(
                            <Grid.Cell  columnSpan={{xs: 3, sm: 3, md: 4, lg: 4, xl: 4}}>
                            
                                <div className='card-container text-center'>
                                <img className="type-image" src={item.img}></img>
                                <p className='type-label'>{item.label}</p>
                                <button className='type-button' onClick={()=>{handlePlaylistType(item.value)}}>Select</button>
                                {/* {item.value == 1? (
                                    <button className='type-button' onClick={()=>{handlePlaylistType(item.value)}}>Select</button>
                                ): (
                                    <button className='type-button' disabled={true}>Coming soon</button>
                                )} */}
                                </div>
                            
                            </Grid.Cell>
                        ))}
                    
                </Grid>
                </>
            )}
        </>
      
    );
}