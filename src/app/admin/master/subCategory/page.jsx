"use client";
// import { dataNotFound } from "@/assets";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Breadcrumb from "@/components/admin/breadcrumb";

import ReactPaginate from "react-paginate";
import { dataNotFound } from "../../../../../public/assets";
import Loading from "@/components/admin/loading";
import axios from "axios";
import moment from "moment";
import { apiUrl } from "../../../../../env";
import { successToast, errorToast } from "../../../../components/toster/index";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../redux/slices/categorySlice";
import Select from "react-select";

export default function BuyHistory() {
  // const t = useTranslations();

  const [isLoading, setIsLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState({});
  const [modelToggle, setModelToggle] = useState(false);
  const [input, setInput] = useState({});
  const [image, setImage] = useState(null);
  const [addOrUpdate, serAddOrUpdate] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [selectFilter, setSelectFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [deleteId, setDeleteId] = useState([]);
  const [deleteToggle, setDeleteToggle] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const addOrUpdateSubCatagoery = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!input.name && addOrUpdate === "add") {
      errorToast("Please enter category name");
      setIsLoading(false);
      return;
    } else if (!categoryId && addOrUpdate === "add") {
      errorToast("Please select category");
      setIsLoading(false);
      return;
    } else if (!image && addOrUpdate === "add") {
      errorToast("Please select image");
      setIsLoading(false);
      return;
    }
    try {
      let formData = new FormData();
      formData.append("name", input.name);
      formData.append("image", image);
      formData.append("type", addOrUpdate);
      formData.append("subCategoryId", subcategoryId);
      formData.append("categoryId", categoryId);

      let response = await axios.post(`${apiUrl}/admin/subCategory`, formData);

      if (response.data.st === true) {
        getSubCategoryList();
        successToast(response.data.msg);
        setData(response.data.data);
        setIsLoading(false);
        setInput({});
        setImage(null);
        setCategoryId("");

        if (addOrUpdate === "update") {
          setModelToggle(false);
          setSubcategoryId("");
        }
      } else {
        errorToast(response.data.msg);
        setIsLoading(false);
      }
    } catch (error) {
      errorToast(error);
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (data) => {
    const indexToDelete = deleteId.indexOf(data);

    if (indexToDelete !== -1) {
      const newArrey = deleteId.filter((item, index) => item !== data);
      setDeleteId(newArrey);
    } else {
      setDeleteId([...deleteId, data]);
    }
  };

  const deleteSubCategory = () => {
    setIsLoading(true);

    try {
      axios
        .delete(`${apiUrl}/admin/subCategory`, {
          data: { subCategoryIds: deleteId },
        })
        .then((response) => {
          if (response.data.st === true) {
            getSubCategoryList();
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

  const getSubCategoryList = useCallback(async () => {
    setLoader(true);
    try {
      let response = await axios.get(
        `${apiUrl}/admin/subCategory?page=${page}&limit=${perPage}`
      );

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
      let response = await axios.get(
        `${apiUrl}/admin/subCategory?page=${page}&limit=${perPage}&id=${selectFilter}`
      );

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
  };

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    getSubCategoryList();
  }, [perPage, page, getSubCategoryList]);

  useEffect(() => {
    getfilterCategory();
  }, [selectFilter]);

  return (
    <div className="row">
      <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
        {/* <Breadcrumb /> */}
        <div className="filter-section position">
          <div className="filter-title font-sz-14 font-family">
            SUB Category
          </div>
          <button type="button" className="filter-btn">
            Add
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="left-margin-10"
              onClick={(e) => {
                serAddOrUpdate("add");
                setModelToggle(true);
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
          <button type="button" className="filter-btn">
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
                  setDeleteToggle(true);
                } else {
                  errorToast("categorys not selected");
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
          <div className="filter-btn">
            <Select
              className="left-margin-10"
              id="dropdown"
              placeholder={"filter category"}
              options={categoryOptions}
              onChange={(e) => {
                setSelectFilter(e.value);
              }}
            />
          </div>
        </div>
        <div className="table-section position mb-4">
          <table className="table w-100 mb-0">
            <thead>
              <tr>
                <th scope="col">NO</th>
                <th scope="col">Name</th>
                <th scope="col">Id</th>
                <th scope="col">image</th>
                <th scope="col">createdAt</th>
                <th scope="col">updatedAt</th>
                <th scope="col">Delete</th>
                <th scope="col">Update</th>
              </tr>
            </thead>
            <tbody>
              {loader ? (
                <tr>
                  <td colSpan={6}>
                    <Loading />{" "}
                  </td>
                </tr>
              ) : data.length > 0 ? (
                <>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>{(currentPage - 1) * perPage + (index + 1)}</td>
                      <td>{item?.name}</td>
                      <td>{item?.id}</td>
                      <td>
                        <Image
                          className="small-img"
                          width={100}
                          height={100}
                          src={`/subCategory/${item?.image}`}
                          alt=""
                        />
                      </td>
                      <td>{moment(item?.createdAt).format("DD-MM-YYYY")}</td>
                      <td> {moment(item?.updatedAt).format("DD-MM-YYYY")}</td>
                      <td>
                        <div>
                          <input
                            className="btn btn-danger"
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange(item?.id)}
                          />
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="edit-btn"
                          aria-label="i"
                          onClick={(e) => {
                            setSubcategoryId(item?.id);
                            serAddOrUpdate("update");
                            setInput({
                              ...input,
                              name: item?.name,
                            });
                            setModelToggle(true);
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
                      <Image
                        width={100}
                        height={100}
                        src={dataNotFound}
                        alt=""
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
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
                      nextLabel={
                        <>
                          Next{" "}
                          <i
                            className="fa fa-angle-double-right"
                            aria-hidden="true"
                          ></i>
                        </>
                      }
                      onPageChange={(e) => setPage(e.selected + 1)}
                      pageRangeDisplayed={5}
                      pageCount={pageCount}
                      previousLabel={
                        <>
                          <i
                            className="fa fa-angle-double-left"
                            aria-hidden="true"
                          ></i>{" "}
                          Prev
                        </>
                      }
                      renderOnZeroPageCount={null}
                    />
                    <select
                      value={perPage}
                      onChange={(e) => setPerPage(Number(e.target.value))}
                    >
                      <option value={5}>5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                    </select>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                ></h5>
                <button
                  type="button"
                  className="closec"
                  aria-label="span"
                  onClick={(e) => {
                    setInput({});
                    setImage(null);
                    setModelToggle(false);
                    setCategoryId("");
                    setSubcategoryId("");
                    setDeleteId([]);
                  }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body p-4">
                <form method="post">
                  <div className="row">
                    <div className="form-group mb-2 col-md-12 col-lg-6">
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
                          setCategoryId(e.value);
                        }}
                      />
                    </div>

                    <div className="form-group mb-2 col-md-12 col-lg-6">
                      <label
                        htmlFor="inputName"
                        className="font-sz-12 font-family mb-2"
                      >
                        category name
                      </label>
                      <input
                        value={input?.name ? input?.name : ""}
                        type="text"
                        className="form-control font-sz-14"
                        id="inputName"
                        placeholder="Name"
                        name="name"
                        onChange={(e) => {
                          setInput({
                            ...input,
                            [e.target.name]: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="form-group mb-2 col-md-12 col-lg-6">
                      <label
                        htmlFor="inputPhone"
                        className="font-sz-12 font-family mb-2"
                      >
                        image
                      </label>
                      <input
                        type="file"
                        className="form-control font-sz-14"
                        id="inputPhone"
                        name="file"
                        onChange={(e) => {
                          setImage(e.target.files[0]);
                        }}
                      />
                    </div>

                    <div className="form-group txt-center mt-3 col-md-12 col-lg-12">
                      <button
                        type="submit"
                        className="yellow-btn font-sz-14 float-lg-end float-sm-start"
                        disabled={isLoading}
                        onClick={(e) => {
                          addOrUpdateSubCatagoery(e);
                        }}
                      >
                        {isLoading
                          ? "Loading.."
                          : addOrUpdate === "add"
                            ? "Add"
                            : "Update"}
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
                      disabled={isLoading}
                      onClick={(e) => {
                        deleteSubCategory(e);
                      }}
                    >
                      {isLoading ? "Loading..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
