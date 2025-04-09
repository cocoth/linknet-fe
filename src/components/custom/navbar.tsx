"use client"

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaBell } from "react-icons/fa";
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname(); // Gunakan useRouter untuk mendapatkan path saat ini

    return (
        <nav className='flex justify-between items-center bg-gray-50 shadow-md shadow-black'>
            <section>
                <Link href="/dashboard">
                    <Image
                        src="/logo.png"
                        alt="SIDASI"
                        width={500}
                        height={500}
                        className="w-full h-10 m-3"
                    />
                </Link>
            </section>
            <section>
                <ul className="flex justify-between items-center font-bold mx-3 gap-3">
                    <li className={`bg-gray-200 p-2 rounded-full`}>
                        <FaBell className='-rotate-12' />
                    </li>
                    <li className={`${pathname === '/dashboard' ? 'bg-orange-400 text-white' : 'hover:bg-orange-200'} p-2 rounded-lg`}>
                        <Link href="/dashboard">
                            Drawing Map
                        </Link>
                    </li>
                    <li className={`${pathname === '/survey' ? 'bg-orange-400 text-white' : 'hover:bg-orange-200'} p-2 rounded-lg`}>
                        <Link href="/survey">
                            Survey
                        </Link>
                    </li>
                    <li className={`${pathname === '/ismart' ? 'bg-orange-400 text-white' : 'hover:bg-orange-200'} p-2 rounded-lg`}>
                        <Link href="/ismart">
                            I-Smart
                        </Link>
                    </li>
                    <li className={`${pathname === '/user-profile' ? 'bg-orange-400 text-white' : 'hover:bg-orange-200'} p-2 rounded-lg`}>
                        <Link href="/user-profile">
                            Profile User
                        </Link>
                    </li>
                </ul>
            </section>
        </nav>
    )
}

export default Navbar