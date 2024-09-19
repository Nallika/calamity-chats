import React from 'react';

/**
 * 
 */
const Loader = () => {

   return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
   );
 }
 
 export default React.memo(Loader);