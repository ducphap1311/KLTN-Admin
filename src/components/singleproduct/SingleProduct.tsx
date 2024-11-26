import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Circular } from "../loading/Circular";
import { getSingleProduct } from "../../api/getService";

interface Product {
    name: string;
    picture?: string;
    basePrice: number;
    stock: number;
    description: string;
}

export const SingleProduct = () => {
    const { urlName } = useParams();
    const [product, setProduct] = useState<Product>();

    const getProduct = async () => {
        if (urlName) {
            const response = await getSingleProduct(urlName);
            setProduct(response);
        }
    };
    useEffect(() => {
        setTimeout(() => {
            getProduct();
        }, 1000);
    }, []);
    if (!product) {
        return <Circular />;
    } else {
        const { picture, name, basePrice, description, stock } = product;
        return (
            <div className="w-fit lg:max-w-[1088px] mx-auto flex flex-col lg:flex-row py-14 px-5 pt-[120px]">
                <div className="mr-16 md:w-[512px] h-[384px] w-full">
                    <img
                        src={`${
                            picture
                                ? `http://${picture}`
                                : "https://scontent.fdad3-4.fna.fbcdn.net/v/t1.15752-9/439357193_1778350845989925_3589250648155232739_n.png?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeERBbz2t_ASCszzqy3eRlkHs83NIlWVT0-zzc0iVZVPT_ZAByUwRB_RWCYBakrvop9G_hETSC7HP4T9hkePEgr0&_nc_ohc=9rr7UZEAPFIQ7kNvgGvMiDR&_nc_ht=scontent.fdad3-4.fna&oh=03_Q7cD1QGzM18Mz3WsWipYvQs_r9D43QyAkl3GoOvghRZLEVMjwA&oe=6651E5BB"
                        }`}
                        alt={name}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
                <div className="max-w-[512px]">
                    <h3 className="capitalize font-bold text-2xl sm:text-3xl mb-2 text-[#394e6a] dark:text-white">
                        {name}
                    </h3>
                    <p className="p-2 bg-[#f1f5f9] rounded-md mb-2 inline-block text-xl text-[#394e6a]">
                        ${basePrice}
                    </p>
                    <p className="mb-6 text-[#394e6a] dark:text-white">
                        Available: {stock} products
                    </p>
                    <p className="leading-9 text-[#394e6a] dark:text-white">{description}</p>
                </div>
            </div>
        );
    }
};
