import React from 'react';
import { ColorRing } from 'react-loader-spinner';

export default function FormSubmitLoader() {
  return (
    <div className="overlayLoadingItem1">
      <ColorRing
        visible={true}
        height="40"
        width="40"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={[
          'rgba(0, 0, 0, 1) 0%',
          'rgba(255, 255, 255, 1) 68%',
          'rgba(0, 0, 0, 1) 93%',
        ]}
      />
    </div>
  );
}
