import { configureStore } from "@reduxjs/toolkit";
import {ModalSlice} from "./modal/modalSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { SidebarSlice } from "./sidebar/sidebarSlice";

export const store = configureStore({
    reducer: {
        modal: ModalSlice.reducer,
        sidebar: SidebarSlice.reducer
    }
})

export const useAppDispatch:() => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>>=useSelector