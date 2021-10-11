import React, { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  negative?: Boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({
  disabled,
  negative = false,
  children,
  ...rest
}: ButtonProps) => (
  <button
    {...rest}
    className={`
    ${
      disabled
        ? 'bg-gray-500 cursor-not-allowed'
        : (negative ? 'bg-red-600' : 'bg-blue-600') + ' cursor-pointer'
    } 

    filter  text-white text-sm rounded-md px-3 py-1 text-center border-transparent hover:brightness-110 active:bg-white active:text-black w-full`}
  >
    {children}
  </button>
)

export default Button
