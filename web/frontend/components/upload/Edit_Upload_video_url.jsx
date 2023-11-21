import {DropZone, LegacyStack, Thumbnail, Text, Card, Grid} from '@shopify/polaris';
import {
	Layout,
	Button,
	FormLayout,
	TextField,
  Toast,
  Spinner,
  Badge,
  Frame
} from "@shopify/polaris";
import {useState, useCallback, useEffect} from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import { ResourcePicker } from "@shopify/app-bridge-react";
import "../../assets/css/upload.css"
import Form from 'react-bootstrap/Form';
import { Player, BigPlayButton, ControlBar } from "video-react";

export default function Edit_Upload_video_url(props) {

  const [title, setTitle] = useState('')
  const [buttonText, setButtonText] = useState('')
  const [openResourcePicker, setOpenResourcePicker] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('')  
  const [productId, setProductId] = useState('')
  const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);
	const [loading, setLoading] = useState(false)
	const [active, setActive] = useState(false);
  const [videoLink, setVideoLink] = useState('')
  const [productHandle, setProductHandle] = useState('')
  const [pickerProduct, setPickerProduct] = useState()
  const [productName, setProductName] = useState([])

  const [fileContent, setFileContent] = useState()

  const hideResourcePicker = () => setOpenResourcePicker(false);
  const showResourcePicker = () => setOpenResourcePicker(true);

  const fetch = useAuthenticatedFetch();

  useEffect(()=>{
    setTitle(props.data.video_title)
    {props.data.cta_button ? setButtonText(props.data.cta_button.buy_now_text) : setButtonText('')}
    setSelectedProduct(`${props.data.brand_product_id.length} products selected`)
    setVideoLink(props.data.server_url)
    setProductId(props.data.productIds)
    setProductHandle(props.data.brand_product_handle)
    setPickerProduct(props.data.brand_product_id)
  },[])

  const handleSelectProduct = async ({ selection }) => {
    // Selected product ID
    // selection[0].id
    
    let productIds = []
    let productHandles = []
    let selectionProducts = []
    let productName = []
    for (let index = 0; index < selection.length; index++) {
      const spiltId = selection[index].id.split('/')      
      productIds.push(spiltId[spiltId.length-1])
      productHandles.push(selection[index].handle)
      selectionProducts.push({id: selection[index].id})
      productName.push(selection[index].title)
    }
    setSelectedProduct(selection.length + ' product added')
    setOpenResourcePicker(false)
    setProductId(productIds.join(','))
    setProductHandle(productHandles.join(','))
    setPickerProduct(selectionProducts)
    setProductName(productName)
  };

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFiles((files) => [...files, ...acceptedFiles]),
    [],
  );

  const handleTitle = useCallback(value => setTitle(value), [])

  const handleButtonText = useCallback(value => setButtonText(value), [])

  const handleVideoLink = useCallback(value => setVideoLink(value), [])

  const editVideo = async(e) => {
    e.preventDefault()
    setLoading(true)
    if (!title  || !productId || !productHandle) {
      setLoading(false)
      return showToast('all fields are required', true)
    }
    if (productName.length > 7) {
      setLoading(false)
      return showToast('Max 7 products is allowed.', true)
    }
   
    const payloadData = {
      video_title: title,
      video_id: props.data.video_id,
      button_text: buttonText,
      brand_product_id: productId,
      product_handle: productHandle
  }
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(payloadData),
    };  

    const uploadData = await fetch('/api/swirl/editVideo', requestOptions)
  
    if (uploadData.status == 200) {
      const data = await uploadData.json();
      if (data.data.status_code != 200) {
        setLoading(false)
        return showToast(data.data.message, false)
      }
      setLoading(false)
      setTitle('')
      setButtonText('')
      setVideoLink('')
      setProductId('')
      setSelectedProduct('')
      setProductHandle('')
      return showToast('uploaded successfully', false)
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

  const handleFileDrop = (e) => {
    var url = window.URL.createObjectURL(new Blob(e.target.files, {type: "video/mp4"}))
    setFileContent(url)
  }

  return (
    <Frame>
    <Grid>
        <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 8, xl: 8}} >
            <Layout style={{marginLeft: "10px", marginRight: "10px"}}>
            <Layout.AnnotatedSection>
                <FormLayout>
                  <span>Video Title <Badge size="small" status="warning">required</Badge></span>
                  <TextField
                  required
                    value={title}
                  onChange={handleTitle}
                  />
                </FormLayout>

                <FormLayout>
                  <span >Product attached</span>
                  <Button disclosure="select" fullWidth onClick={showResourcePicker} textAlign="right"/>
                  <ul>
                    {productName.length>0 &&
                      productName.map(item => (
                        <li>{item}</li>
                      ))}
                  </ul>
                  <br/>
                </FormLayout>
                
                <FormLayout>
                  <span>Call-to-action</span>
                  <TextField
                    value={buttonText}
                  onChange={handleButtonText}
                  />
                  </FormLayout>

                  <FormLayout>
                    <span>Video thumbnail</span>
                    <div key={`inline-radio`} className="mb-3">
                      <Form.Check
                        inline
                        label="Automatic"
                        name="group1"
                        type="radio"
                        // checked = {true}
                        defaultChecked
                        id={`inline-radio-1`}
                      />
                      <Form.Check
                        inline
                        label="Custom"
                        name="group1"
                        type="radio"
                        id={`inline-radio-2`}
                      />
                    </div>
                  </FormLayout>
                
              </Layout.AnnotatedSection>
            </Layout>
            <div className='submit-button'>
            {!loading ? <Button left onClick={editVideo}>Upload</Button> :
              <Spinner
                accessibilityLabel="Loading form field"
                hasFocusableParent={loading}
              />
            }
            </div>
        </Grid.Cell>
        
        <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 4, xl: 4}}>
          <Layout>
            <Layout.AnnotatedSection >
              <span>Preview</span>
            {videoLink.length>0 ? (
              <div style={{marginTop: "40px"}}>
              <Player
              playsInline
              src={videoLink}
              fluid={false}
              width={200}
              height={400}
            >
              <ControlBar disableCompletely="true"/>
              <BigPlayButton position="center" /></Player>
            </div>
            ): null}
            </Layout.AnnotatedSection>
          </Layout>
          
        </Grid.Cell>
        
    </Grid>
    <br/>
    
    <ResourcePicker
      resourceType="Product"
      showVariants={false}
      open={openResourcePicker}
      onCancel={hideResourcePicker}
      onSelection={handleSelectProduct}
      allowMultiple={true}
      actionVerb="select"
      initialSelectionIds = {pickerProduct}
    />
    {toastMarkup}

    </Frame>
  );
}