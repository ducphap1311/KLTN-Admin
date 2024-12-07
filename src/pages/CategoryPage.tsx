import { Header } from '../components/header/AdminHeader'
import { Sidebar } from '../components/sidebar/Sidebar'
import { AddCategoryForm } from '../components/forms/AddCategoryForm'
import UsersTable from '../components/userstable/UsersTable'

export const UsersPage = () => {
  return (
    <div className='bg-[#f7f9fc] dark:bg-[#1b2635]  min-h-screen pt-20'>
      <Header />
      <Sidebar />
      {/* <AddCategoryForm /> */}
      <UsersTable />
    </div>
  )
}
