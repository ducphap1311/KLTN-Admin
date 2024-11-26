import { Sidebar } from "../components/sidebar/Sidebar";
import { Header } from "../components/header/AdminHeader";
import { AddForm } from "../components/forms/AddProductForm";

export const AddProductPage = () => {
    return (
        <div className="bg-[#f7f9fc] dark:bg-[#1b2635] min-h-screen pt-20">
            <Header />
            <Sidebar />
            <AddForm />
        </div>
    );
};
