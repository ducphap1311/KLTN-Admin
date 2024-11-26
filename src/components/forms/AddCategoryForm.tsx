import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { createCategory } from "../../api/createService";
import { CategoryList } from "../lists/CategoryList";
import { getAllCategories, getCategory } from "../../api/getService";
import { deleteCategory } from "../../api/deleteService";
import { editCategory } from "../../api/editService";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";

type Input = {
    name: string;
};

interface Category {
    id: string,
    name: string
}

const schema = yup.object({
    name: yup.string().required("Please input name field!").max(50, "Name must be less than 50 charaters!"),
});

export const AddCategoryForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [isEdited, setIsEdited] = useState<boolean>(false);
    const [editedId, setEditedId] = useState<string>("")
    const {t} = useTranslation()

    useEffect(() => {
        fetchCategoriesAPI();
    }, []);

    const fetchCategoriesAPI = async () => {
        const response = await getAllCategories();
        setCategories(response);
    };
    
    const onSubmit: SubmitHandler<Input> = async (data: Input) => {
        if(!isEdited){
            await createCategory(
                {
                    name: data.name,
                }
            );
            fetchCategoriesAPI();
            toast("Add category successfully!", {
                type: "success",
                draggable: true,
                position: 'top-center',
                theme: 'light'
            })
        } else {
            await editCategory(editedId,
                {
                    name: data.name,
                }
            );            
            toast("Edit category successfully!", {
                type: "success",
                draggable: true,
                position: 'top-center',
                theme: 'light'
            })
            fetchCategoriesAPI();
            setValue("name", "")
            setIsEdited(false)
        }
    };

    const handleDelete = async (id: string) => {
        const response = await deleteCategory(id);
        if (response) {
            fetchCategoriesAPI();
            toast("Delete category successfully!", {
                type: "success",
                theme: 'light',
                position: 'top-center',
                draggable: true
            })
        }
    };

    const fillCategoryForm = async (id: string) => {
        const response = await getCategory(id);
        const { name } = response;
        setValue("name", name);
        setIsEdited(true);
        setEditedId(id)
    };

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-[50px] xl:ml-[305px] xl:mr-[100px] dark:bg-[#233044] bg-white p-6 rounded-lg mx-4 xl:mx-0"
            >
                <h2 className="text-2xl font-[Inter] font-medium mb-5 dark:text-white">
                    {t('category')}
                </h2>
                <div className="flex flex-col sm:flex-row">
                    <div className="sm:mr-4 flex-1">
                        <label className="block mb-3 dark:text-white">{t('name')}</label>
                        <input
                            {...register("name")}
                            className="border-[1px] border-gray-400 py-2 px-4 outline-none rounded-lg focus:border-[#303f9f] w-full dark:bg-[#1b2635] dark:text-white"
                        />
                        <p className="text-red-500 text-sm">
                            {errors.name && t(`${errors.name.message}`)}
                        </p>
                    </div>
                    {isEdited ? (
                        <button
                            type="submit"
                            className="px-20 bg-[#4253be] hover:bg-[#2c3a93] text-white rounded-lg sm:mt-9 h-fit py-2 mt-4 dark:bg-[#1677ff] dark:hover:bg-[#4794ff]"
                        >
                            {t('edit')}
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="px-20 bg-[#4253be] hover:bg-[#2c3a93] text-white rounded-lg sm:mt-9 h-fit py-2 mt-4 dark:bg-[#1677ff] dark:hover:bg-[#4794ff]"
                        >
                            {t('add')}
                        </button>
                    )}
                </div>
            </form>
            <CategoryList
                categories={categories}
                handleDelete={handleDelete}
                fillCategoryForm={fillCategoryForm}
            />
            <ToastContainer />
        </>
    );
};
