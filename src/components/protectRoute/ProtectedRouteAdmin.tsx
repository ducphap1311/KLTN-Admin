import { useEffect, useState } from "react";
import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUser } from "../../api/getService";
import { Circular } from "../loading/Circular";

type ProtectedRouteProps = PropsWithChildren;
export const ProtectedRouteAdmin = ({ children }: ProtectedRouteProps) => {
    const token = localStorage.getItem("accessToken");
    const [isAdmin, setIsAdmin] = useState<boolean | undefined>();
    const location = useLocation();
    
    const checkIsAdmin = async () => {
        const response = await getUser();
        console.log(response);
        
        if (response.email === "hophap1311@gmail.com") {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        if(!token){
            setIsAdmin(false)
            return;
        }
        setTimeout(() => {
            checkIsAdmin();
        }, 1000);
    }, [location]);

    if (isAdmin === undefined) {
        return <Circular />;
    } else if (isAdmin === false) {
        return <Navigate to="/login" replace={true} />;
    } else return children;
};
