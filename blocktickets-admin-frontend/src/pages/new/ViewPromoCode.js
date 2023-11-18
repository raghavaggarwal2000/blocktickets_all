import moment from "moment";
import React, { useEffect, useState } from "react";
import { PromoCodeServices } from "../../services/api-client";
import { PromoCodeData } from "../../components/Table";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import PageTitle from "../../components/Typography/PageTitle";
import TableComp from "../../components/Table";
import { Badge, Button } from "@windmill/react-ui";
import ClipboardCopy from "../../components/CopyToClipboard/Clipboard";
import CsvButton from "../../components/new/CSVButton";
import { getCompleteDate } from "../../utils/demo/date";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";

const tableColumns = [
  {
    title: "S No.",
    key: "serialNumber",
  },
  {
    title: "Code",
    key: "code",
  },
  // {
  //   title:"Event name",
  //   key: "event"
  // },
  // {
  //   title:"Ticket Type",
  //   key: "ticketType"
  // },
  {
    title: "Quantity",
    key: "quantity",
  },
  {
    title: "Used",
    key: "used",
  },
  {
    title: "Discount %",
    key: "percentage",
  },
  {
    title: "Validity",
    key: "validity",
  },
  {
    title: "Used by",
    key: "usedBy",
  },
  {
    title: "Disable",
    key: "disable",
  },
];

const editColumns = [
  {
    title: "S No.",
    key: "serialNumber",
  },
  {
    title: "Code",
    key: "code",
  },
  // {
  //   title:"Event name",
  //   key: "event"
  // },
  //   {
  //   title:"Ticket Type",
  //   key: "ticketType"
  // },
  {
    title: "Quantity",
    key: "quantity",
  },
  {
    title: "Used",
    key: "used",
  },
  {
    title: "Discount %",
    key: "percentage",
  },
  {
    title: "Validity",
    key: "validity",
  },
  {
    title: "Used by",
    key: "usedBy",
  },
  {
    title: "valid_from",
    key: "valid_from",
  },
  {
    title: "valid_till",
    key: "valid_till",
  },
  {
    title: "Submit",
    key: "submit",
  },
  {
    title: "Disable",
    key: "disable",
  },
];

