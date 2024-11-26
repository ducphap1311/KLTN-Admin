import React from "react";
import { Header } from "../components/header/AdminHeader";
import { SingleProduct } from "../components/singleproduct/SingleProduct";
import { UserHeader } from "../components/header/UserHeader";

export const SingleProductPage = () => {
    return (
        <div className="dark:bg-[#292a30] min-h-screen">
            <UserHeader />
            <SingleProduct />
        </div>
    );
};
