import React from 'react'

export interface IMeetProps extends React.HTMLAttributes<HTMLDivElement> {
  iframe?: string
}

const Meet: React.FC<IMeetProps> = ({ iframe, ...res }: IMeetProps) => {
  return (
    <div
      {...res}
      dangerouslySetInnerHTML={{
        __html: iframe || '',
      }}
    ></div>
  )
}

export default React.memo(Meet)
