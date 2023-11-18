import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";

const NftDetails = ({ nftDetails, isShowModal, closeModal }) => {

  const renderModalBody = () => {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {nftDetails?.name}
          </h3>
          {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal details and application.
            </p> */}
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex flex-wrap justify-center">
              {/* <div className=""> */}
              <img
                src={nftDetails?.imageUrl}
                className="p-1 bg-white border rounded max-w-sm"
                alt="..."
              />
              {/* </div> */}
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {nftDetails?._id}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Image Hash</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {nftDetails?.imageHash}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {nftDetails?.description}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Current Owner Address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {nftDetails?.currentOwnerAddress}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Is Approved</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {nftDetails.isApproved ? "Yes" : "No"}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">NFT Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {nftDetails?.nftType}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Auction Id</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {nftDetails?.auctionId}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Block Number
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {nftDetails?.blockNumber}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total Price</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {`₹ ${nftDetails?.totalPrice}`}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isShowModal} onClose={closeModal}>
      <ModalHeader>NFT Details</ModalHeader>
      <ModalBody style={{ height: "25rem" }} className="overflow-y-auto ">
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
        {/* <div className="hidden sm:block">
          <Button>Accept</Button>
        </div> */}
        <div className="block w-full sm:hidden">
          <Button block size="large" layout="outline" onClick={closeModal}>
            Close
          </Button>
        </div>
        {/* <div className="block w-full sm:hidden">
          <Button block size="large">
            Accept
          </Button>
        </div> */}
      </ModalFooter>
    </Modal>
  );
};

export default NftDetails;
