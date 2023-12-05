import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

export default function ThreeLoader() {
  return (
    <div className="ThreeDot">
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        className="ThreeDot justify-content-center"
        color="#0e0e3d"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    </div>
  );
}
