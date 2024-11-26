import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createProduct } from "../../api/createService";
import { getAllCategories } from "../../api/getService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

interface User {
    name: string;
    basePrice: number;
    discountPercentage: number;
    stock: number;
    category: string;
    description: string;
}

interface Category {
    id: string;
    name: string;
}

const schema = yup
    .object({
        name: yup.string().required("Please input name field!"),
        basePrice: yup
            .number()
            .transform((value, originalValue) => {
                return (originalValue === '' ? undefined : value)
            })
            .typeError("Base price must be a positive number!")
            .positive("Base price must be a positve number!")
            .required("Please input base price field!"),
        discountPercentage: yup
            .number()
            .transform((value, originalValue) => {
                return (originalValue === '' ? undefined : value)
            })
            .typeError("Discount percentage must be a positive number!")
            .positive("Discount percentage must be a positive number!")
            .required("Please input discount percentage field!"),
        stock: yup
            .number()
            .transform((value, originalValue) => {
                return (originalValue === '' ? undefined : value)
            })
            .required("Please input stock field!")
            .typeError("Stock must be a positive number!")
            .positive("Stock must be a positive number!"),
        category: yup.string().required("Please choose category field!"),
        description: yup.string().required("Please input description field!"),
    })
    .required();

export const AddForm = () => {
    const [categories, setCategories] = React.useState<Category[]>([]);
    const navigate = useNavigate();
    const [loadingButton, setLoadingButton] = useState<boolean>(false);
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const onSubmit: SubmitHandler<User> = async (data: User) => {
        setLoadingButton(true);
        await createProduct({
            name: data.name,
            basePrice: data.basePrice,
            discountPercentage: data.discountPercentage,
            stock: data.stock,
            categories: [data.category],
            description: data.description,
        });
        setTimeout(() => {
            toast("Add product successfully!", {
                type: "success",
                position: "top-center",
                draggable: true,
                theme: "light",
            });
            setLoadingButton(false);
            navigate("/");
        }, 1000);
    };

    const fetchCategoriesAPI = async () => {
        const response = await getAllCategories();
        setCategories(response);
    };

    useEffect(() => {
        fetchCategoriesAPI();
    }, []);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-[50px] xl:ml-[305px] xl:mr-[100px] dark:bg-[#233044] grid md:grid-cols-3 gap-x-10 gap-y-4 bg-white p-6 rounded-lg mx-4 sm:grid-cols-2 grid-cols-1"
        >
            <div>
                <label className="block mb-2 dark:text-white">{t("name")}</label>
                <input
                    {...register("name")}
                    className="border-[1px] border-gray-400 w-full py-2 px-4 outline-none rounded-lg focus:border-[#303f9f] dark:bg-[#1b2635] dark:text-white "
                />
                <p className="text-red-500 text-sm mt-1">
                    {errors.name && t(`${errors.name.message}`)}
                </p>
            </div>
            <div>
                <label className="block mb-2 dark:text-white">{t("base_price")}</label>
                <input
                    {...register("basePrice")}
                    className="border-[1px] border-gray-400 w-full py-2 px-4 outline-none rounded-lg focus:border-[#303f9f] dark:bg-[#1b2635] dark:text-white "
                />
                <p className="text-red-500 text-sm mt-1">
                    {errors.basePrice && t(`${errors.basePrice.message}`)}
                </p>
            </div>
            <div>
                <label className="block mb-2 dark:text-white">{t("discount_percentage")}</label>
                <input
                    {...register("discountPercentage")}
                    className="border-[1px] border-gray-400 w-full py-2 px-4 outline-none rounded-lg focus:border-[#303f9f] dark:bg-[#1b2635] dark:text-white "
                />
                <p className="text-red-500 text-sm mt-1">
                    {errors.discountPercentage &&
                        t(`${errors.discountPercentage.message}`)}
                </p>
            </div>

            <div>
                <label className="block mb-2 dark:text-white">{t("stock")}</label>
                <input
                    {...register("stock")}
                    className="border-[1px] border-gray-400 w-full py-2 px-4 outline-none rounded-lg focus:border-[#303f9f] dark:bg-[#1b2635] dark:text-white"
                />
                <p className="text-red-500 text-sm mt-1">
                    {errors.stock && t(`${errors.stock.message}`)}
                </p>
            </div>
            <div>
                <label className="block mb-2 dark:text-white">{t("category")}</label>
                <select
                    {...register("category")}
                    className="border-[1px] w-full border-gray-400 p-2 cursor-pointer outline-none rounded-lg focus:border-[#303f9f] dark:bg-[#1b2635] dark:text-white"
                >
                    <option value="">{t("select_category")}</option>
                    {categories.length > 0 &&
                        categories.map((cate) => {
                            return (
                                <option key={cate.id} value={cate.id}>
                                    {cate.name}
                                </option>
                            );
                        })}
                </select>
                <p className="text-red-500 text-sm mt-1">
                    {errors.category && t(`${errors.category.message}`)}
                </p>
            </div>
            <div>
                <label className="block mb-2 dark:text-white">{t("description")}</label>
                <input
                    {...register("description")}
                    className="border-[1px] w-full border-gray-400 py-2 px-4 outline-none rounded-lg focus:border-[#303f9f] dark:bg-[#1b2635] dark:text-white"
                />
                <p className="text-red-500 text-sm mt-1">
                    {errors.description && t(`${errors.description.message}`)}
                </p>
            </div>
            <button
                className="border-none hover:bg-[#2c3a93] dark:bg-[#1677ff] dark:hover:bg-[#4794ff] transition-all h-fit mt-8 py-2 rounded-lg bg-[#4253be] text-white"
                onClick={() => reset()}
                type="button"
            >
                {t("reset_field")}
            </button>
            <Button
                loading={loadingButton}
                htmlType="submit"
                className="text-base cursor-pointer border-none dark:bg-[#1677ff] dark:hover:bg-[#4794ff]  hover:bg-[#2c3a93] transition-all h-fit sm:mt-8 py-2 rounded-lg bg-[#4253be] text-white mb-6"
            >
                {t("add")}
            </Button>
        </form>
    );
};
