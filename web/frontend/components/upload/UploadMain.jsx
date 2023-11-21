
import React, { useState } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import {Button, CalloutCard} from '@shopify/polaris';
import {Layout} from '@shopify/polaris';
import {Card} from '@shopify/polaris';
import {Page, Grid} from '@shopify/polaris';
import {Spinner} from '@shopify/polaris';
import {MediaCard, VideoThumbnail} from '@shopify/polaris';
import {ButtonGroup, TextField} from '@shopify/polaris';
import { uploadFile, uploadUrl } from '../../assets';
import "../../assets/css/uploadMain.css";
import Upload_video_url from './Uplad_video_url';
import Upload_video from './Upload_video'

export function UploadMain() {
    const [uploadType, setUploadType] = useState('')
    const [active, setActive] = useState(false)
    const [type, setType] = useState([
        {
            label: "Video URL",
            img: uploadUrl,
            btnText: "Add URL",
            subText: "Enter video url",
            value: "url"
        },
        {
            label: "Upload file",
            img: uploadFile,
            btnText: "Upload videos",
            subText: "Max Size: 100 Mb, Format: .mp4",
            value:"upload"
        },
        
    ])

    const fetch = useAuthenticatedFetch()

    const handleUploadType = async(item) => {
        setUploadType(item)
       setActive(true)
    }
   

    return (
        <>
            {active ? (
            <>
                {(uploadType.toString() == "url") ? (
                    <Upload_video_url/>
                ):(
                <Upload_video/>
                )}
            </>) : (
                < div style={{height: "100vh"}}>
                    <div className='main-heading-container'>
                <span>Add videos to your library</span>
            </div>
                
                <Grid columns={{sm:3}}>
                    
                        {type.map((item, key)=>(
                            <Grid.Cell  columnSpan={{xs: 3, sm: 3, md: 4, lg: 4, xl: 4}}>
                            
                                <div className='upload-card-container text-center'>
                                <img className="upload-type-image" src={item.img}></img>
                                <div className='upload-action-container text-center'>
                                    <p className='upload-type-label text-center'>{item.label}</p>
                                    <span className='text-center'>{item.subText}</span>
                                    <button className='upload-type-button' onClick={()=>{handleUploadType(item.value)}}>{item.btnText}</button>
                                </div>
                                </div>
                            
                            </Grid.Cell>
                        ))}
                    
                </Grid>
                </div>
            )}
        </>
      
    );
}