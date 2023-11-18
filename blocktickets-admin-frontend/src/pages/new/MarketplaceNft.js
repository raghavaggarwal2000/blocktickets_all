import React, { useEffect, useState } from "react";
import { Card, CardBody, Badge, Button } from "@windmill/react-ui";
import { TicketServices } from "../../services/api-client";
import toast from "react-hot-toast";
import TableComp from "../../components/Table";
import PageTitle from "../../components/Typography/PageTitle";
import { BsEye } from "react-icons/bs";
import Loading from "../../components/new/Loading";
import NftDetails from "./NftDetails";

const MarketplaceNft = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
  });
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentNftDetails, setCurrentNftDetails] = useState({});

  const closeModal = () => {
    setIsShowModal(false);
    setCurrentNftDetails({});
  };

  const setCurrentPage = (page) => {
    setPagination({ ...pagination, page: page });
  };
  useEffect(() => {
    getAllTickets();
  }, []);

  const getAllTickets = async () => {
    try {
      setIsLoading(true);
      const response = await TicketServices.getTicketsOnSale();
      // console.log(response.data);
      setPagination({ ...pagination, total: response.data.data.meta.total });

      setNfts(response.data.data.ticketsOnSale);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response ? error.response.data.error : error.message);
    }
  };

  const tableColumns = [
    {
      title: "sr. no.",
      key: "serialNumber",
    },
    {
      title: "Name",
      key: "name",
    },
    {
      title: "Auction id",
      key: "auctionId",
    },
    {
      title: "Chain",
      key: "chain",
    },
    {
      title: "Type",
      key: "nftType",
    },
    {
      title: "Total Price",
      key: "totalPrice",
    },
    {
      title: "Actions",
      key: "actions",
    },
  ];

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    <>
      <PageTitle>Marketplace NFTs</PageTitle>
      <TableComp
        pagination={pagination}
        setCurrentPage={setCurrentPage}
        columns={tableColumns}
        tableData={nfts?.map((nft, index) => {
          return {
            serialNumber: (pagination.page - 1) * pagination.limit + index + 1,
            name: nft.nftRef.name,
            auctionId: nft.nftRef.auctionId,
            chain: nft.nftRef.chain,
            nftType: nft.nftRef.nftType,
            totalPrice: "₹ " + nft.nftRef.totalPrice,
            actions: (
              <Button
                className="mx-1"
                layout="outline"
                size="small"
                onClick={() => {
                  setIsShowModal(true);
                  setCurrentNftDetails(nft?.nftRef);
                }}
              >
                <BsEye fontWeight={"bolder"} size={16} color="#49A844" />
              </Button>
            ),
          };
        })}
      />
      <NftDetails
        isShowModal={isShowModal}
        closeModal={closeModal}
        nftDetails={currentNftDetails}
      />
    </>
  );
};

export default MarketplaceNft;
