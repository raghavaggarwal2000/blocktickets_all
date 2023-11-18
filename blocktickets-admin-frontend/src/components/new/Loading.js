import React from "react";
import SyncLoader from "react-spinners/SyncLoader";
import PuffLoader from "react-spinners/PuffLoader";
import ScaleLoader from "react-spinners/ScaleLoader";

const Loading = (props) => {
  return (
    <>
      {props.loading && (
        <div className="fixed inset-0 z-40 flex items-end bg-opacity-25 bg-black bg-white/30 sm:items-center sm:justify-center">
          {/* <SyncLoader
            loading={props.loading}
            size={30}
            margin={8}
            color={"#7E3AF2"}
          /> */}
          {/* <PuffLoader
            className="z-50"
            loading={props.loading}
            size={200}
            margin={8}
            color={"#7E3AF2"}
          /> */}
          <ScaleLoader
            className="z-50"
            loading={props.loading}
            // size={500}
            height={80}
            radius={7}
            width={8}
            margin={10}
            color={"#75BF54"}
          />
        </div>
      )}
    </>
  );
};

export default Loading;
