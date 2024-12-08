import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AllProductsPage from "./pages/AllProductsPage.tsx";
import { AddProductPage } from "./pages/AddProductPage.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { LoginPage } from "./pages/LoginPage.tsx";
import { EditProductPage } from "./pages/EditProductPage.tsx";
import { SignUpPage } from "./pages/SignUpPage.tsx";
import { UserProductsPage } from "./pages/UserProductsPage.tsx";
import { SingleProductPage } from "./pages/SingleProductPage.tsx";
import { ProtectedRouteAdmin } from "./components/protectRoute/ProtectedRouteAdmin.tsx";
import { ProtectedRouteAccount } from "./components/protectRoute/ProtectedRouteAccount.tsx";
import 'react-toastify/dist/ReactToastify.css'
import { ErrorPage } from "./pages/ErrorPage.tsx";
import './i18n/i18n.ts'
import { UsersPage } from "./pages/CategoryPage.tsx";
import MessagesTable from "./pages/MessagesPage.tsx";
import OrderPage from "./pages/OrderPage.tsx";
import ProcessOrderPage from "./pages/ProcessOrderPage.tsx";
import ShipOrders from "./pages/ShipOrders.tsx";
import ShipOrderDetail from "./pages/ShipOrderDetail.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRouteAdmin>
                <AllProductsPage />
            </ProtectedRouteAdmin>
        ),
        errorElement: <ErrorPage />
    },
    {
        path: "/add-product",
        element: (
            <ProtectedRouteAdmin>
                <AddProductPage />,
            </ProtectedRouteAdmin>
        ),
    },
    {
        path: "/users",
        element: (
            <ProtectedRouteAdmin>
                <UsersPage />,
            </ProtectedRouteAdmin>
        ),
    },
    {
        path: "/messages",
        element: (
            <ProtectedRouteAdmin>
                <MessagesTable />,
            </ProtectedRouteAdmin>
        ),
    },
    {
        path: "/orders",
        element: (
            <ProtectedRouteAdmin>
                <OrderPage />,
            </ProtectedRouteAdmin>
        ),
    },
    {
        path: "/ship-orders",
        element: (
            <ProtectedRouteAdmin>
                <ShipOrders />,
            </ProtectedRouteAdmin>
        ),
    },
    {
        path: "/ship-orders/:id",
        element: (
            <ProtectedRouteAdmin>
                <ShipOrderDetail />,
            </ProtectedRouteAdmin>
        ),
    },
    {
        path: "/process-order",
        element: (
            <ProtectedRouteAdmin>
                <ProcessOrderPage />,
            </ProtectedRouteAdmin>
        ),
    },
    {
        path: "/login",
        element: (
            <ProtectedRouteAccount>
                <LoginPage />,
            </ProtectedRouteAccount>
        ),
    },
    {
        path: "/sign-up",
        element: (
            <ProtectedRouteAccount>
                <SignUpPage />,
            </ProtectedRouteAccount>
        ),
    },
    {
        path: "/edit-product/:id",
        element: 
        <ProtectedRouteAdmin>
            <EditProductPage />,
        </ProtectedRouteAdmin>
    }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    // <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    // </React.StrictMode>
);
