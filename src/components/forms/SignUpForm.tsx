import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { createUser } from "../../api/createService";
import { useTranslation } from "react-i18next";

interface User {
    name?: string;
    address?: string;
    email: string;
    password: string;
};

const schema = yup
    .object({
        name: yup.string(),
        address: yup.string(),
        email: yup
            .string()
            .email("Email must be a valid email!")
            .required("Please input email field!"),
        password: yup
            .string()
            .required("Please input password field!")
            .matches(
                /^(?=.*[a-zA-Z])(?=.*\d)/,
                "Password must contain at least one letter and one number!"
            ).min(8, "Password must be at least 8 characters!"),
    })
    .required();

export const SignUpForm = () => {
    const [loadingButton, setLoadingButton] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<boolean>(false);
    const navigate = useNavigate();
    const {t} = useTranslation()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<User>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<User> = async ({email, password, name, address}: User) => {
        setLoadingButton(true)
        setLoginError(false)
        console.log({email, password, name, address});
        
        const response = await createUser({
            email,
            password,
            name,
            address,
        });
        console.log(response);
                
        if(response === undefined){
            setTimeout(() => {
                setLoginError(true)
                setLoadingButton(false)
            }, 1000)
        } else {
            setTimeout(() => {
                navigate('/login')
            }, 1000)
        }
    };

    return (
        <div className="bg-[#f7f9fc] dark:bg-[#1b2635] fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center">
            <form
                className="max-w-[500px] w-full bg-white p-5 sm:p-10 rounded-lg dark:bg-[#233044]"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h2 className="text-center text-[30px] font-semibold text-[#3949ab] dark:text-[#dfe3eb]">
                    {t('signup')}
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
                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-[#3949ab] dark:text-[#dfe3eb]">
                        {t('password')}
                    </label>
                    <input
                        {...register("password")}
                        type='password'
                        placeholder={t('password')}
                        className="border-[1px] border-gray-400 w-full hover:border-gray-900 transition-all outline-none py-2 px-4 rounded-lg focus:border-[#303f9f] dark:bg-[#1b2635] dark:text-white"
                    />
                    <p className="text-red-500 text-sm">
                        {errors.password && t(`${errors.password.message}`)}
                    </p>
                </div>
                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-[#3949ab] dark:text-[#dfe3eb]">
                        {t('name')}
                    </label>
                    <input
                        {...register("name")}
                        placeholder={t('name')}
                        className="border-[1px] border-gray-400 w-full hover:border-gray-900 transition-all outline-none py-2 px-4 rounded-lg focus:border-[#303f9f] dark:bg-[#1b2635] dark:text-white"
                    />
                </div>
                <div className="mb-7">
                    <label className="block mb-2 font-semibold text-[#3949ab] dark:text-[#dfe3eb]">
                        {t('address')}
                    </label>
                    <input
                        {...register("address")}
                        placeholder={t('address')}
                        className="border-[1px] border-gray-400 w-full hover:border-gray-900 transition-all outline-none py-2 px-4 rounded-lg focus:border-[#303f9f] dark:bg-[#1b2635] dark:text-white"
                    />
                </div>
                {loginError && (
                    <p className="text-red-500 text-center mb-4">
                        {t('email_already_in_use')}
                    </p>
                )}
                <Button
                    type="primary"
                    htmlType="submit"
                    className="block text-lg text-center w-full h-fit border-none bg-[#4253be] text-white rounded-lg hover:bg-[#2c3a93] cursor-pointer transition-all py-2 dark:bg-[#407ad6] dark:hover:bg-[#4253be]"
                    loading={loadingButton}
                >
                    {t('signup')}
                </Button>
                <div className="mt-3 text-center">
                    <p className="dark:text-white">
                        {t('already_have_an_account')}?{" "}
                        <span
                            className="text-[#4253be] hover:text-[#2c3a93] cursor-pointer dark:text-[#1677ff] dark:hover:text-[#4794ff]"
                            onClick={() => navigate("/login")}
                        >
                            {t('login')}
                        </span>
                    </p>
                </div>
            </form>
        </div>
    );
};
