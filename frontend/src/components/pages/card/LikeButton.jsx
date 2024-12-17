import React from 'react';

const LikeButton = ({ isAuthenticated, isLiked, handleLike }) => {

    function renderButton(){
        if(isAuthenticated)
        {
            if(isLiked)
            {
                return (
                    <i
                      className="fa-regular fa-heart text-red-500 hover:cursor-pointer text-xl"
                      onClick={handleLike}
                      
                    ></i>
                  )
            }
            else{
                return (
                    <i
                      className="fa-regular fa-heart hover:cursor-pointer text-xl"
                      onClick={handleLike}
                    ></i>
                  )
            }
        }
        else{
        return  <i className="fa-regular fa-heart text-gray-500"></i>
                  }
    }
  return (
    <>
    {
        renderButton()
    }</>
  )
};

export default React.memo(LikeButton);
