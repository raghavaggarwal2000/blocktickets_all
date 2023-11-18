import React from "react";

export default function ImgPop({ imgPopState, setImgPopState, layoutImg }) {
  return (
    <>
      {imgPopState ? (
        <div
        className=""
        onClick={() => {
          setImgPopState(false);
        }}>
          <div>
            <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto absolute mt-10 inset-0 z-50 outline-none focus:outline-none h-full '>
              <div onClick={(e) => e.stopPropagation()} className='relative w-auto my-6 mx-auto max-w-3xl  '>
                {/*content*/}
                <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none  '>
                  {/*body*/}
                  <div className='border-2 border-white'>
                    <button
                      className=' absolute top-0 right-0 mt-2 mr-2 text-red bg-white rounded-3xl px-3 py-2 font-bold uppercase text-lg outline-none focus:outline-none  ease-linear transition-all duration-150'
                      type='button'
                      onClick={() => setImgPopState(false)}
                    >
                      X
                    </button>
                    <img src={layoutImg} alt='layout image' />
                  </div>
                </div>
              </div>
            </div>
            <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
          </div>
        </div>
      ) : null}
    </>
  );
}
