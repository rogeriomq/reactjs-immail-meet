import React from 'react'

type HeaderProps = {
  title: string
  subtitle?: string
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle = '',
}: HeaderProps) => (
  <div className="flex flex-col w-full">
    <div className="font-bold text-lg">{title}</div>
    <div className="font-normal text-sm">{subtitle}</div>
  </div>
)

export default Header
