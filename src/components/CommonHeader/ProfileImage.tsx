import React from 'react';
import Image from 'next/image';

interface IProfileImageProps {
  width?: number | string | any;
  height?: number | string | any;
  src?: string | any;
  alt?: string;
  style?: any;
}

function ProfileImage({
  width = 36,
  height = 36,
  src,
  alt = 'profile-logo',
  style = { objectFit: 'contain', borderRadius: '50%' },
}: IProfileImageProps) {
  return (
    <>
      <Image
        src={src ? src : 'https://www.gravatar.com/avatar?d=mp&f=y'}
        alt={alt}
        width={width}
        height={height}
        // style={{ borderRadius: '50%' }}
        style={style}
      />
    </>
  );
}

export default ProfileImage;
