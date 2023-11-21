import CreateList from "../components/playlist/CreateList"
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
        <CreateList />
        </Layout.Section>
      
      </Layout>
      </Page>
    </>
  )
}