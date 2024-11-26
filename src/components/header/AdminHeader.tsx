import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Popover } from "antd";
import {
    AlignLeftOutlined,
    MoonOutlined,
    SunOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "../../redux/store";
import { openSidebar } from "../../redux/sidebar/sidebarSlice";
import { useTranslation } from "react-i18next";

export const Header = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation('header');
    const [isActive, setIsActive] = useState<"en" | "vi">(
        i18n.language === "en" ? "en" : "vi"
    );
    const [theme, setTheme] = useState(localStorage.getItem('theme') === 'dark'? 'dark' : '');
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        navigate("/login");
    };

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.removeItem('theme')
        }
    }, [theme]);
    return (
        <div className="flex items-center justify-between xl:justify-end bg-white dark:bg-[#1b2635] p-3 fixed w-full top-0 z-20">
            <AlignLeftOutlined
                className="cursor-pointer text-3xl opacity-50 hover:opacity-100 transition-all xl:hidden dark:text-white"
                onClick={() => dispatch(openSidebar())}
            />
            <div className="mr-[10px] flex items-center xl:mr-[100px]  transition-colors">
                {theme === "dark" ? (
                    <MoonOutlined
                        className="cursor-pointer text-xl text-gray-400 hover:text-white transition-colors"
                        onClick={() => setTheme("light")}
                    />
                ) : (
                    <SunOutlined
                        className="cursor-pointer text-xl text-gray-600 hover:text-black"
                        onClick={() => setTheme("dark")}
                    />
                )}

                <div className="w-14 flex items-center justify-between sm:ml-14 ml-5">
                    <span
                        className={`${
                            isActive === "en" ? "font-bold" : "opacity-70"
                        } cursor-pointer dark:text-white`}
                        onClick={() => {
                            setIsActive("en");
                            i18n.changeLanguage("en");
                        }}
                    >
                        EN
                    </span>
                    <span className="dark:text-white dark:opacity-50">|</span>
                    <span
                        className={`${
                            isActive === "vi" ? "font-bold" : "opacity-70"
                        } cursor-pointer dark:text-white`}
                        onClick={() => {
                            setIsActive("vi");
                            i18n.changeLanguage("vi");
                        }}
                    >
                        VI
                    </span>
                </div>
                <Popover
                    content={<a onClick={handleLogout}>{t("logout")}</a>}
                    trigger="click"
                    open={open}
                    onOpenChange={handleOpenChange}
                >
                    <p className="xl:ml-16 ml-7 text-base px-6 py-2 rounded-lg transition-all bg-[#303f9f] text-white cursor-pointer hover:bg-[#283593] dark:bg-[#1677ff] dark:hover:bg-[#4794ff]">
                        Admin
                    </p>
                </Popover>
            </div>
        </div>
    );
};
