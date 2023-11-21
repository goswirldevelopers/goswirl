import {
    Page,
    Layout,
  } from "@shopify/polaris";

  
  import { UploadMain } from "../components";
  
  
  export default function PageName() {
    return (
      <>
        {/* <TitleBar title="Swirl Upload" primaryAction={null} /> */}
        <Page >
        <Layout>
        
         
  
          <Layout.Section>
            <div style={{marginTop: "24px"}}>
              {/* <span style={{weight:"500", fontSize:"24px", lineHeight:"30.36px"}}>Upload video</span> */}
              <div style={{marginTop: "56px"}}>
                <UploadMain />
              </div>
            </div>
            {/* <ProductsCard /> */}
          </Layout.Section>
   
        </Layout>
        </Page>
       
     </>
    );
  }
  