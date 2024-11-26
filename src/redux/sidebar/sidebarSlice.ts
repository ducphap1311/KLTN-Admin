import { createSlice } from "@reduxjs/toolkit"

interface ModalState {
    isSidebarOpen: boolean
}

const initialState: ModalState = {
    isSidebarOpen: false
}

export const SidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        openSidebar: (state) => {
            state.isSidebarOpen = true
        },
        closeSidebar: (state) => {
            state.isSidebarOpen = false
        }
    }
})

export const {openSidebar, closeSidebar} = SidebarSlice.actions
export default SidebarSlice.reducer

