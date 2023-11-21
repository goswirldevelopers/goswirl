import Settings  from "../components/Settings"
import {
  Page,
  Layout,
} from "@shopify/polaris";
export default function PageName() {
 
  return (
    
     <>
     <Page style={{marginLeft: "250px"}}>
     <Layout>
      
         <Layout.Section>
         <Settings />
         </Layout.Section>
       
       </Layout>
       </Page>
     </>
  )
}