"use client";
import { Fragment, use, useEffect, useState,  } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { createTempOrderFunc, createOrderFunc, getOrdersFunc } from '../../../redux/slices/orderSlices';
import { useSession } from "next-auth/react";
import { errorToast, successToast } from '@/components/toster';
import Link from 'next/link';
import moment from "moment"
import Unitedfreecard from "@/components/frontside/unitedfree/page";
import { FaCircle, FaStar } from "react-icons/fa6";


export default function Checkout() {
    const { data: session, status }: any = useSession();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams()
    const search = searchParams.get('wish')
    const orders: any[] = useAppSelector((state) => state?.orderReducer?.orders);
    const wishlist: any[] = useAppSelector((state) => state?.wishListReducer?.wishList);
    const [info, setInfo] = useState("description");


    const careAboutItems1 = [
        {
            id: 1,
            image: "/image/unitedfree.jpg",
            label: "Absolut",
            description: "Face and Body Lotion",
        },
        {
            id: 2,
            image: "/image/unitedfree.jpg",
            label: "Absolut",
            description: "Face and Body Lotion",
        },
        {
            id: 3,
            image: "/image/unitedfree.jpg",
            label: "Absolut",
            description: "Face and Body Lotion",
        },
    ];

    return (
        <>
            <div className="grid grid-cols-2 w-full h-full">
                <div className="bg-red-300">image</div>
                <div className="bg-blue-300 p-5 ">
                    <div className="border-gray-400 pb-5  border-b-2">
                        <div className="flex items-center gap-5">
                            <p className="text-4xl font-medium">Woodie Blake</p>
                            <div className="text-xl font-light bg-orange-900 text-white px-3 py-1 rounded-full">
                                20% OFF
                            </div>
                        </div>
                        <div className="flex py-2 items-center gap-5">
                            <p className="text-2xl">$110.0</p>
                            <p>$35.0</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1 text-sm text-orange-900">
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                            </div>
                            <p className="text-sm">(45)</p>
                        </div>
                    </div>
                    <div className="py-5">
                        <div className="font-medium flex items-center gap-3">
                            <p>Availability:</p>
                            <p className="text-green-300">In Stock</p>
                        </div>
                        <p className="py-5">
                            Versatile, comfortable, and chic! Three words that describe Blake
                            by Elyssi.
                        </p>
                        <div className="grid grid-cols-7 items-center gap-5">
                            <p>Color</p>
                            <div className="flex gap-1">
                                <FaCircle />
                                <FaCircle />
                                <FaCircle />
                                <FaCircle />
                            </div>
                        </div>{" "}
                        <div className="grid grid-cols-7 items-center gap-5 py-5">
                            <p>size</p>
                            <div className="col-span-3">
                                <input type="text" placeholder="small" className="w-full" />
                            </div>
                        </div>
                        <div className="grid grid-cols-7 items-center gap-5 py-5">
                            <p>Quantity</p>
                            <div className="col-span-3">
                                <input type="text" placeholder="small" className="w-full" />
                            </div>
                        </div>
                        <div className="flex items-center gap-5">
                            <button>Add to cart </button>
                            <button> buy now</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-green-200">
                <div className="flex items-center ">
                    <button
                        className={`p-3 ${info === "description" && "bg-pink-100"}`}
                        onClick={() => setInfo("description")}
                    >
                        Description
                    </button>
                    <button
                        className={`p-3 ${info === "additionalinfo" && "bg-pink-100"}`}
                        onClick={() => setInfo("additionalinfo")}
                    >
                        Additional Information
                    </button>
                    <button
                        className={`p-3 ${info === "reviews" && "bg-pink-100"}`}
                        onClick={() => setInfo("reviews")}
                    >
                        Reviews
                    </button>
                </div>
                <div className="bg-pink-100">
                    {info === "description" && (
                        <>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
                            optio voluptatibus cumque aliquam possimus neque qui quasi
                            consectetur aperiam incidunt dolor provident id dicta, doloribus
                            deserunt ullam, voluptatem accusantium est?
                        </>
                    )}{" "}
                    {info === "additionalinfo" && (
                        <>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
                            optio voluptatibus cumque aliquam possimus neque qui quasi
                            consectetur aperiam incidunt dolor provident id dicta, doloribus
                            deserunt ullam, voluptatem accusantium est? Lorem ipsum dolor sit
                            amet consectetur adipisicing elit. Suscipit optio voluptatibus
                            cumque aliquam possimus neque qui quasi consectetur aperiam
                            incidunt dolor provident id dicta, doloribus deserunt ullam,
                            voluptatem accusantium est? Lorem ipsum dolor sit amet consectetur
                            adipisicing elit. Suscipit optio voluptatibus cumque aliquam
                            possimus neque qui quasi consectetur aperiam incidunt dolor
                            provident id dicta, doloribus deserunt ullam, voluptatem
                            accusantium est?
                        </>
                    )}{" "}
                    {info === "reviews" && (
                        <>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
                            optio voluptatibus cumque aliquam possimus neque qui quasi
                            consectetur aperiam incidunt dolor provident id dicta, doloribus
                            deserunt ullam, voluptatem accusantium est? Lorem ipsum dolor sit
                            amet consectetur adipisicing elit. Suscipit optio voluptatibus
                            cumque aliquam possimus neque qui quasi consectetur aperiam
                            incidunt dolor provident id dicta, doloribus deserunt ullam,
                            voluptatem accusantium est? Lorem ipsum dolor sit amet consectetur
                            adipisicing elit. Suscipit optio voluptatibus cumque aliquam
                            possimus neque qui quasi consectetur aperiam incidunt dolor
                            provident id dicta, doloribus deserunt ullam, voluptatem
                            accusantium est? Lorem ipsum dolor sit amet consectetur
                            adipisicing elit. Suscipit optio voluptatibus cumque aliquam
                            possimus neque qui quasi consectetur aperiam incidunt dolor
                            provident id dicta, doloribus deserunt ullam, voluptatem
                            accusantium est? Lorem ipsum dolor sit amet consectetur
                            adipisicing elit. Suscipit optio voluptatibus cumque aliquam
                            possimus neque qui quasi consectetur aperiam incidunt dolor
                            provident id dicta, doloribus deserunt ullam, voluptatem
                            accusantium est?
                        </>
                    )}
                </div>
            </div>
            <div className="p-5">
                <div className="flex justify-center items-center uppercase  text-5xl pt-10 font-normal text- unica-one">
                    <p>Related Products</p>
                </div>
                <p className="flex justify-center">
                    Get the latest news & updates from Elyssi
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 pt-10  lg:mx-44 gap-5 ">
                    {careAboutItems1.map((item) => (
                        <Unitedfreecard
                            key={item.id}
                            image={item.image}
                            label={item.label}
                            discription={item.description}
                        />
                    ))}
                </div>
                <div className="hidden lg:flex justify-center items-center py-11">
                    <img src="/image/Slider.svg" alt="" />
                </div>
            </div>
        </>
    )
}

