import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { set } from "date-fns";

const sizes = {
  Logo: "2:1 ratio around 2000x1000px",
  "Event Banner Image": "2:1 around 5000x2500px",
  "Event Square Banner Image": "1:1 around 1080x1080px",
  "Sponsor image": "3:1 around around 300X100px",
  "Artist image": "2:1 ratio around 200X100px",
};

const ImageUpload = ({
  imageField,
  setValue,
  pinataUpload,
  setPageLoading,
  watch,
  fileType,
  square,
  required,
  ratio,
  maxH,
  maxW,
}) => {
  const watchFields = watch([imageField]);
  const [uploaded, setUploaded] = useState(watchFields[0]);
  const imageUpload = async (image, name, info) => {
    // const image = e.target.files[0];
    let NFTFormData = new FormData();
    NFTFormData.append("name", name);
    NFTFormData.append("description", info);
    NFTFormData.append("collection", "blocktickets");
    NFTFormData.append("nftType", "image");
    NFTFormData.append("image", image);
    NFTFormData.append("pinataUpload", pinataUpload);
    const res = await axios.post(
      // "https://backend.unicus.one/pinata_upload",
      `${process.env.REACT_APP_BACKEND_URL}/nft/upload-pinata`,
      NFTFormData,
      axiosConfig
    );
    const uploadRes = res.data;
    let pinata = null;
    if (pinataUpload) {
      const tokenUri =
        "https://unicus.mypinata.cloud/ipfs/" + uploadRes?.pinata_hash;
      console.log("tokenUri: ", tokenUri);
      const val = await axios.get(tokenUri);
      pinata = { tokenUri, pin_image: val?.data?.image };
    }

    return {
      s3: uploadRes?.s3_upload,
      pinata: pinata,
    };
  };

  async function checkImageRatio(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const { width, height } = img;
          const currentRatio = width / height;
          if (currentRatio != ratio) {
            reject();
          } else if (height > maxH || width > maxW) {
            reject();
          } else {
            resolve();
          }
        };
      };
    });
  }

  const handleFiles = async (e) => {
    e.preventDefault();
    setPageLoading(true);

    let fileSize = e.target.files[0]?.size;

    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = async() => {
        const { width, height } = img;
        const currentRatio = width / height;
        if (currentRatio != ratio) {
          toast.error("Image dimension is wrong")
          e.target.value = null;
        } else if (height > maxH || width > maxW) {
          toast.error("Image dimension is wrong")
          e.target.value = null;
        } else if(fileSize > 10 * 1000000){
          toast.error(
            `File size is too large, please upload image of size less than 10MB.\nSelected File Size: ${(
              fileSize / 1000000
            ).toFixed(2)} MB`
          );
          e.target.value = null;
        }
        else {
          setTimeout(async () => {
            try {
              const iu = await imageUpload(file, imageField, imageField);
              console.log("iu: ", iu);
              setValue(imageField, iu);
              setUploaded(iu);
            } catch (err) {
              console.log(err);
              toast.error(err?.response?.data?.err || "ISE: Error in image uploading");
            }
          }, 3000)
        }
      };
      img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);

    // if (fileSize > 10 * 1000000) {
    //   // fileSize > 10MB then show popup message
    //   toast.error(
    //     `File size is too large, please upload image of size less than 10MB.\nSelected File Size: ${(
    //       fileSize / 1000000
    //     ).toFixed(2)} MB`
    //   );
    //   return;
    // }
    // console.log("foooo")
    // try {
    //   const iu = await imageUpload(e.target.files[0], imageField, imageField);
    //   console.log("iu: ", iu);
    //   setValue(imageField, iu);
    //   setUploaded(iu);
    // } catch (err) {
    //   console.log(err?.response);
    //   toast.error(err?.response?.data?.err || "ISE: Error in image uploading");
    // }

    setPageLoading(false);
  };
  const handleDelete = () => {
    setValue(imageField, "");
    setUploaded("");
  };
  useEffect(() => {
    setUploaded(watchFields[0]);
  }, [watchFields]);

  return (
    <div className="grid grid-cols-1 place-items-center w-full h-full">
      {!uploaded?.s3 ? (
        <label
          className={`hover:cursor-pointer hover:opacity-75 flex flex-col ${
            square ? "w-[264px]" : "min-w-[264px] w-full"
          } h-full max-h-[264px] rounded-xl border-dashed border-2 border-accent gap-1 justify-center items-center`}
        >
          <div className="bg-[#2F69FF33] rounded-full w-fit p-1">
            <AddRoundedIcon className="text-silver" />
          </div>
          <div className="font-medium text-silver text-center">
            Upload {imageField} {sizes[imageField]}{" "}
            <span>
              (Max 10 MB) {required && <sup className="text-red">*</sup>}
            </span>
          </div>
          <input
            type="file"
            accept={
              fileType === "video"
                ? "video/mp4,video/x-m4v,video/*"
                : ".jpg,.jpeg,.png,.webp"
            }
            onChange={handleFiles}
            className="opacity-0 absolute max-w-[1px] max-h-[1px]"
            required={required}
          />
        </label>
      ) : (
        <div
          onClick={handleDelete}
          className="relative w-full h-full max-h-[264px] overflow-hidden rounded-xl imageHover cursor-pointer"
        >
          {fileType === "video" ? (
            <video alt="video" width="400" controls>
              <source src={uploaded?.s3} type="video/mp4"></source>
            </video>
          ) : (
            <img
              src={uploaded?.s3}
              alt="file"
              className="w-full h-full absolute object-cover z-0"
            />
          )}
          <div className="h-full w-full absolute flex justify-center items-center bg-gray-900/50 z-10 text-white font-bold">
            X
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

let axiosConfig = {
  headers: {
    "Content-Type":
      "multipart/form-data;boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
  },
};
