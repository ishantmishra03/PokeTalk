import Link from 'next/link'
import React from 'react'

const page: React.FC = () => {
  return (
    <div className='flex items-center justify-center w-full min-h-screen text-5xl'>
      <Link href="/" className="absolute top-6 right-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
        Go back
      </Link>
      Chat
    </div>
  )
}

export default page
