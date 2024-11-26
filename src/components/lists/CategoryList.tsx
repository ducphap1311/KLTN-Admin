import { Button, Card, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export const CategoryList = ({ categories, handleDelete, fillCategoryForm }: any) => {
    const {t} = useTranslation('lists')
    
    if (categories) {
        return (
            <div className="flex flex-wrap gap-5 xl:ml-[305px] mt-5 xl:mr-[100px] xl:mx-0 w-fit mx-auto p-4">
                {categories.map(({ name, id }: any) => {
                    return (
                        <Card title={<p className="dark:text-white">{name}</p>} className="w-fit dark:bg-[#233044]" key={id}>
                            <p className="mb-3 dark:text-white">ID: {id}</p>
                            <div>
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    className="mr-2"
                                    onClick={() => fillCategoryForm(id)}
                                >
                                    {t('edit')}
                                </Button>
                                <Popconfirm
                                    title={t('delete_the_category')}
                                    description={t("are_you_sure_to_delete_this_category")}
                                    onConfirm={() => handleDelete(id)}
                                    okText={t("yes")}
                                    cancelText={t("no")}
                                >
                                    <Button
                                        danger
                                        type="primary"
                                        icon={<DeleteOutlined />}
                                    >
                                        {t('delete')}
                                    </Button>
                                </Popconfirm>
                            </div>
                        </Card>
                    );
                })}
            </div>
        );
    }
    return;
};
