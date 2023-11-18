import React, { useEffect, useState } from "react";
import PageTitle from "../../components/Typography/PageTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@windmill/react-ui";
import { BsEye } from "react-icons/bs";
import TableComp from "../../components/Table";
import Loading from "../../components/new/Loading";
import toast from "react-hot-toast";
import { EventServices } from "../../services/api-client";
import CreatorDetails from "./CreatorDetails";
import { getCompleteDate } from "../../utils/demo/date";
import { useHistory } from "react-router-dom";

const tableColumns = [
  {
    title: "sr. no.",
    key: "serialNumber",
  },
  {
    title: "Event Name",
    key: "eventTitle",
  },
  {
    title: "Event Nft Id",
    key: "eventNftId",
  },
  {
    title: "Start Date",
    key: "startDate",
  },
  {
    title: "End Date",
    key: "endDate",
  },
  {
    title: "Location",
    key: "location",
  },
  {
    title: "Verification",
    key: "isVerified",
  },
  {
    title: "Actions",
    key: "actions",
  },
];
const EventListingRequests = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });
  const [isShowModal, setIsShowModal] = useState(false);
  const [allCreatorRequests, setAllCreatorRequests] = useState("");
  const [currentCreatorDetails, setCurrentCreatorDetails] = useState("");
  const getAllEvent = async (page) => {
    try {
      setIsLoading(true);
      const response = await EventServices.getAllEvents(page);
      setAllCreatorRequests(response.data?.data.eventData);
      setPagination({
        ...pagination,
        total: response.data?.data.meta.total,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response ? error.response.data.err : error.message);
    }
  };
  const history = useHistory();

  // const verifyUser = async (id) => {
  //   try {
  //     setIsLoading(true)
  //     console.log(id)
  //     //verify user api
  //     const updateUser = await CreatorServices.verifyCreator(id);

  //     console.log(updateUser.data)
  //     toast.success(updateUser.data?.msg)
  //     setIsLoading(false)

  //   }
  //   catch(error) {
  //     console.log(error);
  //     setIsLoading(false)

  //     toast.error(
  //       error.response ? error.response.data.err : error.message
  //   );
  //   }
  // }

  const handleViewEvent = (eventId) => {
    history.push(`event/eventDetails/${eventId}?view=true`);
  };
  const closeModal = () => {
    setIsShowModal(false);
    setCurrentCreatorDetails({});
  };
  useEffect(() => {
    getAllEvent(page);
  }, [page]);
  useEffect(() => {
    getAllEvent(page);
  }, []);
  if (isLoading) {
    return <Loading loading={isLoading} />;
  }
  return (
    <>
      <PageTitle>Event Listing Approval</PageTitle>
      <TableComp
        pagination={pagination}
        setCurrentPage={setPage}
        columns={tableColumns}
        tableData={allCreatorRequests?.map((data, index) => {
          return {
            serialNumber: (pagination.page - 1) * pagination.limit + index + 1,
            eventName: data.eventTitle,
            eventNftId: data.eventNftId,
            startDate: getCompleteDate(data.startDate),
            endDate: getCompleteDate(data.endDate),
            location: data.location,
            isVerified: data.isVerified ? (
              <span className="text-green-600 font-bold">Verified</span>
            ) : (
              <span className="text-red-500 font-bold">Pending</span>
            ),
            actions: (
              <Button
                className="mx-1"
                layout="outline"
                size="small"
                onClick={() => {
                  // setIsShowModal(true);
                  // setCurrentCreatorDetails(data);
                  handleViewEvent(data._id);
                }}
              >
                <BsEye fontWeight={"bolder"} size={16} color="#49A844" />
              </Button>
            ),
          };
        })}
      />

      {/* <CreatorDetails
                isShowModal={isShowModal}
                closeModal={closeModal}
                creatorDetails={currentCreatorDetails}
                // verifyUser={verifyUser}
            /> */}
    </>
  );
};

export default EventListingRequests;
