import CsvDownloader from "react-csv-downloader";
import {Button} from "@windmill/react-ui";
import React from "react";
import {BiExport} from "react-icons/bi";
const CSVButton = (props) => {
  return (
    <CsvDownloader
      datas={props.data}
      columns={props.columns}
      filename={props.filename}
      className="h-9"
      {...props}
    >
      <Button size="small">
        Export Data <BiExport className="mb-1 ml-1" size={20} />
      </Button>
    </CsvDownloader>
  );
};

export default CSVButton;
