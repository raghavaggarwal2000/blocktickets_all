import { useState, useRef } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TextInput from '../../components/TextInput/TextInput';
import { useNavigate } from 'react-router';

const ListEventForm = () => {
  const navigate = useNavigate()
  return <div className='w-full mt-[70px] flex flex-col justify-center items-center'>
    <div className='px-8 max-w-[800px]'>
      <h1 className='mt-8 font-semibold'>Create New Ticket</h1>
      <Form />
    </div>
  </div>
}

const Form = () => {
  const imageRef = useRef();
  const [eventImage, setEventImage] = useState("");

  const uploadEventImage = (e) => {
    const image = e.target.files;
    setEventImage(image[0]);
  };

  const listEvent=()=>{
    
  }
  return (
    <div className="w-full flex flex-col gap-4 mb-12">
      <span className="font-medium text-xs text-[#707a83]"><span className="text-[#dc4437]">*</span> Required fields</span>
      <div className='gap-2 flex flex-col'>
        <span className="font-semibold text-[#353840]">Upload video/image<span className="text-[#dc4437]"> *</span></span>
        {/* <span>Upload video/image</span> */}
        <div onClick={()=>imageRef.current.click()} className="w-full cursor-pointer h-[300px] border-3 border-dashed border-LightColor rounded-xl flex flex-col gap-2 justify-center items-center">
          <span className="text-lg font-bold">
            Image, Video, Audio, or 3D Model
          </span>
          <span className="text-DarkColor w-2/3 text-center">
            File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG,
            GLB, GLTF. Max size: 100 MB
          </span>
          <button
            className="bg-GreyButton text-blue px-3 py-2 rounded-lg font-medium"
            onClick={()=>imageRef.current.click()}
          >
            Upload
          </button>
          <input
            className="d-none"
            type="file"
            id="eventImage"
            name="eventImage"
            ref={imageRef}
            onChange={(e) => {
              uploadEventImage(e);
            }}
          />
        </div>
      </div>
      <SelectMenu title="Type of Event" required />
      <TextInput title="Event name" placeholder="Enter event name" required />
      <TextInput title="Name of" placeholder="Enter Something" required />
      <TextInput title="Event name" placeholder="Enter event name" multi required />
      <TextInput
        title="Event Location (venue/online/tbs)"
        placeholder="Enter description"
        required
      />
      <TextInput title="Date (Receiving/Single time)" date required />
      <div className="flex gap-4 w-full">
        <TextInput title="Start time" time required />
        <TextInput title="End time" time required />
      </div>
      <TextInput title="No. of tickets" placeholder="Enter number of tickets" required />
      <TextInput title="Set price" placeholder="Enter ticket price" required />
      <div className="flex justify-between">
        <button className="px-3 py-2 rounded-lg bg-GreyButton text-blue ">
          Cancel
        </button>
        <button className="px-3 py-2 rounded-lg bg-BlueButton text-white">
          Create Event
        </button>
      </div>
    </div>
  );
}


const SelectMenu = ({title, required})=>{
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [active, setActive] = useState('Event')
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
      setAnchorEl(null);
      setActive(event.target.value)
      // console.log(event.target.value)
    };

    return <div className='selectMenu flex flex-col relative'>
        <span className="font-semibold mb-1 text-[#353840]">{title}{required && <span className="text-[#dc4437]"> *</span>}</span>
        <div onClick={handleClick} className='flex justify-between items-center border-1 border-LightColor rounded-lg p-3 w-full'>
            <span>{active}</span>
            <ArrowDropDownIcon fontSize='small' />
        </div>
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
            PaperProps={{style: {
              width: '100%'
            }}}
        >
            <MenuItem className='p-0'><button className='w-full h-full text-left px-4 py-2' onClick={handleClose} value={'Event'}>Event</button></MenuItem>
            <MenuItem className='p-0'><button className='w-full h-full text-left px-4 py-2' onClick={handleClose} value={'Sports'}>Sports</button></MenuItem>
            <MenuItem className='p-0'><button className='w-full h-full text-left px-4 py-2' onClick={handleClose} value={'Plays'}>Plays</button></MenuItem>
            <MenuItem className='p-0'><button className='w-full h-full text-left px-4 py-2' onClick={handleClose} value={'Metaverse'}>Metaverse</button></MenuItem>
            <MenuItem className='p-0'><button className='w-full h-full text-left px-4 py-2' onClick={handleClose} value={'Conference'}>Conference</button></MenuItem>
        </Menu>
    </div>
}
// Event/Sports/Plays/Metaverse/Conference
export default ListEventForm