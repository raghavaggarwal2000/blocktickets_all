import React, { useEffect, useState } from "react";
import CsvButton from "../../components/new/CSVButton";
import Loading from "../../components/new/Loading";
import toast from "react-hot-toast";
import Select from "../../components/new/Select";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@windmill/react-ui";
import { SearchIcon } from "../../icons";
import PageTitle from "../../components/Typography/PageTitle";
import TableComp, { TableCompAddToIgnore } from "../../components/Table";
import { UserServices } from "../../services/api-client";

const tableColumns = [
  {
    title: "S No.",
    key: "serialNumber",
  },
  {
    title: "Ignore email",
    key: "email",
  },
];
const tableColumns2 = [
  {
    title: "S No.",
    key: "serialNumber",
  },
  {
    title: "Ignore email",
    key: "email",
  },
  {
    title: "Action",
    key: "addToIgnore",
  },
];
const IgnoreList = () => {
  const [email, setEmail] = useState("");
  const [users, setIgnoreUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
  });
  const setCurrentPage = (page) => {
    setPagination((prev) => ({ ...prev, page: page }));
  };

  const getIngoredUsers = async () => {
    try {
      const ignoredList = await UserServices.getIgnoredList(
        pagination.page,
        pagination.limit
      );
      setIgnoreUsers(ignoredList.data.ignoredData);
      setPagination((prev) => ({
        ...prev,
        total: ignoredList.data.meta.total,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getIngoredUsers();
  }, []);
  return (
    <>
      <div className="flex flex-row justify-between items-center mx-2">
        <PageTitle>Ignore Users</PageTitle>

        <div className="flex flex-row items-center">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-orange-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <SearchIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <Input
              className="pl-8 text-gray-700"
              placeholder="Search users by email"
              aria-label="Search"
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </div>

          <CsvButton
            style={{ width: "14rem" }}
            data={users
              ?.map((user, index) => {
                return {
                  serialNumber: index + 1,
                  email: user?.ignoredUser,
                };
              })
              .filter((user) => user?.role < 2)}
            columns={tableColumns?.map((col) => {
              return {
                id: col?.key,
                displayName: col?.title,
              };
            })}
            filename={"Users"}
          />
        </div>
      </div>
      <TableCompAddToIgnore
        columns={tableColumns2}
        loading={loading}
        setLoading={setLoading}
        getIngoredUsers={getIngoredUsers}
      />
      {users.length > 0 && (
        <TableComp
          pagination={pagination}
          columns={tableColumns}
          setCurrentPage={setCurrentPage}
          tableData={users
            .map((user, index) => {
              return {
                serialNumber:
                  (pagination?.page - 1) * pagination?.limit + index + 1,
                email: user?.ignoredUser,
                // role: user.role === 0 ? "Normal User" : "Organizer"
              };
            })
            .filter((user) => user?.email?.includes(email))}
        />
      )}
    </>
  );
};

export default IgnoreList;
