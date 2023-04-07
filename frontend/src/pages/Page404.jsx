import React from 'react';
import { useLocation } from 'react-router-dom';

function Page404 () {
  const location = useLocation();

  return (
    <>
        Route {location.pathname} not found!
    </>
  )
}

export default Page404;
