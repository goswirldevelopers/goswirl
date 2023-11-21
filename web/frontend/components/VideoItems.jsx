
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
import { useAppBridge } from '@shopify/app-bridge-react'
import { Redirect } from '@shopify/app-bridge/actions';
import Edit_Upload_video_url from './upload/Edit_Upload_video_url'

export default function VideoItems(props) {
    
    const app = useAppBridge();

    const [videoList, setVideoList] = useState([])
    const [loading, setLoading] = useState(true)
    const [propsItem, setPropsItems] = useState({})
    const [editActive, setEditActive] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteItem, setDeleteItem] = useState()

    const fetch = useAuthenticatedFetch()
    
    const {data, refetch: refetchViideoList} =  useAppQuery({url: `/api/swril/getVideo`,
    reactQueryOptions: {
        onSuccess: (response) => {   
            if (response.data) {
                setVideoList(response.data.data)
                setLoading(false)
            }
        },
    },
    });
 

    function VideoDuration( duration ) {

        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
      
        return (
          <span className='video-duration'>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
        );
    }

   const handleCardClick = () => {
    Redirect.create(app).dispatch(Redirect.Action.APP, '/uploadVideo');
    };

    const changeListState = async(item) => {
        let productIdsArray = []
        item.cta_button = JSON.parse(item.cta_button)
        item.productIds = item.brand_product_id
        item.brand_product_id = item.brand_product_id.split(',')
        for (let index = 0; index < item.brand_product_id.length; index++) {
            productIdsArray.push({id: `gid://shopify/Product/${item.brand_product_id[index]}`})
        }
        item.brand_product_id = productIdsArray
        setPropsItems(item)
        setEditActive(true)
    }

    const deletePlaylist = async(e)=>{
        
        const payloadData = {
            video_id: deleteItem.video_id,
        }
        
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(payloadData),
          };  
      
          const deleteSingleVideo = await fetch('/api/swirl/deleteVideo', requestOptions)
          
          if (deleteSingleVideo.status == 200) {
            const data = await deleteSingleVideo.json();
            await refetchViideoList()
            setDeleteModal(false)
            if (data.data.status_code != 200) {
              setLoading(false)
            //   return showToast(data.data.message, false)
            }
            // return showToast('Playlist deleted', false)
          }
          else{
            setLoading(false)
            // return showToast('something went wrong', true)
        }
    }

    const openModal = async(item) => {
        setDeleteItem(item)
        setDeleteModal(true)
    }

    const handleClose = useCallback(() => {
        setDeleteModal(false);
      }, []);


    return (
        <>
        {editActive ? <Edit_Upload_video_url data={propsItem}/> :(
        <div style={{height: "100vh"}}>
            <div style={{position: "relative", display:"flex"}}>
                    <div>
                        <h2 style={{fontWeight: "300", width:"118px", height:"46px", marginTop: "8px"}}>Video</h2>
                    </div>
                
                    <div style={{marginLeft: "auto", marginRight:"0", marginTop:"auto", marginBottom:"auto"}}>
                        <Button variant="dark"  onClick={()=>handleCardClick()}>Add videos</Button>
                    </div>
                    
                </div>
                <div className='divider-line' ></div>
            {data ? (
                    <>
                        {videoList.length>0? (
                            <Grid >
                            {videoList.map((item, key) => (
                                <Grid.Cell columnSpan={{xs: 1, sm: 2, md: 3, lg: 2, xl: 2}}>
                                    <div className='container-box'>
                                        <Player
                                            playsInline
                                            poster={item.cover_image}
                                            src={item.server_url}
                                        >   
                                            <ControlBar disableCompletely={true}/>
                                            <BigPlayButton position="center" />
                                        </Player>
                                        <DropdownButton id="dropdown-item-button" title={<img src={option}/>} className="option-image">
                                            <Dropdown.Item as="button" onClick={()=>changeListState(item)}>Edit</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item as="button" onClick={()=>openModal(item)}>Delete</Dropdown.Item>
                                        </DropdownButton>
                                        {/* <button className="option-image"><img src={option}/></button> */}
                                        {/* <p className='duration'>{(item.video_len)?VideoDuration(item.video_len):<span className='video-duration'>NA</span>}</p> */}
                                        
                                    </div>
                                    <div className='video-item-title'>
                                        <p>{item.video_title}</p>
                                        <img src={share} style={{marginLeft: "auto", marginRight: "0", maxWidth: "24px", height:"24px"}}/>
                                    </div>
                                    
                            </Grid.Cell>
                            ))}
                        </Grid>
                        ):("no video found")}
                    </>
              
             ):(
                <div>
                  <Spinner
                    accessibilityLabel="Loading form field"
                    hasFocusableParent={loading}
                  />
                </div>
            )}      
        </div>
        )}
        {deleteModal ? (
                <div style={{height: '500px'}}>
                <Modal
                    open={deleteModal}
                    onClose={handleClose}
                >
                <Modal.Section>
                <div class='modal-container text-center'>
                    <div className='heading-modal'>
                        <span>Are you sure you want to delete?</span>
                    </div>

                    <div className='modal-action-button' style={{marginTop: "32px", display: "flex", justifyContent: "center"}}>
                        <ButtonGroup className="modal-buttons">
                            <Button variant="danger" className='modal-danger-button' style={{borderRadius: "10px", backgroundColor: "#FF0000"}} onClick={deletePlaylist}>Delete</Button>
                            <Button variant="dark" style={{borderRadius: "10px", backgroundColor: "#000000"}} onClick={handleClose}>Cancel</Button>
                        </ButtonGroup>
                    </div>
                </div>
                </Modal.Section>
                </Modal>
                </div>
            
            ) : null}
        </>
    );
}