const ViewPromoCode = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [codes, setCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateValue, onChange] = useState([new Date(), new Date()]);
  const [values, setValues] = useState({});
  const [edit, setEdit] = useState(false);

  const handleChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  const disableButton = async (id) => {
    try {
      setIsLoading(true);
      console.log(id);
      const update = await PromoCodeServices.disable(id);
      console.log("update: ", update);
      setIsLoading(false);
      toast.success(update?.data?.msg);
    } catch (err) {
      setIsLoading(false);

      console.log(err?.response?.data);
    }
  };

  const getDiscountById = async () => {
    try {
      setIsLoading(true);
      const { data } = await PromoCodeServices.getDiscountById(id);
      setData(data?.data?.discount);
      setCodes(data?.data?.codes);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error.response.data.error ? error.response.data.error : error.message
      );
    }
  };

  const submitForm = async (item, percentage) => {
    if (values.quantity < item.usedBy.length)
      return toast.error("quantity should be more than used by");
    if(typeof values.valid_from === "undefined")
      values.valid_from = codes[0].valid_from;
    if(typeof values.valid_till === "undefined")
      values.valid_till = codes[0].valid_till;
    if (values.valid_from > values.valid_till)
      return toast.error("valid_from should be less than valid_till");

    if (values.code && values.code.length < 8)
      return toast.error("Code length should me more than 8");
    // valid_till.setDate(valid_till.getDate() +1);
    try {
      setIsLoading(true);
      const update = await PromoCodeServices.updateCode({
        id: item._id,
        code: values.code ? values.code : item.code,
        quantity: values.quantity ? values.quantity : item.quantity,
        discount: values.discount ? values.discount : percentage,
        date: [values.valid_from, values.valid_till],
      });
      setIsLoading(false);

      toast.success(update?.data?.msg);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.error(err?.response?.data ? err?.response?.data : err.message);
    }
  };

  useEffect(() => {
    getDiscountById();
  }, []);

  // no use of this function
  const extend = async (id) => {
    try {
      setIsLoading(true);
      const update = await PromoCodeServices.updateDate({
        id,
        date: dateValue,
      });
      console.log("update: ", update);
      setIsLoading(false);
      toast.success(update?.data?.msg);
    } catch (err) {
      setIsLoading(false);

      console.log(err?.response?.data);
    }
  };
  return (
    <>
      <PageTitle>Promo code details</PageTitle>
      {/* User Details */}
      <div className='bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg'>
        <div className='px-4 py-5 sm:px-6'>
          <h3 className='text-lg leading-6 font-medium text-gray-900 dark:text-white'>
            Summary
          </h3>
        </div>
        <div className='border-t border-gray-200'>
          <dl>
            <div className='bg-gray-50  px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>
                Generated by
              </dt>
              <dd className='mt-1 text-sm font-bold text-gray-900 sm:mt-0 sm:col-span-2'>
                {data?.createdBy?.email}
              </dd>
            </div>
            <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>
                Discount percentage
              </dt>
              <dd className='mt-1 text-sm font-bold text-gray-900 sm:mt-0 sm:col-span-2'>
                {data?.discountPercentage} %
              </dd>
            </div>
            <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>
                Total promo codes
              </dt>
              <dd className='mt-1 text-sm font-bold text-gray-900 sm:mt-0 sm:col-span-2'>
                {data?.quantity}
              </dd>
            </div>
            <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>Created on </dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                {moment(data?.createdAt).format("LLLL")}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      {/* Ticket Details */}
      <div className='bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mt-3'>
        <div className='flex justify-between items-center'>
          <div className='px-4 py-5 sm:px-6'>
            <h3 className='text-lg leading-6 font-medium text-gray-900 dark:text-white'>
              All discount codes
            </h3>
            <p className='mt-1 max-w-2xl text-sm text-gray-500'>
              Codes with their usage
            </p>
            <br />
            {edit ? (
              <Button
                // className="mx-2"
                layout='outline'
                size='small'
                disabled={isLoading}
                onClick={() => setEdit(!edit)}
              >
                Close Editing
              </Button>
            ) : (
              <Button
                // className="mx-2"
                layout='outline'
                size='small'
                disabled={isLoading}
                onClick={() => setEdit(!edit)}
              >
                Edit
              </Button>
            )}
          </div>
          <CsvButton
            style={{ width: "14rem" }}
            data={codes}
            columns={tableColumns?.map((col) => {
              return {
                id: col?.key,
                displayName: col?.title,
              };
            })}
            filename={`Promo Codes ${new Date().toDateString()}`}
          />
        </div>
        {edit
          ? codes?.length > 0 && (
              <PromoCodeData
                columns={editColumns}
                discount={data}
                codes={codes}
                count={1}
                values={values}
                submitForm={submitForm}
                disableButton={disableButton}
                handleChange={handleChange}
              />
            )
          : codes?.length > 0 && (
              <TableComp
                // pagination={pagination}
                columns={tableColumns}
                // setCurrentPage={setCurrentPage}
                tableData={
                  codes?.map((discount, index) => {
                    return {
                      serialNumber: index + 1,
                      code: (
                        <div className='cursor-poitner flex items-center justify-center gap-x-4'>
                          <Badge type='danger'>{discount?.code}</Badge>
                          <ClipboardCopy copyText={discount?.code} />
                        </div>
                      ),
                      quantity: discount?.quantity ? discount?.quantity : 1,
                      used: discount?.usedBy?.length,
                      percentage: data?.discountPercentage + "%",
                      validity: discount?.valid_from
                        ? getCompleteDate(discount?.valid_from) +
                          " To " +
                          getCompleteDate(discount?.valid_till)
                        : "",

                      usedBy: discount?.usedBy.length
                        ? discount?.usedBy?.map((item) => item?.email + ", ")
                        : "none",
                      //   valid_from:(
                      //     <DateRangePicker
                      //     className="w-full"
                      //     onChange={onChange}
                      //     value={dateValue}
                      //     minDate={new Date()}
                      //   />
                      //   ),
                      // valid_till: (
                      //   <DateRangePicker
                      //     className="w-full"
                      //     onChange={onChange}
                      //     value={dateValue}
                      //     minDate={new Date()}
                      //   />
                      // ),
                      // changeValidity: (
                      //   <DateRangePicker
                      //     className="w-full"
                      //     onChange={onChange}
                      //     value={dateValue}
                      //     minDate={new Date()}
                      //   />
                      // ),
                      // extend: (
                      //   <Button
                      //     className="mx-2"
                      //     layout="outline"
                      //     size="small"
                      //     disabled={isLoading}
                      //     onClick={() => extend()}
                      //   >
                      //     Edit
                      //   </Button>
                      // ),
                      disable: (
                        <Button
                          className='mx-2'
                          layout='outline'
                          size='small'
                          disabled={isLoading}
                          onClick={() => disableButton(discount?._id)}
                        >
                          {isLoading ? "Please wait" : "Disable"}
                        </Button>
                      ),
                    };
                  })
                  // .filter((user) => user?.email?.includes(email))
                }
              />
            )}
      </div>
    </>
  );
};

export default ViewPromoCode;
