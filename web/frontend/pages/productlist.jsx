import { ProductList } from "../components"
import {
  Page,
  Layout,
} from "@shopify/polaris";
export default function PageName() {
 
  return (
    
     <>
     <Page>
     <Layout>
      
         <Layout.Section>
         <ProductList />
         </Layout.Section>
       
       </Layout>
       </Page>
     </>
  )
}