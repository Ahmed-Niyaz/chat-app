import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import {IoArrowBack} from 'react-icons/io5'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { colors, getColor } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, DELETE_PROFILE_IMAGE_ROUTE, HOST, UPDATE_PROFILE_ROUTE } from "@/utils/constants";

const Profile = () => {

  const navigate = useNavigate();

  const { userInfo, setUserInfo } = useAppStore();

  const fileInputRef = useRef(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [image, setImage] = useState(null);
  const [bio, setBio] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [hovered, setHovered] = useState(false);

  function handleNavigate() {
    if (userInfo.profileSetup) {
      navigate('/chat')
    } else {
      toast.error('Setup profile')
    }
  }

  function handleImageInputClick() {
    // this opens the input and after this the onchange of input is changed due to which handleImageChange is called
    fileInputRef.current.click();
  }

  const validateProfile = () => {
    if (!firstName || !lastName) {
      toast.error('Please provide both first name and last name');
      return false;
    }
    return true;
  }

  async function handleImageChange(e) {
    try {
      const imgFile = e.target.files[0];

    if (imgFile) {
      const formData = new FormData();
      formData.append('profile-image', imgFile);

      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, { withCredentials: true });

      if (response.status === 200 && response.data.image) {
        setUserInfo({...userInfo, image: response.data.image});
        toast.success('Image updated successfully.')
      }
    }
    } catch (error) {
      toast.error(error.response.data)
      console.error(error.response.data);
    }
  }


  async function removeImage() {
    try {
      const response = await apiClient.delete(DELETE_PROFILE_IMAGE_ROUTE, { withCredentials: true });

      if (response.status === 200) {
        setUserInfo({...userInfo, image: null});
        toast.success('Image removed successfully.');
        setImage(null)
      }
    } catch (error) {
      toast.error(error.response.data)
      console.error(error.response.data);
    }
  }

  async function updateProfile(e) {
    e.preventDefault()
    if (validateProfile()) {
      try {

        const response = await apiClient.post(UPDATE_PROFILE_ROUTE, {
          firstName, lastName, bio, color: selectedColor 
        }, { withCredentials: true });

        if (response.status === 200 && response.data) {
          setUserInfo({...response.data});
          toast.success('Profile updated successfully.')
          navigate('/chat');
        }

      } catch (error) {
        toast.error(error.response.data)
        console.error(error.response.data);
      }
    }
  }

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
      setBio(userInfo.bio);
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`)
    } else{
      setBio(userInfo.bio);
      setSelectedColor(userInfo.color)
    }
  }, [userInfo])
  
  return (
    <div className='profile min-h-[100vh] bg-[#1b1c24] flex items-center justify-center'>
      <div className='profile-container bg-[#1b1c24] flex items-center justify-between min-w-[700px] rounded-xl'>
        <form onSubmit={updateProfile}  className='flex flex-col gap-5 p-10 items-center text-white' >
          <div className="flex flex-col justify-center items-center mb-4 w-[100%]">
          <IoArrowBack className="self-start text-4xl lg:text-6xl text-white/90 cursor-pointer" onClick={handleNavigate} />
          <h3 className='text-white font-medium text-2xl'>Profile Details</h3>
          </div>
          {/* <label className='flex items-center gap-2 text-gray-400 cursor-pointer w-full' htmlFor="avatar">
            <input type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
            <img className='w-[50px] aspect-square rounded-full' 
            src={assets.avatar_icon} alt="profile-icon" />
            Upload profile image
            </label> */}
          <input className='p-3 min-w-[300px] border border-solid border-[#077eff] bg-transparent outline-none rounded-md text-white' type="email" disabled  value={userInfo.email} />
          <input className='p-3 min-w-[300px] border border-solid border-[#077eff] bg-transparent outline-none rounded-md' type="text" placeholder='First Name' onChange={(e) => setFirstName(e.target.value)} required value={firstName} />
          <input className='p-3 min-w-[300px] border border-solid border-[#077eff] bg-transparent outline-none rounded-md' type="text" placeholder='Last Name' onChange={(e) => setLastName(e.target.value)} required value={lastName} />
          <textarea className='p-3 min-w-[300px] border border-solid border-[#077eff] bg-transparent outline-none rounded-md' name='bio' placeholder='Enter Bio' onChange={(e) => setBio(e.target.value)} defaultValue={userInfo.bio} required></textarea>
          <button className='w-full rounded-md text-white border-none bg-[#077eff] p-2 text-xl cursor-pointer' type='submit'>Save</button>
        </form>

        <div className="flex flex-col items-center justify-center gap-8 w-[100%]">
          
          <div className={`relative rounded-full border-[4px] border-solid border-${getColor(selectedColor)}`} 
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >

            {
              hovered && 
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
              
              >
                { image ? 
                (
                  <FaTrash className="text-white text-3xl cursor-pointer" onClick={removeImage} />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" onClick={handleImageInputClick}/>
                ) }
                
              </div>
            }
            
            <input 
              id="profile-image"
              type="file" 
              ref={fileInputRef}
              hidden 
              onChange={handleImageChange} 
              name="profile-image"
              onClick={() => console.log('click input')} 
              accept=".png, .jpg, .jpeg, .svg, .webp" 
            />
            
            {
              image 
              ?
              <label htmlFor="profile-image" className='flex justify-center items-center cursor-pointer h-32 w-32 md:w-48 md:h-48 rounded-full'>
                {/* <input type="file" id='profile-image' accept=".png, .jpg, .jpeg, .svg, .webp" hidden onChange={handleImage} ref={fileInputRef} /> */}
                <img className='aspect-square mx-auto my-5 rounded-full' src={image} alt="logo" id='profile-img' />
              </label>
              :
              <div className={`uppercase h-32 w-32 md:w-48 md:h-48 rounded-full text-5xl border-[1px] flex items-center justify-center ${getColor(selectedColor)}`}>
                    { firstName ? (lastName ? (firstName.split('').shift() + lastName.split('').shift() ) : firstName.split('').shift()) : userInfo.email.split('').shift() }
              </div>
            }
          </div>


          <div className="w-full flex justify-center gap-5">
              {
                colors.map((color, index) => {
                  return (
                  <div key={index} className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${ selectedColor === index ? 'outline outline-white/50 outline-1' : '' }`}
                  onClick={() => setSelectedColor(index)}
                  >
                  </div>
                  )
                })
              }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
