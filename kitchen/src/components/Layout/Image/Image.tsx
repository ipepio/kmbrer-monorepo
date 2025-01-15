import { CSSProperties, useState } from 'react'

export interface ImageProps {
  src: string
  alt: string
  className?: string
  style?: CSSProperties
  onLoad?: () => void
}

export const Image = ({ src, alt, className = '', style = {}, onLoad }: ImageProps) => {

  const [loaded, setLoaded] = useState(true)

  return (
    <>
      {!loaded && (<div className='w-full h-[32px] darkGlow inline-block'>X</div>)}
      <img
        className={className}
        src={src}
        alt={alt}
        style={{
          ...style,
          display: loaded ? 'visible' : 'hidden'
        }}
        onLoad={() => {
          setLoaded(false)
          onLoad && onLoad()
          setLoaded(true)
        }}
      />

    </>
  )
}
