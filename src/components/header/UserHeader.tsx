import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Popover } from "antd";
import logo from "../../assets/header/logo.png";
import { useTranslation } from "react-i18next";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

export const UserHeader = () => {
    const navigate = useNavigate();
    const userName: string | null = localStorage.getItem("username");
    const [open, setOpen] = useState<boolean>(false);
    const { t, i18n } = useTranslation("header");
    const [isActive, setIsActive] = useState<"en" | "vi">(
        i18n.language === "en" ? "en" : "vi"
    );
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") === "dark" ? "dark" : ""
    );
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        navigate("/login");
    };

    const handleSignup = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        navigate("/sign-up");
    };

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.removeItem("theme");
        }
    }, [theme]);

    return (
        <>
            <div className="bg-[#f0f6ff] dark:bg-[#181920] px-5 lg:px-28 py-3 fixed top-0 w-full z-30">
                <div className="flex items-center justify-between max-w-[1088px] mx-auto">
                    <div className="w-[218px] relative">
                        <Link to="/user/products">
                            <img src={logo} alt="logo" className="w-[50px]" />
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <div className="w-14 flex items-center justify-between sm:ml-14 ml-5">
                            {theme === "dark" ? (
                                <MoonOutlined
                                    className="cursor-pointer text-xl text-gray-400 hover:text-white transition-colors mr-5"
                                    onClick={() => setTheme("light")}
                                />
                            ) : (
                                <SunOutlined
                                    className="cursor-pointer text-xl text-gray-600 hover:text-black mr-5"
                                    onClick={() => setTheme("dark")}
                                />
                            )}
                            <div>
                                <span
                                    className={`${
                                        isActive === "en"
                                            ? "font-bold"
                                            : "opacity-70"
                                    } cursor-pointer dark:text-white`}
                                    onClick={() => {
                                        setIsActive("en");
                                        i18n.changeLanguage("en");
                                    }}
                                >
                                    EN
                                </span>
                                <span className="dark:text-white dark:opacity-50 mx-2">
                                    |
                                </span>
                                <span
                                    className={`${
                                        isActive === "vi"
                                            ? "font-bold"
                                            : "opacity-70"
                                    } cursor-pointer dark:text-white`}
                                    onClick={() => {
                                        setIsActive("vi");
                                        i18n.changeLanguage("vi");
                                    }}
                                >
                                    VI
                                </span>
                            </div>
                        </div>
                        {userName ? (
                            <Popover
                                content={
                                    <div>
                                        <a onClick={handleLogout}>
                                            {t("logout")}
                                        </a>
                                    </div>
                                }
                                trigger="click"
                                open={open}
                                onOpenChange={handleOpenChange}
                            >
                                <p className="ml-16 text-base px-6 py-2 rounded-lg transition-all bg-[#303f9f] text-white cursor-pointer hover:bg-[#283593] dark:bg-[#1677ff] dark:hover:bg-[#4794ff]">
                                    {userName}
                                </p>
                            </Popover>
                        ) : userName === "" ? (
                            <Popover
                                content={
                                    <div>
                                        <a onClick={handleLogout}>
                                            {t("logout")}
                                        </a>
                                    </div>
                                }
                                trigger="click"
                                open={open}
                                onOpenChange={handleOpenChange}
                            >
                                <p className="ml-16 text-base px-6 py-2 rounded-lg transition-all bg-[#303f9f] text-white cursor-pointer hover:bg-[#283593]">
                                    User
                                </p>
                            </Popover>
                        ) : (
                            <div className="ml-10">
                                <a
                                    onClick={handleSignup}
                                    className="mr-5 cursor-pointer hover:text-[#4c59a9]"
                                >
                                    {t("register")}
                                </a>
                                <a
                                    onClick={handleLogout}
                                    className="cursor-pointer hover:text-[#4c59a9]"
                                >
                                    {t("login")}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
