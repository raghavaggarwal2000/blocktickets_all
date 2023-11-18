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
import { CreatorServices } from "../../services/api-client";
import CreatorDetails from "./CreatorDetails";
const tableColumns = [
  {
    title: "sr. no.",
    key: "serialNumber",
  },
  {
    title: "Company Name",
    key: "companyName",
  },
  {
    title: "City",
    key: "city",
  },
  {
    title: "State",
    key: "state",
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Phone",
    key: "phone",
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
const EventCreatorRequests = () => {
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
  const getAllCreator = async (page) => {
    try {
      setIsLoading(true);
      const response = await CreatorServices.getEventCreators(page);
      setAllCreatorRequests(response.data?.data);
      setPagination({
        ...pagination,
        total: response.data?.metadata.total,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response ? error.response.data.err : error.message);
    }
  };
  const verifyUser = async (id) => {
    try {
      setIsLoading(true);
      //verify user api
      const updateUser = await CreatorServices.verifyCreator(id);

      toast.success(updateUser.data?.msg);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      toast.error(error.response ? error.response.data.err : error.message);
    }
  };
  const closeModal = () => {
    setIsShowModal(false);
    setCurrentCreatorDetails({});
  };
  useEffect(() => {
    getAllCreator(page);
  }, [page]);
  useEffect(() => {
    getAllCreator(page);
  }, []);
  if (isLoading) {
    return <Loading loading={isLoading} />;
  }
  return (
    <>
      <PageTitle>Event Creator Approval</PageTitle>
      <TableComp
        pagination={pagination}
        setCurrentPage={setPage}
        columns={tableColumns}
        tableData={allCreatorRequests?.map((data, index) => {
          return {
            serialNumber: (pagination.page - 1) * pagination.limit + index + 1,
            name: data.companyName,
            city: data.city,
            state: data.state,
            email: data.email,
            phone: data.phone,
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
                  setIsShowModal(true);
                  setCurrentCreatorDetails(data);
                }}
              >
                <BsEye fontWeight={"bolder"} size={16} color="#49A844" />
              </Button>
            ),
          };
        })}
      />

      <CreatorDetails
        isShowModal={isShowModal}
        closeModal={closeModal}
        creatorDetails={currentCreatorDetails}
        verifyUser={verifyUser}
      />
    </>
  );
};

export default EventCreatorRequests;
