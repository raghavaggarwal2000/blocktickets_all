import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";

const CreatorDetails = ({
  creatorDetails,
  isShowModal,
  closeModal,
  verifyUser,
}) => {
  const renderModalBody = () => {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {creatorDetails?.companyName}
          </h3>
          {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal details and application.
            </p> */}
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex flex-wrap justify-center">
              {/* <div className=""> */}
              <dt className="text-sm font-medium text-gray-500">Pan Card</dt>
              <img
                src={creatorDetails?.panUrl}
                className="p-1 bg-white border rounded max-w-sm"
                alt="..."
              />
              {/* </div> */}
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex flex-wrap justify-center">
              {/* <div className=""> */}
              <dt className="text-sm font-medium text-gray-500">Cheque</dt>
              <img
                src={creatorDetails?.chequeUrl}
                className="p-1 bg-white border rounded max-w-sm"
                alt="..."
              />
              {/* </div> */}
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {creatorDetails?.companyAddress}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {creatorDetails?.email}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {creatorDetails?.phone}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Bank Account Name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {creatorDetails?.bankAccountName}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Bank Account Number
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {creatorDetails?.bankAccountNumber}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">IFSC Code</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {creatorDetails?.ifscCode}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Bank Account Type
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {creatorDetails?.bankAccountType}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Is Approved</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {creatorDetails?.isVerified ? "Yes" : "No"}
              </dd>
            </div>

            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">City</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {creatorDetails?.city}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">State</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {creatorDetails?.state}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Country</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {` ${creatorDetails?.country}`}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Zip</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {`${creatorDetails?.zip}`}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    );
  };
  return (
    <Modal isOpen={isShowModal} onClose={closeModal}>
      <ModalHeader>Company Details</ModalHeader>
      <ModalBody style={{ height: "28rem" }} className="overflow-y-auto ">
        {renderModalBody()}
      </ModalBody>
      <ModalFooter>
        {/* I don't like this approach. Consider passing a prop to ModalFooter
         * that if present, would duplicate the buttons in a way similar to this.
         * Or, maybe find some way to pass something like size="large md:regular"
         * to Button
         */}
        <div className="hidden sm:block">
          <Button layout="outline" onClick={closeModal}>
            Close
          </Button>
        </div>
        {!creatorDetails.isVerified && (
          <div className="hidden sm:block">
            <Button onClick={() => verifyUser(creatorDetails._id)}>
              Verify User
            </Button>
          </div>
        )}
        <div className="block w-full sm:hidden">
          <Button block size="large" layout="outline" onClick={closeModal}>
            Close
          </Button>
        </div>
        {!creatorDetails.isVerified && (
          <div className="block w-full sm:hidden">
            <Button
              block
              onClick={() => verifyUser(creatorDetails._id)}
              size="large"
            >
              Verify User
            </Button>
          </div>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default CreatorDetails;
