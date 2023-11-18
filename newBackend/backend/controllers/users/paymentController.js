const Event = require("../../models/Events");
const TicketType = require("../../models/TicketType");
const User = require("../../models/User");
const Order = require("../../models/Orders");
const axios = require('axios')



const createOrderInstance = async (req, res) => {
    let currentDate = new Date(); //in UTC
    let expiryDate = new Date(currentDate)
    let uniqueCustomerId = new Date().valueOf(); //for order id
    
    try{
        let {
          event,
          tickets,
          couponCode,
          amount
        } = req.body;
        var data = JSON.stringify({
            order_id : `order_${uniqueCustomerId}`,
            order_amount : req.body.amount,
            order_currency : "INR",
            order_expiry_time :  new Date(currentDate.setMinutes(currentDate.getMinutes() + 20)),
            customer_details : {
                    customer_id : `order_${uniqueCustomerId}`,
                    customer_email : "prashant@cashfree.com",
                    customer_phone : "9650183372",             
            }
        });
        // console.log(data);
        var config = {
            method : "POST",
            url : `${process.env.CASHFREE_BASE_URL}/orders`,
            headers : {
                'x-client-id': process.env.CASHFREE_APP_ID,
                'x-client-secret': process.env.CASHFREE_APP_SECRET,
                'x-api-version': process.env.CASHFREE_API_VERSION
            },
            data : JSON.parse(data),
            order_expiry_time :  new Date(currentDate.setMinutes(currentDate.getMinutes() + 20))
        
        }
        // console.log(config)
        let cashfree_create =await axios(config);
        console.log(cashfree_create?.data?.payment_session_id);

        let orderStatus = cashfree_create?.data?.order_status;
        // console.log("Detail", cashfree_create.data);
        let orderId = cashfree_create?.data?.order_id;
        // console.log("ORDER", orderId)
        const customerId = await User.findOne().select("_id"); //comment not usable
        // console.log();

        //to be inserted in DB.
        if (cashfree_create) {
            const orderObj = {
              orderToken: cashfree_create?.data?.payment_session_id || null,
            //   // orderToken: _cashfree_create?.data?.order_token || null,
              orderId: orderId,
              customerId : customerId._id,
            // //   customerId : req.tokenPayload.userId, // used after login.
              customerEmail : "prashant@cashfree.com",
              customerPhone : "9650183372",
              orderStatus:
                orderStatus === "ACTIVE"
                  ? "PENDING"
                  : orderStatus === "PAID" && "PAID",
      
              type: "ticket-buying",
            //   tickets: req.body.selectedTickets,
            //   totalTicketQuantity: totalQuantity,
              amount: cashfree_create?.data?.order_amount,
            };

          const order = Order(orderObj) //insert into DB
          const result = await order.save();
        //   console.log(result);
          }
          res.status(200).json({
            payment_session_id: cashfree_create?.data?.payment_session_id,
            // orderToken: _cashfree_create?.data?.order_token || null,
            orderId: `order_${uniqueCustomerId}`,
            message: "Order created successfully",
          });

    }catch(err){
        console.log("err: ", err);
        res.status(400).json({ msg: err.message });

    }
}






const cashfreeSuccess = async (req, res) => {
    try {
      var order_id = req.body.orderId;
    //   console.log("ORDER", order_id);
      axios({
        method:"GET",
        url: `${process.env.CASHFREE_BASE_URL}/orders/${order_id}/payments`,
        headers:{
          "Content-Type": "application/json",
          'x-client-id': process.env.CASHFREE_APP_ID,
          'x-client-secret': process.env.CASHFREE_APP_SECRET,
          'x-api-version': process.env.CASHFREE_API_VERSION
        }
      }).then(async (data) =>{
        console.log(data?.data[0].payment_method);
        
        const paymentGateway = req.body.paymentGateway;
        let modeOfPayment = data?.data[0].payment_group
        if(modeOfPayment === "card"){
          modeOfPayment = data?.data[0].payment_method.card.card_type;
        }
        // const updateOrder = await CashfreePayment.find({
        //   orderId: `${order_id}`,
        // });
        
        // const finalPrice = updateOrder[0].breakupPrices?.finalPrice;
  
        let orderStatus = "PENDING";
        if(data?.data[0]?.payment_status === "SUCCESS")
          orderStatus = "PAID";
        updateOrder[0].orderStatus = orderStatus;
        updateOrder[0].paymentGateway = paymentGateway;
        updateOrder[0].modeOfPayment = modeOfPayment;
        console.log("modeOfPayment", modeOfPayment)
        
        let gateway_conv_fee = 0;
        switch(modeOfPayment){
          case "debit_card":{
            gateway_conv_fee = finalPrice * 0.95/100;
          }
            break;
          case "credit_card":{
            gateway_conv_fee = finalPrice * 1.9/100;
          }
            break;
          case "net_banking":{
            gateway_conv_fee = finalPrice * 1.9/100;
          }
            break;
          case "prepaid_card":{
            gateway_conv_fee = finalPrice * 1.95/100;
          }
          break;
          case "upi":{
            gateway_conv_fee = finalPrice * 1.9/100;
          }
        }
        const gst_gateway_conv_fee = gateway_conv_fee * 0.18;
        const blocktickets_conv_fee = updateOrder[0].breakupPrices?.total_convenience_fee - gateway_conv_fee;
        const gst_blocktickets_conv_fee = blocktickets_conv_fee * 0.18;
  
        updateOrder[0].breakupPrices.gateway_conv_fee = +(gateway_conv_fee).toFixed(2);
        updateOrder[0].breakupPrices.gst_gateway_conv_fee = +(gst_gateway_conv_fee).toFixed(2);
        updateOrder[0].breakupPrices.blocktickets_conv_fee = +(blocktickets_conv_fee).toFixed(2);
        updateOrder[0].breakupPrices.gst_blocktickets_conv_fee = +(gst_blocktickets_conv_fee).toFixed(2);
        updateOrder[0].markModified('breakupPrices');
        await updateOrder[0].save();
  
        res.status(200).json({
          result: updateOrder,
          status:200
        })
      })
      .catch(err =>{
        res.status(400).json({error:err});
      })
    } catch (err) {
      throw new CustomError.NotFoundError(`Something went wrong`);
    }
  };



module.exports = {
    createOrderInstance,
    cashfreeSuccess
    
}


