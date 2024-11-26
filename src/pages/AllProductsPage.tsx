import { Sidebar } from "../components/sidebar/Sidebar";
import { AdminProductList } from "../components/lists/AdminProductList";
import { Header } from "../components/header/AdminHeader";

function AllProductsPage() {
    return (
        <div className="bg-[#f7f9fc] dark:bg-[#1b2635] min-h-screen pt-16">
            <Header />
            <Sidebar />
            <AdminProductList />
        </div>
    );
}

export default AllProductsPage;
