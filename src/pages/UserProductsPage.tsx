import { UserHeader } from "../components/header/UserHeader";
import { UserProductList } from "../components/lists/UserProductList";

export const UserProductsPage = () => {
    return <div className="dark:bg-[#292a30] min-h-screen">
        <UserHeader />
        <UserProductList />
    </div>
};
