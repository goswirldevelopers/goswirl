
import React, { useState, useCallback } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import {Button, CalloutCard} from '@shopify/polaris';
import {Layout} from '@shopify/polaris';
import {Card} from '@shopify/polaris';
import {Page, Grid} from '@shopify/polaris';
import {Spinner} from '@shopify/polaris';
import {MediaCard, VideoThumbnail} from '@shopify/polaris';
import {ButtonGroup, Modal, TextContainer, TextField} from '@shopify/polaris';
import { playlistCreate } from '../../assets'
import "../../assets/css/playlistCreate.css"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListType from './ListType';

export default function CreateList(props) {

    const [active, setActive] = useState(false);
    const [playlistTitle, setPlaylistTitle] = useState('')
    const [playlistType, setPlaylistType] = useState(false)
    const fetch = useAuthenticatedFetch()
   
    const openModal = async(e) => {
        e.preventDefault()
        setActive(true)
    }

    const handleClose = useCallback(() => {
        setActive(false);
      }, []);

    const handleTitle = useCallback(value => setPlaylistTitle(value), [])

    const createInitiate = async()=>{
        if (!playlistTitle || playlistTitle.length == 0) {
            return alert('Playlist title is required')
        }
        setActive(false)
        setPlaylistType(true)
    }


    return (
        <>
            
        {!playlistType ? (
            <Container>
                
                <div className='create-container text-center' style={{height: "100vh"}}>
                    <img className='playlist-create' src={playlistCreate}></img><br/>
                    <button className='playlist-create-button' primary onClick={openModal}>Create new video playlist</button>
                </div>
                    
            </Container>
        ) : null}
            {active ? (
                <div style={{height: '500px'}}>
                <Modal
                    open={active}
                    onClose={handleClose}
                >
                <Modal.Section>
                <div class='modal-container text-center'>
                <TextField
                label="Enter playlist name"
                value={playlistTitle}
                onChange={handleTitle}
                />
                <button className="playlst-title-button" onClick={createInitiate}>Save</button>
                </div>
                </Modal.Section>
                </Modal>
                </div>
            
            ) : null}
        {playlistType ? (
                <ListType title={playlistTitle}/>
            ) : null}
        </>
      
    );
}