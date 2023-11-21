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


import Dashboard from '../components/Dashboard';

export default function HomePage() {
  return (
    <>
      <Page style={{marginLeft: "250px"}}>
    <Layout>
     
        <Layout.Section>
        <Dashboard />
        </Layout.Section>
      
      </Layout>
      </Page>
      {/* <FooterHelp>
        Learn more about
        <Link url="https://www.goswirl.live" external>
          {" "}
          Swril
        </Link>
      </FooterHelp> */}
   </>
  );
}

