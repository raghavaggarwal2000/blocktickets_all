import React from 'react'
import './eventCreator.css'
import HorizontalLinearStepper from "../../components/Stepper/Stepper"
import { useNavigate, Navigate } from 'react-router-dom'
import {_is_event_creator} from '../../utils/_user_info'

const EventCreator = () => {
  let navigate = useNavigate();

  if(_is_event_creator()) {
    return <Navigate to="/organizer-form" />
  }
  return ( 
    <div className='w-full bg-[#E5E5E5] py-[120px] min-h-[400px]'>
      <div className="mx-auto p-4 w-1/2 flex justify-center items-center flex-col screen18:w-full overflow-hidden bg-white screen7:rounded-none">
        <h3 className='mb-4 text-3xl text-center font-semibold'>Create Account As Event Creator</h3>
          <HorizontalLinearStepper />
          <p>Need help? Contact at <a href="mailto:info@blocktickets.io">info@blocktickets.io</a></p>
      </div>
    </div>
  )
}

export default EventCreator