import { Button, Popconfirm } from "antd";
import { debounce } from "lodash";
import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../api/getService";
import { deleteProduct } from "../../api/deleteService";
import { UploadImage } from "../modal/UploadImage";
import { searchProduct } from "../../api/searchService";
import { openModal } from "../../redux/modal/modalSlice";
import Linear from "../loading/Linear";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface Product {
    id: string;
    name: string;
    picture?: string;
    basePrice: number;
    discountPercentage: number;
    stock: number;
    description: string;
    categories: string[];
}

export const AdminProductList = () => {
    const dispatch = useAppDispatch();
    const { isModalOpen }: { isModalOpen: boolean } = useAppSelector(
        (store) => store.modal
    );
    const [products, setProducts] = useState<Product[]>([]);
    const [editedID, setEditedID] = useState<string>("");
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [index, setIndex] = useState<number>(2);
    const [offset, setOffset] = useState<number>(6);
    const navigate = useNavigate();
    const { t } = useTranslation("lists");

    const fetchAPI = async () => {
        const response = await getAllProducts(offset);
        setProducts(response);
    };
    console.log(hasMore);

    const fetchMoreData = () => {
        setTimeout(async () => {
            const response = await getAllProducts(offset, index);
            console.log(response);

            setProducts((preItems) => [...preItems, ...response]);
            response.length > 0 ? setHasMore(true) : setHasMore(false);
            setIndex((prevIndex) => prevIndex + 1);
        }, 1000);
    };

    const handleDelete = async (id: string) => {
        await deleteProduct(id);
        toast("Delete product successfully!", {
            type: "success",
            position: "top-center",
            draggable: true,
            theme: "light",
        });
        fetchAPI();
        setHasMore(true);
        setIndex(2);
    };

    const navigateEditPage = (id: string) => {
        navigate(`/edit-product/${id}`);
    };

    const handleSearchChange = debounce(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value) {
                const response = await searchProduct(e.target.value);
                if (!response) {
                    setProducts([]);
                } else {
                    setProducts(response);
                    setHasMore(false);
                }
            } else {
                fetchAPI();
                setHasMore(true);
                setIndex(2);
            }
        },
        1000
    );

    useEffect(() => {
        fetchAPI();
    }, [offset]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOffset(Number(e.target.value));
        setIndex(2);
        setHasMore(true);
    };

    return (
        <>
            <div className="px-3 mt-[50px]">
                <div className="bg-white dark:bg-[#233044] xl:ml-[305px] xl:mr-[20px] p-6 mx-auto rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-normal sm:justify-between mb-5 w-full">
                        <h2 className="text-2xl font-[Inter] font-medium sm:mb-0 mb-6 text-center sm:text-left dark:text-white">
                            {t("products")}
                        </h2>
                        <div className="flex sm:items-center flex-col sm:flex-row mb-4 sm:mb-0">
                            <div className="sm:w-[218px] relative sm:mr-4 bg-red-300 mb-5 sm:mb-0 border-[1px]">
                                <input
                                    type="text"
                                    className="w-full p-[10px] dark:bg-[#1b2635] dark:border-[#233044] dark:text-white pl-12 text-[13px] outline-none text-[#4f4f4f] font-[Inter] hover:bg-[#f2f2f2] focus:bg-[#f2f2f2] transition-all"
                                    placeholder={t("search")}
                                    onChange={handleSearchChange}
                                />
                                <SearchOutlined className="absolute left-3 bottom-2/4 translate-y-2/4 text-xl text-[#848484] dark:text-white" />
                            </div>
                            <select
                                onChange={(e) => handleSelectChange(e)}
                                className="border-[1px] py-2 cursor-pointer px-4 text-gray-500 block dark:bg-[#1b2635] dark:text-white"
                            >
                                <option value={6} className="text-gray-500">
                                    6 {t("products_per_page")}
                                </option>
                                <option value={8} className="text-gray-500">
                                    8 {t("products_per_page")}
                                </option>
                                <option value={12} className="text-gray-500">
                                    12 {t("products_per_page")}
                                </option>
                            </select>
                        </div>
                    </div>
                    {products.length === 0 ? (
                        <p className="dark:text-white">
                            {t("there_is_no_products")}
                        </p>
                    ) : (
                        <>
                            <InfiniteScroll
                                dataLength={products.length}
                                next={fetchMoreData}
                                hasMore={hasMore}
                                loader={<Linear />}
                                height={500}
                                className="overflow-auto"
                            >
                                <table className="w-[1103px] xl:w-full border-collapse relative">
                                    <thead>
                                        <tr>
                                            <th className="p-4 text-left text-[13px] dark:text-white font-[Inter] text-[#000000de] font-medium">
                                                {t("picture")}
                                            </th>
                                            <th className="p-4 text-left text-[13px] dark:text-white font-[Inter] text-[#000000de] font-medium">
                                                {t("name")}
                                            </th>
                                            <th className="p-4 text-left text-[13px] dark:text-white font-[Inter] text-[#000000de] font-medium">
                                                {t("base_price")}
                                            </th>
                                            <th className="text-right py-4 text-[13px] dark:text-white font-[Inter] text-[#000000de] font-medium">
                                                {t("id")}
                                            </th>
                                            <th className="p-4 text-right text-[13px] dark:text-white font-[Inter] text-[#000000de] font-medium">
                                                {t("stock")}
                                            </th>
                                            <th className="p-4 text-right text-[13px] dark:text-white font-[Inter] text-[#000000de] font-medium">
                                                {t("discount_percentage")}
                                            </th>
                                            <th className="text-right p-4 text-[13px] dark:text-white font-[Inter] text-[#000000de] font-medium">
                                                {t("actions")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(
                                            ({
                                                name,
                                                picture,
                                                basePrice,
                                                stock,
                                                id,
                                                discountPercentage,
                                            }) => {
                                                return (
                                                    <tr key={id}>
                                                        <td className="p-4 text-[13px] font-[Inter] relative">
                                                            <img
                                                                src={`${
                                                                    picture
                                                                        ? `http://${picture}`
                                                                        : "https://scontent.fdad3-4.fna.fbcdn.net/v/t1.15752-9/439357193_1778350845989925_3589250648155232739_n.png?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeERBbz2t_ASCszzqy3eRlkHs83NIlWVT0-zzc0iVZVPT_ZAByUwRB_RWCYBakrvop9G_hETSC7HP4T9hkePEgr0&_nc_ohc=9rr7UZEAPFIQ7kNvgGvMiDR&_nc_ht=scontent.fdad3-4.fna&oh=03_Q7cD1QGzM18Mz3WsWipYvQs_r9D43QyAkl3GoOvghRZLEVMjwA&oe=6651E5BB"
                                                                }`}
                                                                alt="product"
                                                                className="w-[100px] h-[100px] object-cover block m-auto -z-20 rounded-lg"
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    setEditedID(
                                                                        id
                                                                    );
                                                                    dispatch(
                                                                        openModal()
                                                                    );
                                                                }}
                                                                className="bg-black opacity-0 hover:opacity-100 transition-all w-[100px] h-[100px]  bg-opacity-50 text-white block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                                            >
                                                                {t("change")}
                                                            </button>
                                                        </td>
                                                        <td className="p-4 text-[13px] font-[Inter] dark:text-white">
                                                            {name}
                                                        </td>
                                                        <td className="p-4 text-[13px] font-[Inter] dark:text-white">
                                                            ${basePrice}
                                                        </td>
                                                        <td className="py-4 text-right text-[13px] font-[Inter] dark:text-white">
                                                            {id}
                                                        </td>
                                                        <td className="p-4 text-[13px] text-right font-[Inter] dark:text-white">
                                                            {stock}
                                                        </td>
                                                        <td className="p-4 text-[13px] text-right font-[Inter] dark:text-white">
                                                            {discountPercentage}
                                                        </td>
                                                        <td className="p-4 text-right text-[13px] font-[Inter] dark:text-white">
                                                            <Button
                                                                type="primary"
                                                                icon={
                                                                    <EditOutlined />
                                                                }
                                                                className="edit-btn px-3 text-white hover:text-white"
                                                                onClick={() =>
                                                                    navigateEditPage(
                                                                        id
                                                                    )
                                                                }
                                                            >
                                                                {t("edit")}
                                                            </Button>
                                                            <Popconfirm
                                                                title={t(
                                                                    "delete_the_product"
                                                                )}
                                                                description={t(
                                                                    "are_you_sure_to_delete_this_product"
                                                                )}
                                                                onConfirm={() =>
                                                                    handleDelete(
                                                                        id
                                                                    )
                                                                }
                                                                okText={t(
                                                                    "yes"
                                                                )}
                                                                cancelText={t(
                                                                    "no"
                                                                )}
                                                            >
                                                                <Button
                                                                    type="primary"
                                                                    icon={
                                                                        <DeleteOutlined />
                                                                    }
                                                                    danger
                                                                    className="delete-btn ml-1 px-3"
                                                                >
                                                                    {t(
                                                                        "delete"
                                                                    )}
                                                                </Button>
                                                            </Popconfirm>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </InfiniteScroll>
                            {isModalOpen && (
                                <UploadImage
                                    editedID={editedID}
                                    fetchAPI={fetchAPI}
                                    setHasMore={setHasMore}
                                    setIndex={setIndex}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
            <ToastContainer />
        </>
    );
};
