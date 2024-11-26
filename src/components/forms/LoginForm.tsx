import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { login } from "../../api/createService";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useState } from "react";
import { getUser } from "../../api/getService";
import { useTranslation } from "react-i18next";

interface User {
    email: string;
    password: string;
}

const schema = yup
    .object({
        email: yup
            .string()
            .email("Email must be a valid email!")
            .required("Please input email field!"),
        password: yup.string().required("Please input password field!"),
    })
    .required();

export const LoginForm = () => {
    const [loadingButton, setLoadingButton] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<boolean>(false);
    const {t} = useTranslation()
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<User>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<User> = async ({ email, password }: User) => {
        setLoadingButton(true);
        setLoginError(false);
        const response = await login({ email, password });
        if (!response) {
            setTimeout(() => {
                setLoginError(true);
                setLoadingButton(false);
            }, 1000);
        } else {
            const { accessToken, refreshToken } = response;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            checkUserOrAdmin();
        }
    };
    
    const checkUserOrAdmin = async () => {
        const response = await getUser();
        const {name} = response
        localStorage.setItem("username", name);
        if (response.role === "ADMIN") {
            setTimeout(() => {
                setLoadingButton(false);
                navigate("/");
            }, 1000);
        } else {
            setTimeout(() => {
                setLoadingButton(false);
                navigate("/user/products");
            }, 1000);
        }
    };

    return (
        <div className="bg-[#f7f9fc] dark:bg-[#1b2635] fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center">
            <form
                className="mx-3 max-w-[500px] w-full bg-white p-5 sm:p-10 rounded-lg dark:bg-[#233044]"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h2 className="text-center text-[30px] font-semibold text-[#3949ab] dark:text-[#dfe3eb]">
                    {t('login')}
                </h2>
                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-[#3949ab] dark:text-[#dfe3eb]">
                        Email
                    </label>
                    <input
                        {...register("email")}
                        placeholder="Email"
                        className="border-[1px] border-gray-400 w-full hover:border-gray-900 transition-all outline-none py-2 px-4 rounded-lg focus:border-[#303f9f] dark:bg-[#1b2635] dark:text-white"
                    />
                    <p className="text-red-500 text-sm">
                        {errors.email && t(`${errors.email.message}`)} 
                    </p>
                </div>
                <div className="mb-7">
                    <label className="block mb-2 font-semibold text-[#3949ab] dark:text-[#dfe3eb]">
                        {t('password')}
                    </label>
                    <input
                        type="password"
                        {...register("password")}
                        placeholder={t('password')}
                        className="border-[1px] border-gray-400 w-full hover:border-gray-900 transition-all outline-none py-2 px-4 rounded-lg focus:border-[#303f9f] dark:bg-[#1b2635] dark:text-white"
                    />
                    <p className="text-red-500 text-sm">
                        {errors.password && t(`${errors.password.message}`)}
                    </p>
                </div>
                {loginError && (
                    <p className="text-red-500 text-center mb-4">
                        {t('invalid_email_or_password')}
                    </p>
                )}
                <Button
                    type="primary"
                    htmlType="submit"
                    className="block text-lg dark:bg-[#1677ff] dark:hover:bg-[#4794ff] text-center w-full h-fit border-none bg-[#4253be] text-white rounded-lg hover:bg-[#2c3a93] cursor-pointer transition-all py-2"
                    loading={loadingButton}
                >
                    {t('login')}
                </Button>
                <div className="mt-3 text-center">
                    <p className="dark:text-white">
                        {t('do_not_have_an_account')}?{" "}
                        <span
                            className="text-[#4253be] hover:text-[#2c3a93] cursor-pointer dark:text-[#0084ff]"
                            onClick={() => navigate("/sign-up")}
                        >
                            {t('signup')}
                        </span>
                    </p>
                </div>
            </form>
        </div>
    );
};
