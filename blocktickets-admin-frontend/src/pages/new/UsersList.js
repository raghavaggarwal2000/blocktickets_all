import React, { useState, useEffect, useCallback } from "react";
import TableComp from "../../components/Table";
import { UserServices } from "../../services/api-client";
import PageTitle from "../../components/Typography/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { setAllUsers } from "../../redux/userSlice";
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

const UsersList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
  });
  const setCurrentPage = (page) => {
    setPagination((prev) => {
      console.log(prev)({ ...prev, page: page });
    });
  };

  useEffect(() => {
    console.log("Efect pagination", pagination);
    if (!email) getAllUsers();
    else getUsersByEmail();
  }, [pagination.page]);

  const tableColumns = [
    {
      title: "Sr No.",
      key: "serialNumber",
    },
    {
      title: "Username",
      key: "username",
    },
    {
      title: "Email",
      key: "email",
    },
    {
      title: "PhoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Role",
      key: "role",
    },
  ];

  const getAllUsers = async () => {
    try {
      setIsLoading(true);
      const usersResponse = await UserServices.getUsers(
        pagination.page,
        pagination.limit
      );
      // Do not show super admin user here
      setPagination((prev) => ({
        ...prev,
        total: usersResponse.data.data.meta.total,
      }));
      setUsers(usersResponse.data.data.users);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(
        error?.response?.data?.error
          ? error?.response?.data?.error
          : error?.message
      );
    }
  };
  const getUsersByEmail = async () => {
    try {
      setIsLoading(true);
      const usersResponse = await UserServices.getUsersByEmail(
        pagination.page,
        pagination.limit
      );
      // Do not show super admin user here
      setPagination((prev) => ({
        ...prev,
        total: usersResponse.data.data.meta.total,
      }));
      setUsers(usersResponse.data.data.users);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(
        error?.response?.data?.error
          ? error?.response?.data?.error
          : error?.message
      );
    }
  };
  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    <>
      <div className='flex flex-row justify-between items-center mx-2'>
        <PageTitle>Users Table</PageTitle>

        <div className='flex flex-row items-center'>
          <div className='relative w-full max-w-xl mr-6 focus-within:text-orange-500'>
            <div className='absolute inset-y-0 flex items-center pl-2'>
              <SearchIcon className='w-4 h-4' aria-hidden='true' />
            </div>
            <Input
              className='pl-8 text-gray-700'
              placeholder='Search users by email'
              aria-label='Search'
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </div>

          <CsvButton
            style={{ width: "14rem" }}
            data={users
              ?.map((user, index) => {
                return {
                  serialNumber: index + 1,
                  userName: user.username,
                  email: user.email,
                  phoneNumber: user.phoneNumber,
                  role: user.role === 0 ? "Normal User" : "Organizer",
                };
              })
              .filter((user) => user.role < 2)}
            columns={tableColumns?.map((col) => {
              return {
                id: col.key,
                displayName: col.title,
              };
            })}
            filename={"Users"}
          />
        </div>
      </div>

      {users.length > 0 && (
        <TableComp
          pagination={pagination}
          columns={tableColumns}
          setCurrentPage={setCurrentPage}
          tableData={users
            .map((user, index) => {
              return {
                serialNumber:
                  (pagination.page - 1) * pagination.limit + index + 1,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                // role: user.role === 0 ? "Normal User" : "Organizer"
                role: (
                  <UserRoleSelect
                    getAllUsers={getAllUsers}
                    userId={user._id}
                    setIsLoading={setIsLoading}
                    email={user.email}
                    value={
                      user.role === 0
                        ? {
                            label: "Normal User",
                            value: "normalUser",
                          }
                        : {
                            label: "Organizer",
                            value: "organizer",
                          }
                    }
                    options={[
                      {
                        label: "Normal User",
                        value: "normalUser",
                      },
                      {
                        label: "Organizer",
                        value: "organizer",
                      },
                    ]}
                  />
                ),
              };
            })
            .filter((user) => user?.email?.includes(email))}
        />
      )}
    </>
  );
};

const UserRoleSelect = ({
  value,
  options,
  userId,
  setIsLoading,
  getAllUsers,
  email,
}) => {
  const [role, setRole] = useState({ label: "", value: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }
  const handleChange = (role) => {
    setRole(role);
    openModal();
  };

  const renderModalBody = () => {
    return (
      <>
        <strong>{`Are you sure you want to grant ${role.label} role to `}</strong>{" "}
        <strong className='text-orange-700'>{email}</strong>
      </>
    );
  };

  const assignUserRole = async () => {
    try {
      setIsLoading(true);
      const response = await UserServices.assignUserRole(
        role.value === "normalUser" ? 0 : 1,
        userId
      );
      if (response.status === 200) {
        toast.success("User Role Updated");
        getAllUsers();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.error || error.message);
    }
  };
  return (
    <>
      <Select options={options} value={value} onChange={handleChange} />
      {/* Warning modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Warning !!!</ModalHeader>
        <ModalBody>{renderModalBody()}</ModalBody>
        <ModalFooter>
          <div className='hidden sm:block'>
            <Button layout='outline' onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className='hidden sm:block' onClick={assignUserRole}>
            <Button>Accept</Button>
          </div>
          <div className='block w-full sm:hidden'>
            <Button block size='large' layout='outline' onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className='block w-full sm:hidden'>
            <Button block size='large' onClick={assignUserRole}>
              Accept
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default UsersList;
