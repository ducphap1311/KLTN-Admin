import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getProduct } from "../../api/getService";
import { editProduct } from "../../api/editService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

type Inputs = {
    name: string;
    basePrice: number;
    discountPercentage: number;
    stock: number;
    description: string;
};

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
            .typeError("Stock must be a positive number!")
            .positive("Stock must be a positive number!")
            .required("Please input stock field!"),
        description: yup.string().required("Please input description field!"),
    })
    .required();

export const EditForm = () => {
    const { id } = useParams();
    const [loadingButton, setLoadingButton] = useState<boolean>(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        setLoadingButton(true);
        if (id) {
            const response = await editProduct(id, {
                name: data.name,
                basePrice: data.basePrice,
                discountPercentage: data.discountPercentage,
                stock: data.stock,
                description: data.description,
            });
            if (response) {
                setTimeout(() => {
                    setLoadingButton(false);
                    toast("Edit product successfully!", {
                        type: "success",
                        draggable: true,
                        theme: "light",
                        position: "top-center",
                    });
                    navigate("/");
                }, 1000);
            }
        }
    };

    const fillEditForm = async () => {
        if (id) {
            const response = await getProduct(id);
            const { name, basePrice, stock, discountPercentage, description } =
                response;
            setValue("name", name);
            setValue("basePrice", basePrice);
            setValue("stock", stock);
            setValue("discountPercentage", discountPercentage);
            setValue("description", description);
        }
    };

    useEffect(() => {
        fillEditForm();
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
                    className="border-[1px] border-gray-400 w-full py-2 px-4 outline-none rounded-lg focus:border-[#303f9f] dark:bg-[#1b2635] dark:text-white"
                />
                <p className="text-red-500 text-sm mt-1">
                    {errors.name && t(`${errors.name.message}`)}
                </p>
            </div>
            <div>
                <label className="block mb-2 dark:text-white">{t("base_price")}</label>
                <input
                    {...register("basePrice")}
                    className="border-[1px] border-gray-400 w-full py-2 px-4 outline-none rounded-lg focus:border-[#303f9f] dark:bg-[#1b2635] dark:text-white"
                />
                <p className="text-red-500 text-sm mt-1">
                    {errors.basePrice && t(`${errors.basePrice.message}`)}
                </p>
            </div>
            <div>
                <label className="block mb-2 dark:text-white">{t("discount_percentage")}</label>
                <input
                    {...register("discountPercentage")}
                    className="border-[1px] border-gray-400 w-full py-2 px-4 outline-none rounded-lg focus:border-[#303f9f] dark:bg-[#1b2635] dark:text-white"
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
                <label className="block mb-2 dark:text-white">{t("description")}</label>
                <input
                    {...register("description")}
                    className="border-[1px] w-full border-gray-400 py-2 px-4 outline-none rounded-lg focus:border-[#303f9f] dark:bg-[#1b2635] dark:text-white"
                />
                <p className="text-red-500 text-sm mt-1">
                    {errors.description && t(`${errors.description.message}`)}
                </p>
            </div>
            <Button
                loading={loadingButton}
                className="border-none text-base hover:bg-[#2c3a93] transition-all h-fit mt-8 py-2 rounded-lg bg-[#4253be] text-white dark:bg-[#1677ff] dark:hover:bg-[#4794ff]"
                htmlType="submit"
            >
                {t("edit")}
            </Button>
            <button
                className="border-none hover:bg-[#2c3a93] sm:mt-8 transition-all h-fit py-2 rounded-lg bg-[#4253be] text-white dark:bg-[#1677ff] dark:hover:bg-[#4794ff]"
                onClick={() => reset()}
                type="button"
            >
                {t("reset_field")}
            </button>
        </form>
    );
};
