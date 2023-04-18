import React from 'react';

function MediaDisplay ({ mediaType, media }) {
  return (
    <>
      { mediaType === 'url'
        ? (
            <iframe src={media}
              type='text/html'
              width='711'
              height='400'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media;'
              allowFullScreen
              title={'Question video'}
            ></iframe>
          )
        : mediaType === 'image'
          ? (
              <img src={media}
                alt={'Question image'}
              />
            )
          : (
            <></>
            )
      }
    </>
  )
}

export default MediaDisplay;
