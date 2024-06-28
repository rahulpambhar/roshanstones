"use client";
// import Image from "next/image";
// import React, { useState, useEffect } from "react";

// const images = [
//   "/image/eyeliner.png",
//   "/image/fab-matte.png",
//   "/image/glam.png",
//   "/image/liquid-lipstick.png",
// ];

// const ImageSlider: React.FC = () => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prevIndex) =>
//         prevIndex === images.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 3000); // Change image every 3 seconds

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="relative bg-black  h-[82vh]">
//       {images.map((image, index) => (
//         <img
//           key={index}
//           src={image}
//           alt={`Image `}
//           //   width={100}
//           //   height={100}
//           //   quality={100}
//           className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
//             currentImageIndex === index ? "opacity-100" : "opacity-0"
//           }`}
//         />
//       ))}
//     </div>
//   );
// };

// export default ImageSlider;

import React, { useState, useEffect } from "react";

const images = [
  "/image/eyeliner.png",
  "/image/fab-matte.png",
  "/image/glam.png",
  "/image/liquid-lipstick.png",
];

const ImageSlider: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 7000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const changeImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="relative bg-black h-[70vh]">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Image ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
            currentImageIndex === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute -bottom-7 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <span
            key={index}
            onClick={() => changeImage(index)}
            className={`h-2 w-2 rounded-full bg-gray-500 mx-1 cursor-pointer ${
              currentImageIndex === index ? "!bg-black" : ""
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
