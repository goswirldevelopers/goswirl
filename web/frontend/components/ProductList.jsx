import {DropZone, LegacyStack, Thumbnail, Text, Card, Grid} from '@shopify/polaris';
import {
  Button,
	FormLayout,
	TextField,
} from "@shopify/polaris";
import react, {useState, useCallback} from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import Table from 'react-bootstrap/Table';
import ListType from "../components/playlist/ListType.jsx"
import "../assets/css/productList.css"
import { na } from "../assets"

export function ProductList() {

  const [loading, IsLoading] = useState(true)
  const [product, setProduct] = useState([])
  const [filterProduct, setFilterProduct] = useState([])
  const [typeList, setTypeList] = useState(false)
  const [titleName, setTitleName] = useState('')
  const [searchItem, setSearchItem] = useState('')
  const [proHandler, setProHandler] = useState('')

  const fetch = useAuthenticatedFetch();

  const {
    data,
    refetch: refetchProduct,
  } = useAppQuery({
    url: "/api/products",
    reactQueryOptions: {
      onSuccess: (response) => {
        console.log(response.data.data)
        setProduct(response.data.data)
        setFilterProduct(response.data.data)
      },
    },
  });

  const handleType = async(item) => {
    setTitleName(item.title)
    setProHandler(item.handle)
    setTypeList(true)
  }

  const handleSearch = useCallback(value => setSearchItem(value), [])
  
  const findResult = async() => {
    if(searchItem.length == 0){
      await refetchProduct()
    }
    const filterProductData = product.filter(item => item.title.toLowerCase().includes(searchItem))
    setFilterProduct(filterProductData)

  }

  return (
    <>
      

        {typeList ? (
          <ListType title={titleName} product_handle={proHandler} source={'productPage'}/>
        ):(
          <>
          <div className='product-page-heading'>
              <div className='search-bar' style={{position: "relative", display: "flex"}}>
                <span className='heading-name'>Products</span>
                <div style={{height: "55px", marginRight: "0", marginLeft: "auto", width: "500px !important;", display: "flex"}}>
                  <FormLayout>
                    <TextField
                    placeholder='search product'
                    value={searchItem}
                    onChange={handleSearch}
                    />
                  </FormLayout>
                  <Button variant="light" onClick={findResult}>Search</Button>
                </div>
                </div>
                <div className='divider-line'></div>
          </div>
          {(data) ? (
            <>
              {(filterProduct.length>0)? (
                <Table responsive style={{marginTop: "28px"}}>
                    <thead className='product-heading'>
                        <tr>
                        <th>Title</th>
                        <th></th>
                        {/* <th>Video widget</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {filterProduct.map((index, key) => (
                            <tr>
                            <td>
                                {index.image?(
                                    <td><img src={index.image.src} className='product-image'></img></td>
                                ):(
                                  <td><img src={na} className='product-image'></img></td>
                                )}
                            </td>
                            <td style={{verticalAlign: "middle"}} key={index.id}>{index.title}</td>
                            {/* <td><div className='choose-product'><Button className='choose-product' onClick={()=>{handleType(index)}}>Add playlist</Button></div></td> */}
                            </tr>
                        ))}
                        
                    </tbody>
                </Table>
                ): ('No product found')}
                </>
            ) : (
              
                'Loading'
              
            )}</>
        )}
    
    </>
  );
}