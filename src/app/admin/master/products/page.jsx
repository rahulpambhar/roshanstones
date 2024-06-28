'use client';
// import { dataNotFound } from "@/assets";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Breadcrumb from "@/components/admin/breadcrumb";

import ReactPaginate from "react-paginate";
import { dataNotFound, } from "../../../../../public/assets";
import Loading from "@/components/admin/loading";
import axios from "axios";
import moment from "moment";
import { apiUrl } from "../../../../../env";
import { successToast, errorToast } from "../../../../components/toster/index";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../redux/slices/categorySlice';
import Select from 'react-select';
// import { ProductsData } from "@/components/frontside/DummyData";


export default function BuyHistory() {


    const [isLoading, setIsLoading] = useState(false);
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState({});
    const [modelToggle, setModelToggle] = useState(false);
    const [productsId, setProductId] = useState("");
    const [selectFilter, setSelectFilter] = useState("");
    const [updateImageIds, setUpdateImageIds] = useState([]);
    const [updateImages, setUpdateImages] = useState({});
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [deleteId, setDeleteId] = useState([]);
    const [deleteToggle, setDeleteToggle] = useState(false);
    const [subCatOptions, setSubCatOptions] = useState([]);
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories.categories);
    const maxDiscount = 30
    const [addProductData, setAddProductData] = useState({
        name: "",
        batchNo: "",
        uid: "",
        price: 0,
        discountedPrice: 0,
        discount: 0,
        brand: "",
        countInStock: 0,
        description: "",
        avgRating: 0,
        numReviews: 0,
        image: null,
        video: null,
        categoryId: "",
        subCategoryId: "",
        type: "",
    });

    const categoryOptions = categories.map((category) => ({
        value: category.id,
        label: category.name,
    }));

    const addOrUpdateProduct = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { categoryId, subCategoryId, name, batchNo, uid, price, description, discount, image, video, discountedPrice, brand, countInStock, type } = addProductData
        if (categoryId === "" && type === "add") {
            errorToast("Please select category");
            setIsLoading(false);
            return;
        } else if (subCategoryId === "" && type === "add") {
            errorToast("Please select sub category");
            setIsLoading(false);
            return;
        } else if (name === "") {
            errorToast("Please enter product name");
            setIsLoading(false);
            return;
        } else if (batchNo === "") {
            errorToast("Please enter batch no");
            setIsLoading(false);
            return;
        } else if (uid === "") {
            errorToast("Please enter uid");
            setIsLoading(false);
            return;
        } else if (price === 0) {
            errorToast("Please enter price");
            setIsLoading(false);
            return;
        } else if (discountedPrice === 0 || discount === 0) {
            errorToast("enter discount or disounted price")
            setIsLoading(false);
        } else if (description === "") {
            errorToast("Please enter description");
            setIsLoading(false);
            return;
        } else if (brand === "") {
            errorToast("enter brand")
            setIsLoading(false);
            return
        } else if (countInStock === 0) {
            errorToast("enter countInStock")
            setIsLoading(false);
            return
        } else if (image === null && type === "add") {
            errorToast("select images")
            setIsLoading(false);
            return

        } else if (video === null && type === "add") {
            errorToast("select video")
            setIsLoading(false);
            return
        }


        try {
            let formData = new FormData();
            formData.append("categoryId", categoryId);
            formData.append("subCategoryId", subCategoryId);
            formData.append("name", name);
            formData.append("batchNo", batchNo);
            formData.append("uid", uid);
            formData.append("price", price);
            formData.append("discountedPrice", discountedPrice);
            formData.append("discount", discount);
            formData.append("description", description);
            formData.append("brand", brand);
            formData.append("countInStock", countInStock);

            if (type === "add") {
                for (const x of image) {
                    formData.append('image', x);
                }
            } else {
                for (const x of updateImages.image) {
                    formData.append('image', x);
                }
                formData.append("updateImageIds", updateImageIds);
                formData.append("productsId", productsId);
            }

            formData.append("video", video);
            formData.append("type", type);

            let response = await axios.post(`${apiUrl}/admin/products`, formData);

            if (response.data.st === true) {
                // successToast(response.data.msg);
                setIsLoading(false);
                // getproductList()
                if (addProductData.type === "update") {
                    // setModelToggle(false);
                    // setAddProductData({
                    //     name: "",
                    //     batchNo: "",
                    //     uid: "",
                    //     price: 0,
                    //     discountedPrice: 0,
                    //     discount: 0,
                    //     brand: "",
                    //     countInStock: 0,
                    //     description: "",
                    //     avgRating: 0,
                    //     numReviews: 0,
                    //     image: null,
                    //     video: null,
                    //     categoryId: "",
                    //     subCategoryId: "",
                    //     type: "",
                    // });
                } else {
                    setAddProductData({
                        name: "",
                        batchNo: "",
                        uid: "",
                        price: 0,
                        discountedPrice: 0,
                        discount: 0,
                        brand: "",
                        countInStock: 0,
                        description: "",
                        avgRating: 0,
                        numReviews: 0,
                        image: null,
                        video: null,
                        categoryId: "",
                        subCategoryId: "",
                        type: "add",
                    });
                }
            } else {
                errorToast(response.data.msg);
                setIsLoading(false);
            }

        } catch (error) {
            console.log(error)
            errorToast(error);
            setIsLoading(false);
        }
    }


    const handleCheckboxChange = (data) => {
        const indexToDelete = deleteId.indexOf(data);

        if (indexToDelete !== -1) {
            const newArrey = deleteId.filter((item, index) => item !== data);
            setDeleteId(newArrey)
        } else {
            setDeleteId([...deleteId, data]);
        }
    };

    const deleteSubCategory = () => {
        setIsLoading(true);

        try {
            axios.delete(`${apiUrl}/admin/products`, { data: { productIds: deleteId } }).then((response) => {
                if (response.data.st === true) {
                    getproductList()
                    successToast(response.data.msg);
                    setDeleteToggle(false);
                    setDeleteId([]);
                    setIsLoading(false);
                } else {
                    errorToast(response.data.msg);
                    setIsLoading(false);
                }
            });
        } catch (error) {
            errorToast(error);
            setIsLoading(false);
        }

    };


    const getproductList = useCallback(async () => {
        setLoader(true);
        try {
            let response = await axios.get(`${apiUrl}/admin/products?page=${page}&limit=${perPage}&slug=getproductList`);

            if (response?.data.data) {
                setData(response?.data?.data);
                setPageCount(response?.data?.total_pages);
                setCurrentPage(response?.data?.current_page);

                setLoader(false);
            } else {
                setLoader(false);
            }
        } catch (error) {
            errorToast(error);
            setLoader(false);
        }
    }, [page, perPage]);

    const getfilterCategory = async () => {
        try {
            let response = await axios.get(`${apiUrl}/admin/subCategory?page=${page}&limit=${perPage}&id=${selectFilter}`);

            if (response?.data.data) {
                setData(response?.data?.data);
                setPageCount(response?.data?.total_pages);
                setCurrentPage(response?.data?.current_page);

            } else {
                errorToast(response.data.msg);

            }
        } catch (error) {
            errorToast(error);
        }
    }

    const setSubCategorySelect = (val) => {
        const subCategory = categories.filter((item) => item.id === val);
        setAddProductData({
            ...addProductData,
            categoryId: val,
        });
        setSubCatOptions(
            subCategory[0].SubCategory.map((subcategory) => ({
                value: subcategory.id,
                label: subcategory.name,
            }))
        );
    }

    const handleImageClick = (selectedImage) => {
        setUpdateImageIds((prevImages) => {
            if (prevImages.includes(selectedImage)) {
                return prevImages.filter(image => image !== selectedImage);
            } else {
                return [...prevImages, selectedImage];
            }
        });
    };

    useEffect(() => {
        dispatch(fetchCategories({ page: 1, limit: 100 }));
    }, [dispatch]);

    useEffect(() => {
        getproductList();
    }, [perPage, page,]);

    // useEffect(() => {
    //     getfilterCategory()
    // }, [selectFilter]);


    return (
        <div className="container">
            {/* <Breadcrumb /> */}
            <div className="filter-section position flex justify-between items-center py-5 ">
                <select
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    className="  block w-32 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                </select>
                <div className="flex gap-5  ">
                    <button type="button" className="filter-btn flex gap-1"
                    >
                        Add
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="left-margin-10"
                            onClick={(e) => {
                                setAddProductData({
                                    ...addProductData,
                                    type: "add",
                                });
                                setModelToggle(true)
                            }}
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.375 2.5H3.125V8.75H4.375V2.5ZM12 8.75H8L7.5 8.0625V6.8125L8 6.25H12L12.5 6.875V8.125L12 8.75ZM5.75 12.5H1.75L1.25 11.875V10.625L1.75 10H5.75L6.25 10.625V11.875L5.75 12.5ZM10.625 2.5H9.375V5H10.625V2.5ZM9.375 10H10.625V17.5H9.375V10ZM4.375 13.75H3.125V17.5H4.375V13.75ZM14.25 13.75H18.2375L18.7375 13.125V11.9375L18.2375 11.3125H14.25L13.75 11.9375V13.125L14.25 13.75ZM16.875 2.5H15.625V10H16.875V2.5ZM15.625 15H16.875V17.5H15.625V15Z"
                                fill="#CEA666"
                            />
                        </svg>
                    </button>
                    <button type="button" className="filter-btn flex gap-1   ">
                        Delete Multiple
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"

                            className="left-margin-10"
                            onClick={(e) => {
                                if (deleteId.length > 0) {
                                    setDeleteToggle(true)
                                } else {
                                    errorToast("product not selected");
                                }
                            }}
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.375 2.5H3.125V8.75H4.375V2.5ZM12 8.75H8L7.5 8.0625V6.8125L8 6.25H12L12.5 6.875V8.125L12 8.75ZM5.75 12.5H1.75L1.25 11.875V10.625L1.75 10H5.75L6.25 10.625V11.875L5.75 12.5ZM10.625 2.5H9.375V5H10.625V2.5ZM9.375 10H10.625V17.5H9.375V10ZM4.375 13.75H3.125V17.5H4.375V13.75ZM14.25 13.75H18.2375L18.7375 13.125V11.9375L18.2375 11.3125H14.25L13.75 11.9375V13.125L14.25 13.75ZM16.875 2.5H15.625V10H16.875V2.5ZM15.625 15H16.875V17.5H15.625V15Z"
                                fill="#CEA666"
                            />
                        </svg>
                    </button>
                    <div className="filter-btn flex gap-1 h-3">
                        <Select
                            className="left-margin-10"
                            id="dropdown"
                            placeholder={"filter category"}
                            options={categoryOptions}
                            onChange={(e) => {
                                setSelectFilter(e.value)
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className=" mt-4 relative overflow-x-auto shadow-md sm:rounded-lg ">
                <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-gray-200 dark:bg-gray-900">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative ml-auto">
                        <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="table-search-users"
                            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search for category"
                        />
                    </div>
                </div>

                <table className="w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Id
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Image
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Video
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Created At
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Updated At
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Delete
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Update
                            </th>
                        </tr>
                    </thead>
                </table>
                <tbody >
                    {
                        data.length > 0 ? data?.map((item, index) => (
                            <tr key={item.id} className="bg-gray-200  border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">

                                <th scope="row" className="flex items-center px-6  text-gray-900 whitespace-nowrap dark:text-white">
                                    <h6 className="font-normal text-gray-500">{item?.id}</h6>
                                </th>
                                <th scope="row" className="flex items-center px-6  text-gray-900 whitespace-nowrap dark:text-white">
                                        <Image
                                            className="small-img"
                                            width={100}
                                            height={100}
                                            src={`/products/${item?.image[0]}`}
                                            alt=""
                                        />
                                </th>
                                <th scope="row" className="flex items-center px-6  text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="font-normal text-gray-500">{item?.id}</div>
                                </th>
                                <th scope="row" className="flex items-center px-6  text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="font-normal text-gray-500">{item?.id}</div>
                                </th>
                                <th scope="row" className="flex items-center px-6  text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="font-normal text-gray-500">{item?.id}</div>
                                </th>
                                <th scope="row" className="flex items-center px-6  text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="font-normal text-gray-500">{item?.id}</div>
                                </th>
                                <th scope="row" className="flex items-center px-6  text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="font-normal text-gray-500">{item?.id}</div>
                                </th>
                            </tr>
                        ))
                            :
                            <tr className="justify-auto h-full">
                                <td colSpan={6} className="text-center">
                                    <div className="flex justify-center items-center">
                                        <Image
                                            width={100}
                                            height={100}
                                            src={dataNotFound}
                                            alt="Data not found"
                                        />
                                    </div>
                                </td>
                            </tr>
                    }
                </tbody>


            </div>




            {/* <div className="table-section position mb-4">
                <table className="table w-100 mb-0">
                    <thead>
                        <tr>
                            <th scope="col">NO</th>
                            <th scope="col">Name</th>
                            <th scope="col">Id</th>
                            <th scope="col">image</th>
                            <th scope="col">video</th>
                            <th scope="col">createdAt</th>
                            <th scope="col">updatedAt</th>
                            <th scope="col">Delete</th>
                            <th scope="col">Update</th>
                        </tr>
                    </thead>
                    {loader ? (
                        <tr>
                            <td colSpan={6}>
                                <Loading />{" "}
                            </td>
                        </tr>
                    ) :
                        <tbody>
                            {data.length > 0 ? (
                                <>
                                    {data.map((item, index) => (
                                        <tr key={index}>
                                            <td>{((currentPage - 1) * perPage) + (index + 1)}</td>

                                            <td>{item?.name}</td>
                                            <td>{item?.id}</td>
                                            <td>
                                                <Image
                                                    className="small-img"
                                                    width={100}
                                                    height={100}
                                                    src={`/products/${item?.image[0]}`}
                                                    alt=""
                                                />
                                            </td>
                                            <td>
                                                <video width="10" height="10" controls>
                                                    <source src={`products/video/${item?.video}`} />
                                                    Your browser does not support the video tag.
                                                </video>

                                            </td>
                                            <td>
                                                {moment(item?.createdAt).format("DD-MM-YYYY")}
                                            </td>
                                            <td>
                                                {" "}
                                                {moment(item?.updatedAt).format("DD-MM-YYYY")}
                                            </td>
                                            <td>
                                                <div>
                                                    <input
                                                        className="btn btn-danger"
                                                        type="checkbox"
                                                        onChange={e => handleCheckboxChange(item?.id)}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="edit-btn"
                                                    aria-label="i"
                                                    onClick={(e) => {
                                                        const { name, batchNo, uid, price, discountedPrice, discount, brand, countInStock, description, image, video, categoryId, subCategoryId } = item
                                                        setAddProductData({
                                                            // ...ProductsData,
                                                            name,
                                                            batchNo,
                                                            uid,
                                                            price,
                                                            discountedPrice,
                                                            discount,
                                                            brand,
                                                            countInStock,
                                                            description,
                                                            avgRating: 0,
                                                            numReviews: 0,
                                                            image,
                                                            video,
                                                            categoryId,
                                                            subCategoryId,
                                                            type: "update",
                                                        });
                                                        setModelToggle(true);
                                                        setProductId(item?.id);
                                                    }}
                                                >
                                                    <i className="fa fa-pencil" aria-hidden="true"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            ) : (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="nodata position">
                                            <Image width={100} height={100} src={dataNotFound} alt="" />
                                        </div>
                                    </td>
                                </tr>
                            )
                            }
                        </tbody>
                    }
                </table>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                        <div id="pagination" className="mt-3">
                            <div className="pagination-list">
                                <nav aria-label="Page navigation example">
                                    <ReactPaginate
                                        breakLabel="..."
                                        breakClassName="page-item"
                                        breakLinkClassName="page-link"
                                        containerClassName="pagination justify-content-center"
                                        pageClassName="page-item"
                                        pageLinkClassName="page-link"
                                        previousClassName="page-item"
                                        previousLinkClassName="page-link"
                                        nextClassName="page-item"
                                        nextLinkClassName="page-link"
                                        marginPagesDisplayed={2}
                                        nextLabel={<>Next <i className="fa fa-angle-double-right" aria-hidden="true"></i></>}
                                        onPageChange={(e) => setPage(e.selected + 1)}
                                        pageRangeDisplayed={5}
                                        pageCount={pageCount}
                                        previousLabel={<><i className="fa fa-angle-double-left" aria-hidden="true"></i> Prev</>}
                                        renderOnZeroPageCount={null}
                                    />

                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}


            <div>
                <div
                    className={modelToggle ? "modal fade show " : "modal fade"}
                    style={{ display: modelToggle ? "block" : "" }}
                >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5
                                    className="modal-title font-sz-14-trans"
                                    id="exampleModalLongTitle"
                                >{addProductData.type === "add" ? "ADD PPRODUCT" : "UPDATE PRODUCT"}</h5>
                                <button
                                    type="button"
                                    className="closec"
                                    aria-label="span"
                                    onClick={(e) => {
                                        setAddProductData({
                                            name: "",
                                            batchNo: "",
                                            uid: "",
                                            price: 0,
                                            discountedPrice: 0,
                                            discount: 0,
                                            brand: "",
                                            countInStock: 0,
                                            description: "",
                                            avgRating: 0,
                                            numReviews: 0,
                                            image: null,
                                            video: null,
                                            categoryId: "",
                                            subCategoryId: "",
                                            type: "",
                                        });
                                        setModelToggle(false);
                                        setDeleteId([]);
                                        setUpdateImageIds([])
                                        setProductId("")
                                        setUpdateImages({})
                                    }}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body p-4">
                                <form method="post">
                                    <div className="row">

                                        <div className="form-group mb-2 col-md-12 col-lg-6">
                                            {
                                                addProductData.type === "add" ?
                                                    <>
                                                        <label
                                                            htmlFor="inputName"
                                                            className="font-sz-12 font-family mb-2"
                                                        >
                                                            select Cateory
                                                        </label>
                                                        <Select
                                                            id="dropdown"
                                                            placeholder={"select category"}
                                                            options={categoryOptions}
                                                            onChange={(e) => {
                                                                setSubCategorySelect(e.value)
                                                            }}
                                                        />
                                                    </> : <p className="text-light">{`category Id : ${addProductData.categoryId}`}</p>
                                            }
                                        </div>
                                        <div className="form-group mb-2 col-md-12 col-lg-6">
                                            {
                                                addProductData.type === "add" ?
                                                    <>
                                                        <label
                                                            htmlFor="inputName"
                                                            className="font-sz-12 font-family mb-2"
                                                        >
                                                            select SubCateory
                                                        </label>
                                                        <Select
                                                            id="dropdown"
                                                            placeholder={"select category"}
                                                            options={subCatOptions}
                                                            onChange={(e) => {
                                                                setAddProductData({
                                                                    ...addProductData,
                                                                    subCategoryId: e.value,
                                                                });
                                                            }}
                                                        />
                                                    </> : <p className="text-light">{`Sub category Id : ${addProductData.subCategoryId}`}</p>
                                            }
                                        </div>

                                        <div className="form-group mb-2 col-md-12 col-lg-6">
                                            <label
                                                htmlFor="inputName"
                                                className="font-sz-12 font-family mb-2"
                                            >
                                                Product name
                                            </label>
                                            <input
                                                value={addProductData?.name}
                                                type="text"
                                                className="form-control font-sz-14"
                                                id="inputName"
                                                placeholder="Name"
                                                name="name"
                                                onChange={(e) => {
                                                    setAddProductData({
                                                        ...addProductData,
                                                        name: e.target.value,
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div className="form-group mb-2 col-md-12 col-lg-6">
                                            <label
                                                htmlFor="inputName"
                                                className="font-sz-12 font-family mb-2"
                                            >
                                                BatchNo
                                            </label>
                                            <input
                                                value={addProductData?.batchNo}
                                                type="text"
                                                className="form-control font-sz-14"
                                                placeholder="Batch"
                                                name="name"
                                                onChange={(e) => {
                                                    setAddProductData({
                                                        ...addProductData,
                                                        batchNo: e.target.value,
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div className="form-group mb-2 col-md-12 col-lg-6">
                                            <label
                                                htmlFor="inputPhone"
                                                className="font-sz-12 font-family mb-2"
                                            >
                                                Uid
                                            </label>
                                            <input
                                                value={addProductData?.uid}
                                                type="text"
                                                className="form-control font-sz-14"
                                                id="inputPhone"
                                                onChange={(e) => {
                                                    setAddProductData({
                                                        ...addProductData,
                                                        uid: e.target.value,
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div className="form-group mb-2 col-md-12 col-lg-6">
                                            <label
                                                htmlFor="inputPhone"
                                                className="font-sz-12 font-family mb-2"
                                            >
                                                Price
                                            </label>
                                            <input
                                                value={addProductData?.price}
                                                type="number"
                                                min="0"
                                                className="form-control font-sz-14"
                                                id="inputPhone"
                                                onChange={(e) => {
                                                    parseInt(e.target.value, 10).toString()
                                                    setAddProductData({
                                                        ...addProductData,
                                                        price: Number(parseInt(e.target.value, 10).toString()),
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div className="form-group mb-2 col-md-12 col-lg-6">
                                            <label
                                                htmlFor="inputPhone"
                                                className="font-sz-12 font-family mb-2"
                                            >
                                                DiscountedPrice
                                            </label>
                                            <input
                                                value={addProductData?.discountedPrice}
                                                type="number"
                                                min="0"
                                                className="form-control font-sz-14"
                                                id="inputPhone"
                                                onChange={(e) => {
                                                    if (addProductData.price === 0) {
                                                        errorToast("Add price first")
                                                        return
                                                    }
                                                    if (Number(parseInt(e.target.value, 10).toString()) >= addProductData.price * 0.3) {
                                                        errorToast(`discount price should be less then ${addProductData.price * 0.3}`)
                                                        return;
                                                    }

                                                    setAddProductData({
                                                        ...addProductData,
                                                        discountedPrice: Number(parseInt(e.target.value, 10).toString()),
                                                        discount: Number(parseInt(e.target.value, 10).toString()) * 100 / addProductData.price
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div className="form-group mb-2 col-md-12 col-lg-6">
                                            <label
                                                htmlFor="inputPhone"
                                                className="font-sz-12 font-family mb-2"
                                            >
                                                Discount  maximum = {maxDiscount}
                                            </label>
                                            <input
                                                value={addProductData?.discount}
                                                type="number"
                                                min="0"
                                                className="form-control font-sz-14"
                                                id="inputPhone"
                                                onChange={(e) => {


                                                    if (Number(parseInt(e.target.value, 10).toString()) > maxDiscount) {
                                                        errorToast(`Discount should be less than ${maxDiscount}`);
                                                        return;
                                                    }
                                                    const disPrice = Number(parseInt(e.target.value, 10).toString()) * addProductData.price / 100

                                                    setAddProductData({
                                                        ...addProductData,
                                                        discount: Number(parseInt(e.target.value, 10).toString()),
                                                        discountedPrice: disPrice,
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div className="form-group mb-2 col-md-12 col-lg-6">
                                            <label
                                                htmlFor="inputPhone"
                                                className="font-sz-12 font-family mb-2"
                                            >
                                                Description
                                            </label>
                                            <input
                                                value={addProductData?.description}
                                                type="text"
                                                className="form-control font-sz-14"
                                                id="inputPhone"
                                                onChange={(e) => {
                                                    setAddProductData({
                                                        ...addProductData,
                                                        description: e.target.value,
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div className="form-group mb-2 col-md-12 col-lg-6">
                                            <label
                                                htmlFor="inputPhone"
                                                className="font-sz-12 font-family mb-2"
                                            >
                                                Brand
                                            </label>
                                            <input
                                                type="text"
                                                value={addProductData?.brand}

                                                className="form-control font-sz-14"
                                                id="inputPhone"
                                                onChange={(e) => {
                                                    setAddProductData({
                                                        ...addProductData,
                                                        brand: e.target.value,
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div className="form-group mb-2 col-md-12 col-lg-6">
                                            <label
                                                htmlFor="inputPhone"
                                                className="font-sz-12 font-family mb-2"
                                            >
                                                count In Stock
                                            </label>
                                            <input
                                                type="number"
                                                value={addProductData?.countInStock}
                                                min={0}

                                                className="form-control font-sz-14"
                                                id="inputPhone"
                                                onChange={(e) => {
                                                    setAddProductData({
                                                        ...addProductData,
                                                        countInStock: e.target.value,
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div className="form-group mb-2 col-md-12 col-lg-6">
                                            <label
                                                htmlFor="inputPhone"
                                                className="font-sz-12 font-family mb-2"
                                            >
                                                images
                                            </label>
                                            {
                                                addProductData.type === "update" ?
                                                    <>
                                                        {addProductData?.image.map((x, i) => (
                                                            <div key={i} className="image-container">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={updateImageIds.includes(x)}
                                                                    onChange={() => handleImageClick(x)}
                                                                />
                                                                <Image
                                                                    key={i}
                                                                    className="small-img"
                                                                    width={100}
                                                                    height={100}
                                                                    src={`/products/${x}`}
                                                                    alt=""
                                                                    onClick={e => {
                                                                        handleImageClick(x)
                                                                    }}
                                                                />
                                                            </div>
                                                        ))}

                                                        <input
                                                            type="file"
                                                            className="form-control font-sz-14"
                                                            id="inputPhone"
                                                            multiple
                                                            name="file"
                                                            onChange={(e) => {
                                                                setUpdateImages({
                                                                    ...updateImages,
                                                                    image: e.target.files,
                                                                });
                                                            }}
                                                        />
                                                    </>
                                                    :
                                                    <input
                                                        type="file"
                                                        className="form-control font-sz-14"
                                                        id="inputPhone"
                                                        multiple
                                                        name="file"
                                                        onChange={(e) => {
                                                            setAddProductData({
                                                                ...addProductData,
                                                                image: e.target.files,
                                                            });
                                                        }}
                                                    />
                                            }
                                        </div>

                                        <div className="form-group mb-2 col-md-12 col-lg-6">
                                            <label
                                                htmlFor="inputPhone"
                                                className="font-sz-12 font-family mb-2"
                                            >
                                                Video
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control font-sz-14"
                                                id="inputPhone"
                                                name="file"
                                                onChange={(e) => {
                                                    setAddProductData({
                                                        ...addProductData,
                                                        video: e.target.files[0],
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div className="form-group txt-center mt-3 col-md-12 col-lg-12">
                                            <button
                                                type="submit"
                                                className="yellow-btn font-sz-14 float-lg-end float-sm-start"
                                                // disabled={isLoading}
                                                onClick={(e) => {
                                                    addOrUpdateProduct(e)
                                                }
                                                }
                                            >
                                                {isLoading ? 'Loading..' : addProductData.type === "add" ? "Add" : 'Update'}
                                            </button>
                                        </div>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={deleteToggle ? "modal fade show " : "modal fade"}
                    style={{ display: deleteToggle ? "block" : "" }}
                >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5
                                    className="modal-title font-sz-14-trans"
                                    id="exampleModalLongTitle"
                                ></h5>
                                <button
                                    type="button"
                                    className="closec"
                                    aria-label="span"
                                    onClick={(e) => {
                                        setDeleteToggle(false);
                                        setAddProductData({});

                                    }}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body p-4">

                                <div className="row">
                                    <div className="form-group mb-2 col-md-12 col-lg-6">
                                        <label
                                            htmlFor="inputName"
                                            className="font-sz-12 font-family mb-2"
                                        >
                                            Are you sure you want to delete this category?
                                        </label>
                                    </div>

                                    <div className="form-group txt-center mt-3 col-md-12 col-lg-12">
                                        <button
                                            type="button"
                                            className="yellow-btn font-sz-14 float-lg-end float-sm-start"
                                            // disabled={isLoading}
                                            onClick={(e) => {
                                                deleteSubCategory(e)
                                            }
                                            }
                                        >
                                            {isLoading ? 'Loading...' : "Delete"}
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}