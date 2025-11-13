import React from 'react'
import "./includes.scss"
import { MdWorkspacesOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useUser } from '../../../context/userContext.jsx'
import { useNavigate } from 'react-router-dom';

const Header = () => {
    let { user } = useUser()
    let navigate = useNavigate()

    return (
        <header id='header' className='bg-[#222831] text-[#EEEEEE] shadow-md'>
            <div className='content-container'>
                <div className='content flex justify-between items-center px-8 py-3'>

                    {/* Logo */}
                    <div
                        className='logo flex gap-2 items-center cursor-pointer hover:text-[#00ADB5] transition'
                        onClick={() => navigate("/")}
                    >
                        <MdWorkspacesOutline size={30} className='text-[#00ADB5]' />
                        <span className='font-bold text-xl'>JOBPULSE</span>
                    </div>

                    {/* Search Bar */}
                    <div className='search-bar grow px-6'>
                        <form className="max-w-md mx-auto">
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-[#EEEEEE]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    id="default-search"
                                    className="block w-full p-2 ps-10 text-sm rounded-lg border border-[#393E46] bg-[#393E46] placeholder-[#EEEEEE] text-[#EEEEEE] focus:ring-[#00ADB5] focus:border-[#00ADB5] outline-none"
                                    placeholder="Search Jobs Here ..."
                                    required
                                />
                                <button
                                    type="submit"
                                    className="text-[#EEEEEE] absolute end-0 top-1/2 -translate-y-1/2 bg-[#00ADB5] hover:bg-[#00bfc8] font-medium rounded-lg text-sm px-4 py-2 transition"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Account Section */}
                    <div className='account flex items-center gap-2'>
                        <FaUser size={27} className='text-[#EEEEEE]' />
                        {
                            user.logedIn ? (
                                <span className='flex gap-2 items-center'>
                                    <span className='font-bold'>Welcome,</span>
                                    <span className='text-[#00ADB5] flex items-center gap-1'>
                                        {user.name}
                                        <IoMdArrowDropdown className='text-[#EEEEEE]' />
                                    </span>
                                    !
                                </span>
                            ) : (
                                <span
                                    className='cursor-pointer hover:text-[#00ADB5] transition'
                                    onClick={() => navigate("/user-login-register")}
                                >
                                    Please <span className='text-[#00ADB5]'>Login/Register!</span>
                                </span>
                            )
                        }
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
