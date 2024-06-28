import React from "react";
import { TbStarFilled } from "react-icons/tb";
import { TbStar } from "react-icons/tb";

const Unitedfreecard = ({
  image,
  label,
  discription,
}: {
  image: string;
  label: string;
  discription: string;
}) => {
  return (
    <div className="mx-5  ">
      <div className="relative overflow-hidden">
        {" "}
        <img src={image} alt={label} className="" />
        <div className="absolute h-full w-full bg-black/20 flex justify-center items-center -bottom-10 hover:bottom-0 opacity-0 hover:opacity-100 transition-all duration-300">
          <div className="flex flex-col gap-48 ">
            <div>
              <div className="flex text-white gap-3 justify-center items-center">
                <TbStarFilled />
                <TbStarFilled />
                <TbStarFilled />
                <TbStarFilled />
                <TbStar />
              </div>
              <div className="text-white font-normal text-2xl unica-one flex justify-center items-center">
                $ 22.00
              </div>
            </div>
            <div className="roboto font-normal text-xl text-white border-b-2 flex justify-center items-center">
              {" "}
              ADD TO CART
            </div>{" "}
          </div>
        </div>
      </div>
      <p className="text-2xl font-normal pt-5 roboto">
        <label htmlFor="">{label}</label>
      </p>
      <p className="pt-1 text-base text-[#6D6D6D] roboto">{discription}</p>
    </div>
  );
};

export default Unitedfreecard;
