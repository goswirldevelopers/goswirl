import ListItem from "../components/playlist/ListItem"
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
        <ListItem />
        </Layout.Section>
      
      </Layout>
      </Page>
    </>
  )
}