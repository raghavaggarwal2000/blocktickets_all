import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import PageTitle from "../../components/Typography/PageTitle";
import { TicketServices } from "../../services/api-client";
import Loading from "../../components/new/Loading";
import toast from "react-hot-toast";
import TableComp from "../../components/Table";
import { useHistory } from "react-router-dom";

const tableColumns = [
  // {
  //   title: "Sr. No.",
  //   key: "serialNumber",
  // },
  {
    title: "Ticket Name",
    key: "ticketName",
  },
  {
    title: "Base price",
    key: "ticketPrice",
  },
  {
    title: "Discount %",
    key: "discount",
  },
  {
    title: "Discounted Price",
    key: "priceDiscount",
  },
  {
    title: "Gst base",
    key: "gstbase",
  },
  {
    title: "BT fee",
    key: "btFee",
  },
  {
    title: "Gst BT fee",
    key: "gstBtFee",
  },
  {
    title: "Conv. fee",
    key: "convFee",
  },
  {
    title: "Gst conv. fee",
    key: "gstConvFee",
  },

  {
    title: "Final price",
    key: "price",
  },
];
const table2Columns = [
  {
    title: "Ticket Category",
    key: "category",
  },
  {
    title: "Ticket Qty",
    key :"qty"
  },
  {
    title:"Final Price",
    key:"final"
  },
  // {
  //   title: "Display Price",
  //   key: "dpPrice",
  // },
  // {
  //   title: "Discounted Price",
  //   key: "discountedPrice",
  // },
  {
    title: "Advance Paid",
    key: "advanceWithTax",
  },
  {
    title: "Balance Payable",
    key: "dueWithTaxes",
  },
  {
    title: "Status",
    key: "status",
  },
];
const TicketDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState("");
  const [event, setEvent] = useState("");
  const [ticketName, setTicketName] = useState({});
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState({});
  const [approve, setApprove] = useState({});
  const history = useHistory();

  useEffect(() => {
    getTicketByOrderId();
  }, []);

  // api service calls
  const getTicketByOrderId = async () => {
    try {
      setIsLoading(true);
      const response = await TicketServices.getTicketByOrderId(orderId);
      setOrder(response?.data?.data?.TicketDetails);
      setEvent(response?.data?.data?.TicketDetails[0]?.ticket.Event);
      setUser(response?.data?.data?.TicketDetails[0]?.ticket.user);
      setPaymentStatus(response?.data?.data?.paymentStatus);
      setApprove(response?.data?.data?.approve);
      console.log(response?.data?.data?.approve)
      // response.data.data.length === 0
      //   ? setDiscount(0)
      //   : setDiscount(response.data.discount[0].discountId.discountPercentage);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(
        error.response.data?.error ? error.response.data?.error : error.message
      );
    }
  };
  const updatePaymentStatus = async (finalPrice, order_id) => {
    try {
      setIsLoading(true);
      const response = await TicketServices.updatePaymentStatus(
        {finalPrice: finalPrice},
        order_id
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error.response.data.error ? error.response.data.error : error.message
      );
    }
  };

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    <>
      <PageTitle>Ticket Details</PageTitle>
      {/* User Details */}
      <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
        <div className='px-4 py-5 sm:px-6'>
          <h3 className='text-lg leading-6 font-medium text-gray-900'>
            User Details
          </h3>
          {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal details and application.
            </p> */}
        </div>
        <div className='border-t border-gray-200'>
          <dl>
            <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>Name</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                {user?.username || user?.google?.name || user?.facebook?.name}
              </dd>
            </div>
            <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>Email</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                {user?.email}
              </dd>
            </div>
            <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>PhoneNumber</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                {user?.phoneNumber || "Not available"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      {/* Ticket Details */}
      <div className='shadow overflow-hidden sm:rounded-lg mt-3'>
        <div className='py-4 sm:px-6'>
          <h3 className='text-lg leading-6 font-medium text-gray-400'>
            Ticket Summary
          </h3>
        </div>

        {/* This is the table containing taxation details of the tickets */}
        {order && (
          <TableComp
            columns={tableColumns}
            tableData={order.map((ticket, index) => {
             if(ticketName[ticket?.ticket?.ticketType?.ticketName] === 1)
                return{};
            
              if(typeof ticketName[ticket?.ticket?.ticketType?.ticketName] === "undefined"){
                ticketName[ticket?.ticket?.ticketType?.ticketName] = 1;
              }
                
              const due = Number(ticket?.ticket?.prices?.due_with_taxes) > 0
                ? Number(ticket?.ticket?.prices?.due_with_taxes).toFixed(2)
                : 0;
              const finalPrice = Number(ticket?.ticket?.prices?.paidPrice) + Number(due);
              return {
                // serialNumber: index,
                ticketName: ticket.ticket?.ticketType?.ticketName,
                ticketPrice: Number(ticket?.ticket?.prices?.basePrice).toFixed(2),
                discount:
                typeof ticket?.discountPercentage == "undefined"
                  ? 0
                  : ticket?.discountPercentage,
                priceDiscount: ticket?.discountPercentage > 0
                ? Number(ticket?.ticket?.prices?.discountedPrice).toFixed(2)
                : "NA",
                gstbase: Number(ticket?.ticket?.prices?.gst_on_basePrice).toFixed(2),
                btFee: Number(ticket?.ticket?.prices?.bt_fee).toFixed(2),
                gstBtFee: Number(ticket?.ticket?.prices?.gst_on_bt_fee).toFixed(2),
                convFee: Number(ticket?.ticket?.prices?.conv_fee).toFixed(2),
                gstConvFee: Number(ticket?.ticket?.prices?.gst_conv_fee).toFixed(2),
                price: Number(finalPrice).toFixed(2),              
              };
            })}
          />
        )}

        {/* This table contains the payement details */}
        <div className='pb-4 sm:px-6'>
          <h2 className='text-lg leading-6 font-medium text-gray-400'>
            Payment Status
          
          <>
        {parseFloat(approve.due) != 0 ? (
          <button
            className=' bg-red-400 hover:bg-red-700 ml-5 text-white font-bold py-2 px-4 rounded'
            onClick={() => {
              window.confirm("Are you sure you want to?") &&
                updatePaymentStatus(Number(approve.due) + Number(approve.paid), approve.order_id) &&
                history.go(0);
            }}
          >
            Approve
          </button>
        ) : (
          <button
            className='bg-green-500 hover:bg-green-700 text-white font-bold ml-5 py-2 px-4 rounded disabled:opacity-75 disabled: cursor-not-allowed'
            disabled={true}
          >
            Approved
          </button>
        )}
       
        </>
        </h2>
          {/* <button
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-75 disabled: cursor-not-allowed'
            disabled={true}
          >
            Approved
          </button> */}
        </div>
        {order && (
          <TableComp
            columns={table2Columns}
            // tableData={paymentStatus.map((ticket,index) =>{
              tableData = {Object.keys(paymentStatus).map((ticket, index) =>{
              return{
                // approval: index === 0 
                // ?approvalButton(
                //   paymentStatus[ticket]?.amount_due,
                //   paymentStatus[ticket]?.orderId,
                //   paymentStatus[ticket]?.advance
                //   )
                // :"" ,
                category: ticket,
                qty: paymentStatus[ticket]?.qty,
                final:Number(Number(paymentStatus[ticket]?.amount_due) + Number(paymentStatus[ticket]?.advance)).toFixed(2),
                advanceWithTax: Number(paymentStatus[ticket]?.advance).toFixed(2),
                dueWithTaxes: Number(paymentStatus[ticket]?.amount_due).toFixed(2),
                status: Number(paymentStatus[ticket]?.amount_due) === 0?
                "Paid"
                :"Pending"
              }
            })}
            // tableData={order?.map((ticket, index) => {
              
            //   console.log(ticket);
            //   return {
            //     approval: approvalButton(
            //       ticket?.paymentDetails?.remainingPrice,
            //       ticket?.ticket?._id,
            //       ticket?.paymentDetails?.paidPrice
            //     ),
            //     category: ticket?.ticket?.ticketType?.ticketName,
            //     // dpPrice: Number(ticket?.ticket?.prices?.displayPrice).toFixed(2),
            //     // discountedPrice: ticket?.discountPercentage > 0
            //     // ? Number(ticket?.ticket?.prices?.discountedPrice).toFixed(2)
            //     // : "NA",

            //     advanceWithTax: Number(ticket?.ticket?.prices?.paidPrice).toFixed(2),
            //     dueWithTaxes: Number(ticket?.ticket?.prices?.due_with_taxes) > 0
            //     ? Number(ticket?.ticket?.prices?.due_with_taxes).toFixed(2)
            //     : 0,
            //     status:
            //       parseFloat(ticket?.paymentDetails?.remainingPrice) == 0
            //         ? "Paid"
            //         : "Pending",
            //   };
            // })}
          />
        )}
      </div>
      {/* Event Details */}
      <div className='bg-white shadow overflow-hidden sm:rounded-lg mt-3'>
        <div className='px-4 py-5 sm:px-6'>
          <h3 className='text-lg leading-6 font-medium text-gray-900'>
            Event Info
          </h3>
          {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal details and application.
            </p> */}
        </div>

        <div className='border-t border-gray-200'>
          <dl>
            <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>Event Title</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                {event?.eventTitle}
              </dd>
            </div>
            <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>
                Event Description
              </dt>
              <p
                dangerouslySetInnerHTML={{ __html: event?.eventDescription }}
                className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'
              ></p>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
};

export default TicketDetails;
