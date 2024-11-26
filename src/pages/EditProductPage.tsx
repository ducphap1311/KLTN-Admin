import { Header } from '../components/header/AdminHeader'
import { Sidebar } from '../components/sidebar/Sidebar'
import { EditForm } from '../components/forms/EditProductForm'

export const EditProductPage = () => {
  return (
    <div className='bg-[#f7f9fc] dark:bg-[#1b2635] h-screen pt-20'>
        <Header />
        <Sidebar />
        <EditForm />
    </div>
  )
}
