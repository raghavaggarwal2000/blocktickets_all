import React from 'react'
import Dialog from '@mui/material/Dialog'
import CloseIcon from '@mui/icons-material/Close' 
import {useNavigate} from 'react-router-dom'
const CreatorInfo = ({setOpen, open}) => {
  let navigate = useNavigate()
  const onClose = () => {
    setOpen(false)
  }
  return (
    <React.Fragment>
      <Dialog 
      onClose={onClose} 
      open={open}
      PaperProps={{style:{width: '400px', height: '300px'}}}
    >
      <div className="flex items-center gap-4 justify-center relative flex-col w-full h-full p-4">
        <div onClick={onClose} className="absolute top-4 right-4 rounded-full cursor-pointer bg-[#00000033] text-white"><CloseIcon /></div>
        <h2 className="text-center">Event Organiser</h2>
        <span className="text-center">To become event Creator please register and verify your email first,<br/> After submit your information using create on homepage.</span>
        <button className="py-3 px-6 bg-BlueButton text-white text-lg rounded-lg" onClick={onClose}>Close</button>
      </div>
    </Dialog>
    </React.Fragment>
  )
}

export default CreatorInfo