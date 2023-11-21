import Integration from "../components/Integration";
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
        <Integration />
        </Layout.Section>
      
      </Layout>
      </Page>
    </>
  )
}