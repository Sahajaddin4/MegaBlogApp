import React,{useState} from 'react'
import ConfirmationModal from '../../conrfirmationModal/ConfirmationModal';
import SuccessAlert from '../../conrfirmationModal/SuccessAlert';
function UserLists({ users,removeUser,activeUserAc }) {

    const [open,setOpen]=useState(false);
    const [id,setId]=useState(null);
    const [openSuccess,setOpenSuccess]=useState(false);
function handleCancelAction(){
    setOpen(false);
    setOpenSuccess(false);
}
function handleConfirmActionOnRemoval(){
    removeUser(id);
    setOpen(false);
}
function handleConfirmActionOnActivation(){
    activeUserAc(id);
    setOpenSuccess(false);
}

   function renderContent(status,userId){
    if(status==="active")
{
    return <button onClick={()=>{
        setId(userId)
         setOpen(true)
    }} 
    className='bg-red-700 text-white rounded px-2 py-1 m-1 
    cursor-pointer hover:bg-white hover:text-red-600'>Remove</button>
}
else{
    return <button onClick={()=>{setId(userId)
        setOpenSuccess(true)}} 
    className='bg-green-700 text-white rounded px-3 py-1 m-1 
    cursor-pointer hover:bg-white hover:text-green-600'>Active</button>
}
   }
    return (
        <div className='overflow-y-scroll'>
            <table className='w-full'>
                <thead className='border-2 p-2'>
                    <tr  >
                        <th className='border-r-2 p-2'>User Name</th>
                        <th className='border-r-2 p-2'>User Email</th>
                        <th className='border-r-2 p-2'>Mobile No</th>
                        <th className='border-r-2 p-2'>Created By</th>
                        <th className='border-r-2 p-2'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        users.map((user) => {
                            return (
                                <tr key={user._id}>
                                    <td className='border-2 text-center'>{user.name}</td>
                                    <td className='border-2 text-center'> {user.email}</td>
                                    <td className='border-2 text-center'>{user.phone}</td>
                                    <td className='border-2 text-center'>{user.createdBy}</td>
                                    <td className='border-2 text-center'>{renderContent(user.status,user._id)}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

            <ConfirmationModal 
            open={open}
            setOpen={setOpen}
            handleConfirmAction={handleConfirmActionOnRemoval}
            handleCancelAction={handleCancelAction}
            title="Delete User"
            message="Are you sure you want to remove this user?"
            />

            <SuccessAlert 
            open={openSuccess}
            setOpen={setOpenSuccess}
            handleConfirmAction={handleConfirmActionOnActivation}
            handleCancelAction={handleCancelAction}
            title="Activated User"
            message="Are you sure you want to activate this user account ?"
            />
        </div>
    )
}

export default UserLists