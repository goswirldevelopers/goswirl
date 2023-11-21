import VideoItems from "../components/VideoItems";
import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
  Frame,
  FooterHelp
} from "@shopify/polaris";
export default function PageName() {
 
  return (
    <>
      <Page style={{marginLeft: "250px"}}>
        <Layout>
          <Layout.Section>
          <VideoItems />
          </Layout.Section>
        </Layout>
      
      </Page>
    </>
  )
}