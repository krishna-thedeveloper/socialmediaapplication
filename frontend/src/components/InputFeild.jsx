import React from 'react'

const InputFeild = ({name,placeholder,type}) => {
  return (
    <input className=' outline-0 p-2 bg-inherit text-2xl text-slate-400 ' name={name} placeholder={placeholder} type={type}/>
  )
}

export default InputFeild
