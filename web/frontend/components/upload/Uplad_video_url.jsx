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
import {useState, useCallback} from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import { ResourcePicker } from "@shopify/app-bridge-react";
import "../../assets/css/upload.css"
import Form from 'react-bootstrap/Form';
import { Player, BigPlayButton, ControlBar } from "video-react";
import { useAppBridge } from '@shopify/app-bridge-react'
import { Redirect } from '@shopify/app-bridge/actions';

export default function Upload_video_url() {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("")
  const [buttonText, setButtonText] = useState("Buy Now")
  const [openResourcePicker, setOpenResourcePicker] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("")  
  const [productId, setProductId] = useState()
  const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);
	const [loading, setLoading] = useState(false)
	const [active, setActive] = useState(false);
  const [videoLink, setVideoLink] = useState('')
  const [productHandle, setProductHandle] = useState("")
  const [fileContent, setFileContent] = useState()
  const [activeThumbnailValue, setActiveThumbnailValue] = useState('automatic')
  const [activeThumbnail, setActiveThumbnail] = useState(false)
  const [previewImage, setPreviewImage] = useState([])
  const [pickerProduct, setPickerProduct] = useState()
  const [productName, setProductName] = useState([])

  const hideResourcePicker = () => setOpenResourcePicker(false);
  const showResourcePicker = () => setOpenResourcePicker(true);

  const fetch = useAuthenticatedFetch();
  const app = useAppBridge();
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
    setPickerProduct(selectionProducts)
    setProductId(productIds.join(','))
    setProductHandle(productHandles.join(','))
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

  const handlePreview = async (e) => {
    setPreviewImage(e.target.files)
  }

  const saveVideo = async(e) => {
    e.preventDefault()
    setLoading(true)
    let fileData = []
    let previewAvailable = false
    
    if (previewImage.length>0) {
      fileData.push(previewImage[0])
      previewAvailable = true
    }
    if (!title  || !productId || !productHandle) {
      setLoading(false)
      return showToast('all fields are required', true)
    }
    if (!videoLink || !videoLink.includes('.mp4')) {
      setLoading(false)
      return showToast('Only .mp4 Video file URL is required', true)
    }
    if (productName.length > 7) {
      setLoading(false)
      return showToast('Max 7 products selection is allowed.', true)
    }
    
    let formData = new FormData();
    formData.append('video_title', title)
    formData.append('brand_product_id', productId)
    formData.append('access_token', 'awdlsuezjficqginlsdr')
    formData.append('video_link', videoLink)
    formData.append('button_text', buttonText)
    formData.append('product_handle', productHandle)
    formData.append('preview', previewAvailable)
    formData.append('video_file', fileData[0])

    const requestOptions = {
      method: 'POST',
      headers: {
        // 'Content-Type': 'multipart/form-data',
      },
      body: formData,
    };  

    const uploadData = await fetch('/api/swirl/single/video/upload', requestOptions)
    
    if (uploadData.status == 200) {
      const data = await uploadData.json();
      if (data.data.status_code == 1) {
        setLoading(false)
        setTitle('')
        setButtonText('')
        setProductId('')
        setSelectedProduct('')
        setProductHandle('')
        showToast(data.data.message, false)
        handleRedirectComp()
        return;
      }
      setLoading(false)
      showToast(data.data.message, true)
      return;
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

  const handleThumbnail = async(e)=>{
    setActiveThumbnailValue(e.target.value)
    if(e.target.value == 'custom'){
      setActiveThumbnail(true)
    }
    else{
      setActiveThumbnail(false)
    }
    
  }

  const handleRedirectComp = async(item) => {
    Redirect.create(app).dispatch(Redirect.Action.APP, '/listVideo');
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
                <span >Video URL <Badge size="small" status="warning">required</Badge></span>
                    <TextField
                      value={videoLink}
                      placeholder="Enter .mp4 url"
                    onChange={handleVideoLink}
                    />
                </FormLayout>

                

                <FormLayout>
                  <span >Product attached <Badge size="small" status="warning">required</Badge></span>
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
                    <div key={`inline-radio`} className="mb-3" onChange={handleThumbnail}>
                      <Form.Check
                        inline
                        label="Automatic"
                        name="group1"
                        type="radio"
                        checked = {activeThumbnailValue == 'automatic'? true : false}
                        id={`inline-radio-1`}
                        value="automatic"
                      />
                      <Form.Check
                        inline
                        label="Custom"
                        name="group1"
                        type="radio"
                        checked = {activeThumbnailValue == 'custom'? true : false}
                        id={`inline-radio-2`}
                        value='custom'
                      />
                    </div>
                  </FormLayout>

                  {activeThumbnail ? (
                      <div style={{marginBottom: "24px"}}>
                        <Form.Group controlId="formFile" className="mb-3" label="Upload Video">
                          <Form.Control onChange={handlePreview} type="file"/>
                        </Form.Group>
                      </div>
                  ): null}   
                
              </Layout.AnnotatedSection>
            </Layout>
            <div className='submit-button'>
            {!loading ? <Button left onClick={saveVideo}>Upload</Button> :
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
              <ControlBar disableCompletely={true}/>
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