import React from 'react'
import { FaLinkedin, FaInstagram, FaTwitter, FaGithub } from 'react-icons/fa6'

function Footer({trip}) {
  return (
    <div className='my-10'>
        <div className='bg-gray-300 p-6 rounded-xl text-center'>
            <h2 className='font-bold text-lg'>This web application created by Saurabh Thakur</h2>
            <p className='font-semibold'>All rights reserved by <span className='font-semibold '>WEBER</span></p>

            <div className='flex justify-center gap-12 mt-4 text-2xl'>
                <a href='https://github.com/Saurabhthakur-73' target='_blank' rel='noopener noreferrer' className='hover:text-pink-600'>
                    <FaGithub/>
                </a>
                <a href='https://www.linkedin.com/in/saurabh-thakur-82b952295/' target='_blank' rel='noopener noreferrer' className='hover:text-pink-600'>
                    <FaLinkedin/>
                </a>

                <a href='https://www.instagram.com/saurabh_thakur_harad/' target='_blank' rel='noopener noreferrer' className='hover:text-pink-600'>
                    <FaInstagram/>
                </a>

                <a href='https://x.com/SaurabhTha57831' target='_blank' rel='noopener noreferrer' className='hover:text-pink-600'>
                    <FaTwitter/>
                </a>

            </div>
        </div>
    </div>
  )
}

export default Footer
