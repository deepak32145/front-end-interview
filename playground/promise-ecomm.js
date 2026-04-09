function getUserId() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('user_42');
    }, 40);
  });
}

function getOrderId(userId) {
  if (!userId) return Promise.reject(new Error('No userId provided'));
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('order_99');
    }, 40);
  });
}

function getOrderDetails(orderId) {
  if (!orderId) return Promise.reject(new Error('No orderId provided'));
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: orderId, item: 'Laptop', qty: 1 });
    }, 40);
  });
}

function getShippingStatus(order) {
  if (!order) return Promise.reject(new Error('No order provided'));
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Order ${order.id} is OUT_FOR_DELIVERY`);
    }, 40);
  });
}


async function orderStatus() {
    try{
        const userId = await getUserId();
        const orderId = await getOrderId(userId);
        const orderDetails = await getOrderDetails(orderId);
        const shippingStatus = await getShippingStatus(orderDetails);
        console.log('shipping status' , shippingStatus);
    }
    catch(err) {    
        console.log('err' , err);

    }
}
orderStatus();