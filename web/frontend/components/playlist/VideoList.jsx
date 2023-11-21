
import React, { useState, useCallback } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import {Page, Grid, ButtonGroup, Frame, Toast} from '@shopify/polaris';
import {Spinner} from '@shopify/polaris';
import "../../assets/css/videoList.css"
import { Player, BigPlayButton, ControlBar } from "video-react";
import { step2 } from "../../assets"
import Button from 'react-bootstrap/Button';
import ListType from './ListType';
import Install from './Install';

export default function VideoList(props) {

    const [videoList, setVideoList] = useState([])
    const [loading, setLoading] = useState(false)
    const [allchecked, setAllChecked] = useState([]);
    const [backButton, setBackButton] = useState(false)
    const [nextButton, setNextButton] =  useState(false)
    const [active, setActive] = useState(false);
    const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);
    const [playlistData, setPlaylistData] = useState([])

    const fetch = useAuthenticatedFetch()
    
    const {data} =  useAppQuery({url: `/api/swril/getVideo`,
    reactQueryOptions: {
        onSuccess: (response) => {   
            if (response.data) {
                setVideoList(response.data.data)
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

    
   const handleChange = (e) => {
        if (allchecked.length > 12) {
            return alert('maximum 11 videos allowed')
        }
        else{
            if (e.target.checked) {
                setAllChecked([...allchecked, e.target.value]);
            } else {
                setAllChecked(allchecked.filter((item) => item !== e.target.value));
            }
        }

   }

   const handleInstallRedirect = () => {
     Redirect.create(app).dispatch(Redirect.Action.APP, '/integration');
   };

   const handleNextButton = async() => {
    
    if (allchecked.length == 0) {
        return alert('select atleast 1 video')
    }
    setLoading(true);
    
    if(props.product_handle && props.source == "productPage"){
        
        const payloadData = {
            handle: props.product_handle,
            video_id: allchecked,
            type: props.playlist
        }
        
        const requestOptions = {
            method: 'POST',
            headers: {
            //   'Content-Type': 'multipart/form-data',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(payloadData),
        };  
    
        const createPlaylist = await fetch('/api/swirl/product/addPlaylist', requestOptions)
        
        if (createPlaylist.status == 200) {
            const data = await createPlaylist.json();
            if (data.data.status_code == 1) {
                setLoading(false)
                setPlaylistData(data.data.data)
                setNextButton(true)
                showToast(data.data.message, false)

                return 
            
            }
            
            showToast('Product playlist created', false)
            // setNextButton(true)
            handleInstallRedirect()
            return;
        }
        else{
            setLoading(false)
            return showToast('something went wrong', true)
        }

    }
    
    else if(props.source == "editPlaylist"){
        console.log(props, "props")
        const payloadData = {
            title: props.title,
            video_id: allchecked,
            type: props.playlist,
            playlist_id: props.playlist_id
        }

        const requestOptions = {
            method: 'POST',
            headers: {
            //   'Content-Type': 'multipart/form-data',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(payloadData),
        };  
    
        const createPlaylist = await fetch('/api/swirl/editPlaylist', requestOptions)
        
        if (createPlaylist.status == 200) {
            const data = await createPlaylist.json();

            if (data.data.status_code == 1) {
                setLoading(false)
                setPlaylistData(props.playlist_data)
                setNextButton(true)
                showToast(data.data.message, false)
                return 
               
            }
            
            showToast('Playlist updated successfully', false)
            // setNextButton(true)
            // handleInstallRedirect()
            return;
        }
        else{
            setLoading(false)
            return showToast('something went wrong', true)
        }
    }

    else{

        const payloadData = {
            title: props.title,
            video_id: allchecked,
            type: props.playlist
        }

        const requestOptions = {
            method: 'POST',
            headers: {
            //   'Content-Type': 'multipart/form-data',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(payloadData),
        };  

        const createPlaylist = await fetch('/api/swirl/addPlaylist', requestOptions)

        if (createPlaylist.status == 200) {
            const data = await createPlaylist.json();
            console.log(data, "data---");
            if (data.data.status_code == 1) {
                setLoading(false)
                setPlaylistData(data.data.data)
                setNextButton(true)
                showToast(data.data.message, false)
                return 
            }
            
            // setNextButton(true)
            showToast(data.data.message, false)
            // handleInstallRedirect()
            
            
            return;
        }
        else{
            setLoading(false)
            return showToast('something went wrong', true)
        }

    }

    
    
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

    return (
        <Frame>
        <div style={{height: "100vh"}}>
            { (!backButton && !nextButton) ? (
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
                <div className='action-button-group'>
                {!loading ? 
                <ButtonGroup >
                    <Button variant="light" onClick={handleBackButton}>Back</Button>
                    <Button variant="dark" onClick={handleNextButton}>Submit</Button>
                </ButtonGroup> :
                <Spinner
                  accessibilityLabel="Loading form field"
                  hasFocusableParent={loading}
                />
              }
                </div>

            </div>
            <div className='divider-line'></div>
            <div className='navigation-step-2'>
                <img src={step2}/>
            </div>
                
            {data ? (
                <>
                {videoList.length > 0 ? (
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
                                <input type="checkbox" class="checkbox" id={item.video_id} value={item.video_id} onChange={handleChange}/>
                                {/* <p className='duration'>{(item.video_len)?VideoDuration(item.video_len):<span className='video-duration'>NA</span>}</p> */}
                                
                            </div>
                            <div className='video-title'>
                            <span>{item.video_title}</span>
                            </div>
                            
                        </Grid.Cell>
                        ))}
                    </Grid>
                ):(
                    "no video available, first upload video to create playlist"
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
            ):(
                <>
                    {nextButton? (
                        // <Install title={props.title} video_id={allchecked} list_type={props.playlist} source={props.source} product_handle={props.product_handle} playlist_id={props.playlist_id}/>
                        <Install playlist_data={playlistData} source={props.source}/>
                    ): (<ListType title={props.title} source={props.source} video_id={props.video_id} playlist_id={props.playlist_id}/>)}
                </>
            )}
        </div>
        {toastMarkup}

        </Frame>
      
    );
}