import React from 'react'
import {Document,Page,Text,StyleSheet} from '@react-pdf/renderer'
import {Table,TableHeader,TableCell,DataTableCell,TableBody} from '@david.kucsai/react-pdf-table'

const Invoice = ({order}) => {
  return (
    <Document>
      <Page style ={styles.body}>
        <Text style={styles.header} fixed>
          ~ {new Date().toLocaleString()} ~
        </Text>
        <Text style ={styles.title}>
          Text Invoice
        </Text>
        <Text style ={styles.author}>
          D.H Fast Food
        </Text>
        <Text style ={styles.subtitle}>
          Order Summary {JSON.stringify(order.products)}
        </Text>
        <Table>
          <TableHeader>
            <TableCell>Title</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Color</TableCell>
          </TableHeader>
        </Table>
        <Table data ={order.products}>
          <TableBody>
            <DataTableCell getContent ={e => e.product.title}/>
            <DataTableCell getContent ={e => `$${e.product.price}`}/>
            <DataTableCell getContent ={e => e.count}/>
            <DataTableCell getContent ={e => e.product.brand}/>
            <DataTableCell getContent ={e => e.product.color}/>
          </TableBody>
        </Table>

        <Text style ={styles.text}>
          <Text>Date: {'     '} {new Date(order.paymentIntent.created*1000).toLocaleString()}</Text> {'\n'}
          <Text>Order Id:{'     '} {order.paymentIntent.id}</Text> {'\n'}
          <Text>Order Status: {'     '}{order.orderStatus}</Text> {'\n'}
          <Text>Total Paid: {'     '}{order.paymentIntent.amount}</Text> {'\n'}
        </Text>

        <Text style ={styles.footer}> ~ Thank you for shopping with us ~ </Text>
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  body: {
    paddingTop:35,
    paddingBottom:65,
    paddingHorizontal:35,
  },
  title:{
    fontSize:24,
    textAlign:'center',
  },
  author:{
    fontSize:12,
    textAlign:'center',
    marginBottom:40,
  },
  subtitle:{
    fontSize:18,
    margin:12,
  },
  text:{
    margin:12,
    fontSize:14,
    textAlign:'justify',
  },
  image: {
    marginVertical:15,
    marginHorizontal:100,
  },
  header:{
    fontSize:12,
    marginBottom:20,
    textAlign:'center',
    color:'grey',
  },
  footer: {
    padding:'100px',
    fontSize:12,
    marginBottom:20,
    textAlign:'center',
    color:'grey',
  },
  pageNumber:{
    position:'absolute',
    fontSize:12,
    bottom:30,
    left:0,
    right:0,
    textAlign:'center',
    color:'grey',
  }
})

export default Invoice
