import { useState } from "react";
import { closeModal } from "../../redux/modal/modalSlice";
import { useAppDispatch } from "../../redux/store";
import { uploadImage } from "../../api/editService";
import { toast } from "react-toastify";
import { CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export const UploadImage = ({
    editedID,
    fetchAPI,
    setHasMore,
    setIndex,
}: any) => {
    const dispatch = useAppDispatch();
    const [image, setImage] = useState(null);
    const {t} = useTranslation('modal')
    
    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        if (file.size > 2 * 1024 * 1024) { // > 2mb
            alert("Kích thước ảnh vượt quá 2MB.");
            return;
        } else {
            setImage(file);
        }
    };

    const handleUpload = async () => {
        if (!image) return;
        const formData = new FormData();
        formData.append("file", image);
        const response = await uploadImage(editedID, formData);
        if (!response) {
            toast("Unsupported file type", {
                type: "error",
                position: "top-center",
                draggable: true
            });
            dispatch(closeModal());
            return;
        }
        dispatch(closeModal());
        fetchAPI();
        setHasMore(true);
        setIndex(2);
    };

    return (
        <div className="fixed top-0 left-0 bottom-0 right-0 bg-black bg-opacity-70 z-30 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg z-30 opacity-100 max-w-[450px] w-full">
                <div className="flex items-center justify-between  mb-10">
                    <h3 className="text-center text-red-600 text-xl font-semibold">
                        {t('upload_from_your_browser')}
                    </h3>
                    <CloseOutlined
                        className="text-red-500 text-lg font-semibold cursor-pointer hover:text-red-700"
                        onClick={() => dispatch(closeModal())}
                    />
                </div>
                <div className="flex items-center">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-fit cursor-pointer text-[#303f9f]"
                    />
                    <button
                        className="w-40 text-center py-2 bg-gray-500 text-white text-lg rounded-lg font-semibold hover:bg-gray-400 transition-all"
                        onClick={handleUpload}
                    >
                        {t('save')}
                    </button>
                </div>
            </div>
        </div>
    );
};
