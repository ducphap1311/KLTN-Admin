import React, { useEffect, useState, useTransition } from "react";
import { getAllProducts } from "../../api/getService";
import { SearchOutlined } from "@ant-design/icons";
import { Circular } from "../loading/Circular";
import InfiniteScroll from "react-infinite-scroll-component";
import Linear from "../loading/Linear";
import { debounce } from "lodash";
import { searchProduct } from "../../api/searchService";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const UserProductList = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [offset, setOffset] = useState<number>(6);
    const [index, setIndex] = useState<number>(2)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const {t} = useTranslation('lists')
    const fetchAPI = async () => {
        const response = await getAllProducts(offset);
        setProducts(response);
    };

    useEffect(() => {
        setTimeout(() => {
            fetchAPI();
        }, 1000);
    }, [offset]);

    const fetchMoreData = () => {
        setTimeout(async () => {
            const response = await getAllProducts(offset, index)            
            setProducts(preItems => [...preItems, ...response])
            response.length > 0 ?  setHasMore(true): setHasMore(false)
            setIndex((prevIndex) => prevIndex + 1);
        }, 1000);
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
    
    // if (products.length <= 0) return <Circular />;
    // else
        return (
            <div className="pb-24 pt-[90px]">
                <div className="flex flex-col md:flex-row items-center max-w-[1088px] mx-auto my-10 justify-between p-6 bg-[#f0f6ff] dark:bg-[#181920] dark:border-none rounded-lg border-[0.8px] border-[#e2e8f0]">
                    <div className="w-full md:w-[218px] relative md:mr-4 mb-3 md:mb-0">
                        <input
                            type="text"
                            className="w-full p-[10px] pl-12 text-[13px] outline-none text-[#424242] font-[Inter] hover:bg-[#f2f2f2] focus:bg-[#f7f9fc] dark:bg-[#272935] dark:border-[1px] rounded-lg dark:text-white transition-all border-[0.8px] border-[#e2e8f0] "
                            placeholder={t("search")}
                            onChange={handleSearchChange}
                        />
                        <SearchOutlined className="absolute left-3 bottom-2/4 translate-y-2/4 text-xl text-[#848484]" />
                    </div>
                    <select
                        onChange={(e) => {
                            setOffset(Number(e.target.value));
                            setIndex(2)
                            setHasMore(true)
                        }}
                        className="border-[1px] py-2 w-full md:w-auto cursor-pointer px-4 text-gray-500 dark:bg-[#272935] dark:text-white dark:border-[1px] rounded-lg"
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
                <InfiniteScroll
                    dataLength={products.length}
                    hasMore={hasMore}
                    loader={<Linear />}
                    next={fetchMoreData}
                    className="max-w-[1088px] mx-auto px-3 sm:px-0"
                >
                    {products.length > 0 ? <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-8 gap-4 w-fit mx-auto pb-10">
                        {products.map(
                            ({ name, basePrice, picture, id, urlName }: any) => {
                                return (
                                    <Link to={`/user/products/${urlName}`}
                                        className="w-[270px] h-[250px] sm:w-[330px] sm:h-[300px] p-4 border-[0.8px] border-[#e5e7eb] bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 dark:bg-[#292a30] dark:border-none"
                                        key={id}
                                    >
                                        <img
                                            src={`${picture ? `http://${picture}`: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t1.15752-9/439357193_1778350845989925_3589250648155232739_n.png?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeERBbz2t_ASCszzqy3eRlkHs83NIlWVT0-zzc0iVZVPT_ZAByUwRB_RWCYBakrvop9G_hETSC7HP4T9hkePEgr0&_nc_ohc=9rr7UZEAPFIQ7kNvgGvMiDR&_nc_ht=scontent.fdad3-4.fna&oh=03_Q7cD1QGzM18Mz3WsWipYvQs_r9D43QyAkl3GoOvghRZLEVMjwA&oe=6651E5BB'}`}
                                            alt={name}
                                            className="w-full h-[150px] sm:h-[192px] object-cover mb-4 rounded-2xl"
                                        />
                                        <p className="text-xl font-semibold text-center mb-2 dark:text-white">
                                            {name}
                                        </p>
                                        <p className="text-[#2563eb] text-center dark:text-[#bf95f9]">
                                            ${basePrice}
                                        </p>
                                    </Link>
                                );
                            }
                        )}
                    </div>: <p className="text-lg dark:text-white">There is no product</p>}
                    
                </InfiniteScroll>
            </div>
        );
};
