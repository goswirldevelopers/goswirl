
import React, { useState, useCallback } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import { Frame, Toast} from '@shopify/polaris';
import {Page, Grid} from '@shopify/polaris';
import {Spinner} from '@shopify/polaris';
import {MediaCard, VideoThumbnail} from '@shopify/polaris';
import {ButtonGroup, Modal} from '@shopify/polaris';
import "../../assets/css/playlistItem.css"
import { activeImg, inactive, option, carouselImg, deleteIcon } from '../../assets';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import SplitButton from 'react-bootstrap/SplitButton';
import { useAppBridge } from '@shopify/app-bridge-react'
import { Redirect } from '@shopify/app-bridge/actions';
import EditListItem from './EditListItem';
import { Player, BigPlayButton, ControlBar } from "video-react";

export default function ListItem(props) {
   
    const app = useAppBridge();

    const [playlist, setPlaylist] = useState([])
    const [filterPlaylist, setFilterPlaylist] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeState, setActiveState] = useState(false)
    const [active, setActive] = useState(false);
    const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);
    const [propsNextData, setPropsNextData] = useState()
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteItem, setDeleteItem] = useState()
    const [manageVideoModal, setManageVideoModal] = useState(false)
    const [manageVideoData, setManageVideoData] = useState()
    const [videoList, setVideoList] = useState([])

    const fetch = useAuthenticatedFetch()
    
    const {data, refetch: refetchList} =  useAppQuery({url: `/api/swril/getPlaylist`,
    reactQueryOptions: {
        onSuccess: (response) => {   
            if (response.data) {
                setPlaylist(response.data.data)
                setFilterPlaylist(response.data.data)
                setLoading(false)
            }
        },
    },
    });

    const handleComp = async(item) => {
        Redirect.create(app).dispatch(Redirect.Action.APP, '/playlist');
    }

    const changeListState = async(item)=>{

        const statusValue = item.status == "1" ? 0 : 1
        const payloadData = {
            playlist_id: item.playlist_id,
            status: statusValue,
        }
        
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(payloadData),
          };  
      
          const updatePlaylistStatus = await fetch('/api/swirl/statusPlaylist', requestOptions)
          
          if (updatePlaylistStatus.status == 200) {
            const data = await updatePlaylistStatus.json();
            await refetchList()
            if (data.data.status_code != 200) {
              setLoading(false)
              return showToast(data.data.message, false)
            }
            return showToast('Playlist status changed', false)
          }
          else{
            setLoading(false)
            return showToast('something went wrong', true)
        }
    }

    const deletePlaylist = async(e)=>{

        const payloadData = {
            playlist_id: deleteItem.playlist_id,
        }
        
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(payloadData),
          };  
      
          const deleteSingleList = await fetch('/api/swirl/deletePlaylist', requestOptions)
          
          if (deleteSingleList.status == 200) {
            const data = await deleteSingleList.json();
            await refetchList()
            setDeleteModal(false)
            if (data.data.status_code != 200) {
              setLoading(false)
              return showToast(data.data.message, false)
            }
            return showToast('Playlist deleted', false)
          }
          else{
            setLoading(false)
            return showToast('something went wrong', true)
        }
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

    const editList = async(item) => {
        setPropsNextData(item)
        setActiveState(true)
    }

    const openModal = async(item) => {
        setDeleteItem(item)
        setDeleteModal(true)
    }

    const handleClose = useCallback(() => {
        setDeleteModal(false);
        setManageVideoModal(false)
        setVideoList([])
      }, []);

    const filterData = async(filterItem) => {
        if (filterItem == '0') {
            const filterData = playlist.filter(item => item.status == '0')
            setFilterPlaylist(filterData)
        }
        else if (filterItem == '1') {
            const filterData = playlist.filter(item => item.status == '1')
            setFilterPlaylist(filterData)
        }
        else{
            await refetchList()
        }
    }

    const manageVideoItem = async(item) => {
        console.log(item, "item is")
        setManageVideoData(item)
        setManageVideoModal(true)

        const payloadData = {
            videoId: item.video_id,
        }
        
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(payloadData),
          };  
      
          const getVideosData = await fetch('/api/swirl/getVideosByIds', requestOptions)
          
          if (getVideosData.status == 200) {
            const data = await getVideosData.json();
            console.log(data.data.data, "data is---")
            setVideoList(data.data.data)
          }
          else{
            setLoading(false)
            return showToast('something went wrong with get videos', true)
        }
    }

    function VideoDuration( duration ) {

        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
      
        return (
          <span className='video-duration'>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
        );
    }

    const updateVideoList = (deleteItem) => {
        if (videoList.length <= 1) {
            return alert('atleaset one video is required in playlist.')
        }
        const newVideoArray = videoList.filter(item=> item.video_id != deleteItem.video_id)
        setVideoList(newVideoArray)
    }

    const updateVideoPlaylist = async () => {
        console.log(manageVideoData, "manage ")

        const videoListDataTemp = videoList.map(data=> data.video_id)
        const videoListData = videoListDataTemp.join(',')
        
        const payloadData = {
            title: manageVideoData.name,
            video_id: videoListDataTemp,
            type: manageVideoData.type,
            playlist_id: manageVideoData.playlist_id
        }
        console.log(payloadData, "pay load")

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(payloadData),
        };  
    
        const updatePlaylist = await fetch('/api/swirl/editPlaylist', requestOptions)
        
        if (updatePlaylist.status == 200) {
            
            const data = await updatePlaylist.json();
            
            if (data.data.status_code != 200) {
            setLoading(false)
            await refetchList()
            return showToast(data.data.message, false)
            }
            else{
                showToast('Playlist updated successfully', false)
                await refetchList()
                setNextButton(true)
                return;
            }
        }
        else{
            setLoading(false)
            return showToast('something went wrong', true)
        }
    }
    return (
        <Frame>
            { activeState ? (
                <EditListItem data={propsNextData} />
            ):(
                <>
            <div style={{position: "relative", display:"flex"}}>
                    <div>
                        <h2 style={{fontWeight: "300", width:"118px", height:"46px", marginTop: "8px"}}>Playlist</h2>
                    </div>
                
                    <div style={{marginLeft: "auto", marginRight:"0", marginTop:"auto", marginBottom:"auto"}}>
                        <Button variant="dark"  onClick={handleComp}>Create Playlist</Button>
                    </div>
                    
                </div>
                <div className='divider-line' ></div>
                <div style={{position: "relative", display: "block", textAlign: "right", marginBottom:"28px"}}>
                <DropdownButton id="dropdown-basic-button" title="Status" className='status-filter'>
                    <Dropdown.Item as="button" onClick={()=> filterData('all')}>All</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={()=> filterData('1')}><img src={activeImg}/></Dropdown.Item>
                    <Dropdown.Item as="button" onClick={()=> filterData('0')}><img src={inactive}/></Dropdown.Item>
                </DropdownButton>

                </div>
            {data ? (
                <>
                     {(filterPlaylist.length > 0)? (
                        <Grid >
                        {filterPlaylist.map((item, key) => (
                            <Grid.Cell columnSpan={{xs: 3, sm: 3, md: 4, lg: 4, xl: 4}}>
                                <div className='playlist-item-container' style={{marginTop: "16px"}}>
                                    <div className='wrap'>
                                        <div>
                                            {item.status == "0"? <img src={inactive}/> : <img src={activeImg} />}
                                        </div>
                                        <div>
                                        <DropdownButton id="dropdown-item-button" title={<img src={option}/>} className="option-image-playlist">
                                            <Dropdown.Item  as="button" onClick={()=>changeListState(item)}>{(item.status==0)?"Active":"Inactive"}</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item as="button" onClick={()=>manageVideoItem(item)}>Manage videos</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item as="button" onClick={()=>editList(item)}>Edit</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item as="button" onClick={()=>openModal(item)}>Delete</Dropdown.Item>
                                            {/* <Dropdown.Divider />
                                            <Dropdown.Item as="button">Get Code</Dropdown.Item> */}
                                        </DropdownButton>
                                        </div>
                                    </div>
                                    <div className='item-type-image'>
                                        <img className='' src={carouselImg} />
                                    </div>
                                    <div className='playlist-detail text-center' style={{marginTop: "16px"}}>
                                        <span className='playlist-item-title text-center'>{item.name}</span><br/>
                                        <span className='playlist-item-created text-center'>{item.created_at}</span>
                                    </div>
                                </div>
                        </Grid.Cell>
                        ))}
                    </Grid>
                     ):(
                        "No playlist available"
                     )}
                </>
             ):(
                        <div>
                        <Spinner
                            accessibilityLabel="Loading form field"
                            hasFocusableParent={loading}
                        />
                        </div>
            )} 
            </>
            )}   
            {toastMarkup}
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

            {manageVideoModal? (
                <Modal
                large
                open={manageVideoModal}
                onClose={handleClose}
                >
                    <Modal.Section>
                        {/* <ManageVideos item={manageVideoData}/> */}
                        <>
                            <div style={{position: "relative", display:"flex"}}>
                                <div>
                                <h2 style={{fontWeight: "300", width:"118px", height:"46px", marginTop: "8px"}}>Playlist</h2>
                                </div>
                                
                                <div text-center>
                                <input
                                    className='disable-title' 
                                    value={manageVideoData.name}
                                    disabled
                                />
                                </div>
                            </div>
                            <div className='divider-line'></div>

                {videoList.length > 0? (
                    <div>
                <Grid >
                    {videoList.map((item, key) => (
                        <Grid.Cell columnSpan={{xs: 2, sm: 2, md: 2, lg: 2, xl: 2}}>
                            <div className='container-box'>
                                <Player
                                    playsInline
                                    poster={item.cover_image}
                                    src={item.server_url}
                                >
                                    <ControlBar disableCompletely={true}/>
                                    <BigPlayButton position="center" />
                                </Player>
                                <button style={{border:"none", background: "transparent",position:"absolute", right:"5px", top:"5px"}} onClick={()=>updateVideoList(item)}>{<img src={deleteIcon}/>}</button>
                                <p className='duration'>{(item.video_len)?VideoDuration(item.video_len):<span className='video-duration'>NA</span>}</p>
                                
                            </div>
                            <div className='video-title'>
                            <span>{item.video_title}</span>
                            </div>
                            
                    </Grid.Cell>
                    ))}
                </Grid>

                <div style={{marginTop: "48px"}} className="update-paylist-btn">
                    <Button variant="dark"  onClick={updateVideoPlaylist}>Save</Button>
                </div>
                </div>
          
                ):(
                    <div>
                    <Spinner
                        accessibilityLabel="Loading form field"
                        hasFocusableParent={loading}
                    />
                    </div>
                )}
                        </>
                    </Modal.Section>
                </Modal>
                
            ):(null)
            }
        </Frame>
      
    );
}