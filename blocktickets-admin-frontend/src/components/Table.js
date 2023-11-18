import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  Pagination,
  TableContainer,
  Label,
  Select,
  Input,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import { UserServices, PromoCodeServices } from "../services/api-client";
import PaginatedItems from "../components/Paginate/Paginate";
import toast from "react-hot-toast";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import DatePicker from "react-date-picker";
import { TicketServices } from "../services/api-client";
const Prices = ({basePrice})=>{
  let gstBasePrice = 0;
  if(basePrice >= 500){
    gstBasePrice = basePrice * 0.18;
  }

}
const TableComp = ({ columns, tableData, pagination, setCurrentPage }) => {
  return (
    <>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              {columns.map((col, index) => {
                return (
                  <TableCell className="" key={index}>
                    {" "}
                    <div>{col.title}</div>{" "}
                  </TableCell>
                );
              })}
            </tr>
          </TableHeader>
          <TableBody>
            {tableData?.map((dataObj, index) => {
              return (
                <TableRow key={index}>
                  {Object.keys(dataObj).map((dataItem, index) => {
                    return (
                      <TableCell key={index}>
                        <div className="flex items-center text-sm">
                          {dataObj[dataItem]}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TableFooter>
          {pagination && (
            <PaginatedItems
              pageCount={Math.ceil(pagination.total / pagination.limit)}
              itemsPerPage={pagination.limit}
              totalItems={pagination.total}
              setCurrentPage={setCurrentPage}
              page={pagination.page}
            />
          )}
        </TableFooter>
      </TableContainer>
    </>
  );
};

export const FreeTicketTableComp = ({
  columns,
  tickets,
  handleChange,
  values,
  submitForm,
  freeTickets,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    limit: 10,
    total: 1,
    page: 1,
  });
  const [ticketID, setTicketID] = useState({});
  const [promoCodeInfo, setPromoCodeInfo] = useState("");
  const [check, setCheck] = useState(false);
  const [totalFreeTickets, setTotalFreeTickets] = useState(0);
  const setCurrentPage = (page) => {
    setPagination((prev) => ({ ...prev, page: page }));
  };
  useEffect(() =>{
    if(typeof tickets !== "undefined"){
      tickets.map((ticket) => {
        setTicketID((prev) =>({
          ...prev,
          [ticket?._id.toString()]: Number(ticket.basePrice)
        }))
      });
    }
  },[tickets])
  const handleInputChange = (value) => {
    setLimit(value);
  };
  const handleInputClick = () => {
    if (limit > 100) {
      return toast.error("Enter value less than 100");
    } else if (limit < 1) {
      return toast.error("Enter appropriate value");
    }
    setPagination((prev) => ({ ...prev, page: 1, limit: limit }));
  };

  const dateConversion = (date) => {
    return (moment(date).format('D MMM YYYY, h:mm:ss A'))
  }
  const verifyCode = () =>{
    const event_id = tickets[0]?.Event;
    if(typeof values.ticketType === "undefined")
    return toast.error("Please error a Ticket Type");
    if(typeof values.couponCode === "undefined")
      return toast.error("Please error coupon Code");
    TicketServices.verifyCode(values.couponCode, event_id)
    .then((data) =>{
      toast.dismiss();
      console.log(data?.data?.info)
     if(data?.data?.info?.ticketType !== values.ticketType){
      throw new Error(`This Promo Code is valid for ${data?.data?.info?.ticketName} only`)
     }
      toast.success(data?.data?.msg);
      setCheck(true); 
      setPromoCodeInfo(data?.data?.info);
    })
    .catch(err => {
      setCheck(false);
      console.log(err);
      toast.error(err?.response?.data || err.message);
    })
  }

  const checkVerifyCode = () =>{
    if((typeof values.couponCode === "undefined" && check === false) || check === true){
      submitForm();
    }else{
      toast.error("Please Verify Code");
    }
  };
  const PriceDistribution = () =>{
    const basePrice = ticketID[values.ticketType];
    let price_after_discount = basePrice;
    if(check){
      price_after_discount = price_after_discount * (100 - promoCodeInfo?.percentage)/100;
    }
    let gst_base_price = 0;
    if(price_after_discount >= 500){
      gst_base_price = price_after_discount * 0.18;
    }
    const bt_fee = (price_after_discount + gst_base_price) * 0.05;
    const gst_bt_fee = bt_fee * 0.18;
    const price = price_after_discount + gst_base_price + bt_fee + gst_bt_fee;
    return (
      <div className='col-span-full flex items-start flex-col'>
        <div className='w-fit'>
        {/* <p className="font-black mb-2">Full Cost Breakup</p> */}
          <p className='mb-0 grid grid-cols-2 gap-x-2'>
            <span className='text-borderMain'> Base Price: {" "}</span>
            <span className='font-black text-center'> {basePrice} </span>

            {check && 
            <>
              <span className='text-borderMain'>Discount %: {" "}</span>
              <span className='font-black text-center'> {promoCodeInfo?.percentage + "%"}</span>

              <span className='text-borderMain'>Price after Disount: {" "}</span>
              <span className='font-black text-center'>{ Number(price_after_discount).toFixed(2) }</span>

            </>}
            <span className='text-borderMain'>Gst On base Price(18%): {" "}</span>
            <span className='font-black text-center'>{Number(gst_base_price).toFixed(2)}</span>

            <span className='text-borderMain'>BT fee(5%): {" "}</span>
            <span className='font-black text-center'>{Number(bt_fee).toFixed(2)}</span>

            <span className='text-borderMain'>Gst On bt fee(18%): {" "}</span>
            <span className='font-black text-center'>{Number(gst_bt_fee).toFixed(2)}</span>

            <span className='text-borderMain'>Amount to be Paid: {" "}</span>
            <span className='font-black text-center'>{Number(price).toFixed(2)}</span>

          </p>
        </div>
      </div>
    );
  }
  const genTicketForm = () => {
    return (
      <>
        <div className="py-4">
          <Label className="w-[80vh] px-2 my-3">
            <span>Ticket type</span>
            <Select
              className="mt-1 w-12 z-10"
              name="ticketType"
              id="ticketType"
              onChange={(e) => {
                setCheck(false)
                handleChange(e)
              }}
              value={values.ticketType}
            >
              <option value="">Select a ticket type</option>
              {tickets?.map((ticket) => {
                return (
                  <option value={ticket?._id}>{ticket?.ticketName}</option>
                );
              })}
            </Select>
          </Label>
          <Label className="w-[50vh] px-2 my-3">
            <span>Enter Promo Code</span>
            <Input
              className="mt-1 w-full"
              placeholder="Coupon code"
              name="couponCode"
              required
              onChange={handleChange}
              value={values.couponCode}
            />
            <Button className = "mt-1 w-full" onClick = {() => verifyCode()}>Verify Code</Button>
          </Label>
          <Label className="w-[50vh] px-2 my-3">
            <span>Count</span>
            <Select
              className="mt-1 w-full"
              name="numFreeTicket"
              id="numFreeTicket"
              onChange={handleChange}
              value={values.numFreeTicket}
            >
              <option value="">Enter the no of tickets</option>
              {[...new Array(10)]?.map((x, index) => {
                return <option value={index + 1}>{index + 1}</option>;
              })}
            </Select>
          </Label>
          <Label className="w-[50vh] px-2 my-3">
            <span>Email</span>
            <Input
              className="mt-1 w-full"
              placeholder="Send to email"
              name="sendToEmail"
              required
              onChange={handleChange}
              value={values.sendToEmail}
            />
          </Label>
          <Label className="w-[50vh] px-2 my-3">
            <span>First Name</span>
            <Input
              className="mt-1"
              placeholder="First Name"
              name="firstName"
              required
              onChange={handleChange}
              value={values.firstName}
            />
          </Label>
          <Label className="w-[50vh] px-2 my-3">
            <span>Last Name</span>
            <Input
              className="mt-1"
              placeholder="Last Name"
              name="lastName"
              required
              onChange={handleChange}
              value={values.lastName}
            />
          </Label>
          <Label className="w-[50vh] px-2 my-3">
            <span>Reason</span>
            <Input
              className="mt-1"
              placeholder="Enter a reason"
              name="reason"
              onChange={handleChange}
              required
              value={values.reason}
            />
          </Label>
          <Label className="w-[50vh] px-2 my-3">
            <span>Approved By</span>
            <p className="border rounded-md border-slate-800 mt-1 p-2">
              {JSON.parse(sessionStorage.getItem("userDetails"))?.email}
            </p>
          </Label>
          {values.ticketType && <PriceDistribution />}
          
          {/* <Label className="w-[50vh] px-2">
          <span>Approved By</span>
          <p className="border rounded-md border-slate-800 mt-1 p-2">
            {Number(values.numFreeTicket) *
              Number(
                tickets
                  ?.filter((ti) => ti?._id === values.ticketType)
                  ?.map((ticket) => {
                    return ticket?.price;
                  })
              )}
          </p>
        </Label> */}
        </div>
      </>
    );
  };
  return (
    <>
      <div className="flex justify-between">
        <Button
          className="mb-4 h-10 w-24 px-4"
          layout="outline"
          size="small"
          onClick={() => setIsModalOpen(true)}
        >
          Generate
        </Button>
        <div className="flex">
          <input
            className="h-10 w-20 mr-4 rounded-md p-3"
            value={limit}
            type="number"
            onChange={(e) => {
              handleInputChange(e.target.value);
            }}
          />
          <Button className="h-10" onClick={handleInputClick}>
            Go
          </Button>
        </div>
      </div>

      {/* Modal for the generate ticket form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader className="mt-2">Generate On Spot Ticket</ModalHeader>

        <ModalBody style={{ height: "25rem" }} className="overflow-y-auto ">
          {genTicketForm()}
        </ModalBody>
        <ModalFooter>
          <Button
            className="mx-2 mt-6 h-10"
            layout="outline"
            size="small"
            onClick={checkVerifyCode}
          >
            Generate
          </Button>
        </ModalFooter>
      </Modal>

      {/* Table for on the spot tickets */}
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              {columns.map((col, index) => {
                return (
                  <TableCell className="" key={index}>
                    {" "}
                    <div>{col.title}</div>{" "}
                  </TableCell>
                );
              })}
            </tr>
          </TableHeader>
          <TableBody>
            {freeTickets &&
              freeTickets?.map((item, index) => {
                // setPagination((prev) => ({...prev, total: freeTickets.length}))
                setTimeout(() => {
                  setTotalFreeTickets(freeTickets.length);
                }, 100);
                if (
                  index < pagination.limit * pagination.page &&
                  index >= pagination.limit * (pagination.page - 1)
                )
                  return (
                    <TableRow>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item?.ticketType?.ticketName}</TableCell>
                      {/* <TableCell>{item?.couponCode}</TableCell> */}

                      <TableCell>
                        <p>{Number(item?.price).toFixed(2)}</p>
                      </TableCell>

                      <TableCell>{item?.count}</TableCell>
                      <TableCell>{item?.user?.email}</TableCell>
                      {/* <TableCell>
                      <p>{item?.user?.firstName}</p>
                    </TableCell>
                    <TableCell>
                      <p>{item?.user?.lastName}</p>
                    </TableCell> */}
                      {/* <TableCell style={{ maxWidth: "196px" }}>
                      <p className="w-[30px] overflow-hidden">
                        {item?.generated?._reason}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p>{item?.generated?._approved_by_email}</p>
                    </TableCell> */}

                      {/* <TableCell>
                      <p>{item?.price * item?.count}</p>
                    </TableCell> */}
                      {/* <TableCell>
                      <Badge>Generated</Badge>
                    </TableCell> */}
                      <TableCell>
                        {/* {item?.createdAt} */}
                        {dateConversion(item?.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
              })}
          </TableBody>
        </Table>
        <TableFooter>
          {pagination && (
            <PaginatedItems
              pageCount={Math.ceil(totalFreeTickets / pagination.limit)}
              itemsPerPage={pagination.limit}
              totalItems={pagination.total}
              setCurrentPage={setCurrentPage}
              page={pagination.page}
            />
          )}
        </TableFooter>
      </TableContainer>
    </>
  );
};

export const TableCompAddToIgnore = ({
  columns,
  setLoading,
  loading,
  getIngoredUsers,
}) => {
  const [ignoreEmail, setIgnoreEmail] = useState("");
  const handleChange = (e) => {
    setIgnoreEmail(e.target.value);
  };
  const submitForm = async () => {
    try {
      if (!ignoreEmail) return toast.error("Please enter the email ");
      setLoading(true);
      const addEmail = await UserServices.addToIgnoreList({ ignoreEmail });
      setLoading(false);
      toast.success("Updated Successfully");
      await getIngoredUsers();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Something went wrong");
      setLoading(false);
    }
  };
  return (
    <>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, index) => {
                return (
                  <TableCell className="" key={index}>
                    <div>{col.title}</div>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="flex items-center text-sm">1</div>
              </TableCell>
              <TableCell>
                <Input
                  className="mt-1"
                  placeholder="Enter a email to ignore"
                  name="ignoreEmail"
                  onChange={handleChange}
                  required
                  value={ignoreEmail}
                />
              </TableCell>
              <TableCell>
                <Button
                  className="mx-2"
                  layout="outline"
                  size="small"
                  disabled={loading}
                  onClick={submitForm}
                >
                  {loading ? (
                    <span className="font-bold">Please wait...generating</span>
                  ) : (
                    "Generate"
                  )}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export const CreatePromoTable = ({ 
  columns, 
  getAllDiscounts, 
  pagination, 
  events, 
  ticketType,
  eventLoading,
  eventValue,
  setEventValue,
  ticketValue,
  setTicketvalue
  }) => {
  // const [quantity, setQuantity] = useState(1);
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [perCodeQty, setPerCodeQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dateValue, onChange] = useState([new Date(), new Date()]);
  const [code, setCode] = useState("");

  const submitForm = async () => {
    if(eventValue === ""){
      toast.dismiss();
      return toast.error("Please enter Event Name")
    }
    if(ticketValue === ""){
      toast.dismiss();
      return toast.error("Please enter a ticket type");
    }
    // if (quantity < 1 || quantity > 51) {
    //   toast.dismiss();
    //   return toast.error("Enter a quantity between 1 to 50");
    // }
    // console.log(perCodeQty  || perCo);
    if(perCodeQty === ""){
      toast.dismiss();
      return toast.error("Please enter each code valid for");
    }
    if(perCodeQty< 1){
      return toast.error("Please enter valid code valid for");
    }
    if (discountPercentage < 1 || discountPercentage > 100) {
      toast.dismiss();
      return toast.error("Enter a percentage between 1 to 100");
    }
    try {
      setLoading(true);
      console.log(ticketValue);
      const generate = await PromoCodeServices.generate({
        code,
        eventValue,
        ticketValue,
        discountPercentage,
        validity: dateValue,
        perCodeQty,
      });
      console.log("generate: ", generate);
      toast.success("Discount codes created successfully");
      await getAllDiscounts(pagination);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(err?.response?.data?.error);
    }
  };
  const handleChange = (e) => {
    const { value, name } = e.target;
    if (name === "percentage") {
      if (value == "") {
        setDiscountPercentage(0);
      }
      setDiscountPercentage(value);
    }
  };

  useEffect(() => {
    console.log("dateValue ", dateValue);
  }, [dateValue]);
  return (
    <>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, index) => {
                return (
                  <TableCell className="" key={index}>
                    <div>{col.title}</div>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="flex items-center text-sm">1</div>
              </TableCell>
              <TableCell>
              <Input
                  className="mt-1"
                  placeholder="Coupon Code"
                  name="code"
                  type="text"
                  onChange={(e) => setCode(e.target.value)}
                  required
                  value={code}
                />
              </TableCell>
              <TableCell style={{ minWidth: "170px", width: "100px" }}>

              { eventLoading &&
                <Select
                  className="mt-1 w-12"
                  name="events"
                  id="events"
                  onChange={(e) => {
                    setEventValue(e.target.value)
                    if(e.target.value === "") setTicketvalue("");
                  }}
                  value={eventValue}
                >
                  <option value="">Select a Event</option>
                  {events?.map((event) => {
                    return (
                      <option value={event?._id}>{event?.eventTitle}</option>
                    ); 
                  })}
                </Select>
                } 
              </TableCell>
              <TableCell>
                <Select
                  className="mt-1 w-12"
                  name="ticketType"
                  id="ticketType"
                  onChange={(e) => setTicketvalue(e.target.value)}
                  value={ticketValue}
                >
                  
                <option value="">Select a ticket type</option>
                  {ticketType[eventValue]?.map((ticket) => {
                    return (
                      <option value={ticket?._id}>{ticket?.ticketName}</option>
                    ); 
                  })}
                </Select>
              </TableCell>
              {/* <TableCell>
                <Input
                  className="mt-1"
                  placeholder="Enter number of promo codes to create"
                  name="quantity"
                  type="number"
                  onChange={handleChange}
                  min={1}
                  max={50}
                  required
                  value={quantity}
                />
              </TableCell> */}
              <TableCell>
                <Input
                  className="mt-1"
                  placeholder=""
                  name="perCodeQty"
                  type="number"
                  onChange={(e) => setPerCodeQty(e.target.value)}
                  min={1}
                  max={50}
                  required
                  value={perCodeQty}
                />
              </TableCell>
              <TableCell>
                <Input
                  className="mt-1"
                  placeholder="Enter discount"
                  name="percentage"
                  type="number"
                  onChange={handleChange}
                  min={1}
                  max={100}
                  required
                  value={discountPercentage}
                />
              </TableCell>
              <TableCell>
                <DateRangePicker
                  className="w-full"
                  onChange={onChange}
                  value={dateValue}
                  minDate={new Date()}
                  calendarClassName="create_date_react"
                />
              </TableCell>
              <TableCell>
                <Button
                  className="mx-2"
                  layout="outline"
                  size="small"
                  disabled={loading}
                  onClick={submitForm}
                >
                  {loading ? "Please wait" : "Generate promo code"}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export const PromoCodeData = ({
  columns,
  discount,
  codes,
  count,
  values,
  submitForm,
  disableButton,
  handleChange,
}) => {
  return (
    <>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              {columns.map((col, index) => {
                return (
                  <TableCell className="" key={index}>
                    {" "}
                    <div>{col.title}</div>{" "}
                  </TableCell>
                );
              })}
            </tr>
          </TableHeader>
          <TableBody>
            {codes &&
              codes?.map((item) => {
                // setValidFrom((moment(new Date(item.valid_from.substr(0, 16))).format('MM/DD/YYYY')).toDateString())
                // setValidTill(moment(new Date(item.valid_till.substr(0, 16))).format("LL"))
                return (
                  <TableRow>
                    <TableCell>{count++}</TableCell>
                    <TableCell style={{ minWidth: "170px", width: "100px" }}>
                      <Input
                        className="mt-1"
                        placeholder={item.code}
                        name="code"
                        required
                        onChange={handleChange}
                        value={values.code}
                      />
                    </TableCell>
                    <TableCell style={{ minWidth: "50px", width: "100px" }}>
                      <Input
                        className="mt-1 w-full"
                        placeholder={item.quantity}
                        name="quantity"
                        required
                        type="Number"
                        min={item.usedBy.length}
                        value={values.quantity}
                        onChange={handleChange}
                      />
                    </TableCell>
                    <TableCell>
                      <p>{item?.usedBy?.length}</p>
                    </TableCell>
                    <TableCell style={{ minWidth: "50px", width: "100px" }}>
                      <Input
                        className="mt-1 w-full"
                        placeholder={discount.discountPercentage}
                        name="discount"
                        type="Number"
                        required
                        onChange={handleChange}
                        value={values.discount}
                      />
                    </TableCell>
                    <TableCell>
                      <p>
                        {moment(new Date(item.valid_from.substr(0, 16))).format(
                          "LL"
                        ) +
                          " to " +
                          moment(
                            new Date(item.valid_till.substr(0, 16))
                          ).format("LL")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p>
                        {item?.usedBy.length
                          ? item?.usedBy?.map((result) => result.email + ", ")
                          : "none"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Input 
                        type = "datetime-local"
                        className="mt-1"
                        min = {moment(new Date()).format('YYYY-MM-DD hh:mm')}
                        name = "valid_from"
                        value = {values.valid_from}
                        onChange = {handleChange}
                      />
                    </TableCell>
                    <TableCell style={{ minWidth: "170px", width: "100px" }}>
                      <Input 
                        type = "datetime-local"
                        className="mt-1"
                        min = {moment(new Date()).format('YYYY-MM-DD hh:mm')}
                        name = "valid_till"
                        value = {values.valid_till}
                        onChange = {handleChange}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        className="mx-2"
                        layout="outline"
                        size="small"
                        onClick={() =>
                          submitForm(item, discount.discountPercentage)
                        }
                      >
                        Submit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        className="mx-2"
                        layout="outline"
                        size="small"
                        onClick={() => disableButton(item?._id)}
                      >
                        Disable
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableComp;
