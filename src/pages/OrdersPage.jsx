import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { collection, addDoc, getDocs } from "firebase/firestore";
import firedb from '../FireConfig';
function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false)
    const userid = JSON.parse(localStorage.getItem('currentUser')).user.uid
    useEffect(() => {
        getdata()
    }, []);
    async function getdata() {

        try {
            setLoading(true)
            const result = await getDocs(collection(firedb, "orders"));
            const ordersArray = [];
            result.forEach((doc) => {
                ordersArray.push(doc.data())
                setLoading(false)
            });
            setOrders(ordersArray);
        } catch (error) {
            console.log(error)
            setLoading(false);
        }
    }
    return (
        <Layout loading={loading}>

            {orders.filter(obj => obj.userid == userid).map(order => {
                return (
                    <table className='table mt-3 order'>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.cartItems.map(item => {
                                return <tr>
                                    <td><img src={item.imageURL} height='100' width='100' /></td>
                                    <td>{item.name}</td>
                                    <td>{item.price}đ</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                )
            })}
        </Layout>
    )
}
export default OrdersPage