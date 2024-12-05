import React from 'react'

function UserLists({ users }) {




    return (
        <div >
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
                                    <td className='border-2 text-center'><button className='bg-red-700 text-white rounded px-2 py-1 m-1 cursor-pointer hover:bg-white hover:text-red-600'>Remove</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default UserLists