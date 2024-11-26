import {
    CloseOutlined,
    FormOutlined,
    HeatMapOutlined,
    ProductOutlined,
    ScheduleOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { closeSidebar } from "../../redux/sidebar/sidebarSlice";
import { useTranslation } from "react-i18next";

export const Sidebar = () => {
    const {t} = useTranslation('sidebar')
    const { isSidebarOpen }: { isSidebarOpen: boolean } = useAppSelector(
        (store) => store.sidebar
    );
    const dispatch = useAppDispatch();

    return (
        <ul
            className={`fixed xl:translate-x-0 -translate-x-full top-0 left-0 bottom-0 z-20 bg-[#303f9f] dark:bg-[#233044] text-white w-[257px] font-[Inter] transition-all ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <li className="flex items-center justify-around text-[17px] text-center border-b-[1px] border-white mb-8 py-5 bg-[#283593] dark:bg-[#233044]">
                <div>
                    <HeatMapOutlined className="text-lg mr-3" />
                    <span>Admin</span>
                </div>
                <CloseOutlined
                    className="text-white text-xl font-bold block xl:hidden cursor-pointer opacity-80 hover:opacity-100 transition-all"
                    onClick={() => dispatch(closeSidebar())}
                />
            </li>
            <li>
                <NavLink
                    onClick={() => dispatch(closeSidebar())}
                    to="/"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-[#2c3a93] dark:bg-[#1e293a] py-3 px-8 text-[13px] flex items-center hover:bg-[#2c3a93] dark:hover:bg-[#202b3c] cursor-pointer transition-all"
                            : "py-3 px-8 text-[13px] flex items-center hover:bg-[#2c3a93] dark:hover:bg-[#202b3c] cursor-pointer transition-all"
                    }
                >
                    <ProductOutlined className="text-lg mr-3" /> {t('all_products')}
                </NavLink>
            </li>
            <li>
                <NavLink
                    onClick={() => dispatch(closeSidebar())}
                    to="/add-product"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-[#2c3a93] py-3 dark:bg-[#1e293a] px-8 text-[13px] flex items-center hover:bg-[#2c3a93] dark:hover:bg-[#202b3c] cursor-pointer transition-all"
                            : "py-3 px-8 text-[13px] flex items-center hover:bg-[#2c3a93] dark:hover:bg-[#202b3c] cursor-pointer transition-all"
                    }
                >
                    <FormOutlined className="text-lg mr-3" />
                    {t('add_product')}
                </NavLink>
            </li>
            <li>
                <NavLink
                    onClick={() => dispatch(closeSidebar())}
                    to="/category"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-[#2c3a93] py-3 px-8 dark:bg-[#1e293a] text-[13px] flex items-center dark:hover:bg-[#202b3c] cursor-pointer transition-all"
                            : "py-3 px-8 text-[13px] flex items-center hover:bg-[#2c3a93] dark:hover:bg-[#202b3c] cursor-pointer transition-all"
                    }
                >
                    <ScheduleOutlined className="text-lg mr-3" />
                    {t('category')}
                </NavLink>
            </li>
        </ul>
    );
};
