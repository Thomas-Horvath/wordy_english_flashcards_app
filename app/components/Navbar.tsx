'use client';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { IoSettings } from "react-icons/io5";
import { IoIosExit } from "react-icons/io";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
    const pathname = usePathname();
    const [token, setToken] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const router = useRouter()


    useEffect(() => {
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem('token'));
        }
    }, [token]);


    const signOut = async () => {
        try {
            const res = await fetch('/api/logout', { method: 'POST', body: JSON.stringify({ token }) });


            if (res.status === 200) {
                localStorage.removeItem('token');
                setToken(null);
                router.push('/');
            }

        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <nav className="w-full bg-blue-600 fixed top-0 left-0 h-16 px-4">
            <div className="max-w-[1400px] w-full mx-auto flex justify-between items-center h-full">
                {/* Logo */}
                <div className="ml-4">
                    <Link href="/" className="flex items-baseline gap-2">
                        <span className="text-white text-3xl font-extrabold tracking-tight drop-shadow-sm">
                            Wordy<span className="text-yellow-400">!</span>
                        </span>
                        <span className="hidden lg:inline-block text-blue-100 text-lg font-medium tracking-wide">
                            Szókártyák
                        </span>
                    </Link>
                </div>

                {/* Nav links */}
                <ul className="hidden md:flex  h-full text-xl">
                    <li>
                        <Link
                            href="/"
                            className={clsx(
                                "relative flex items-center h-full px-4 text-white transition-colors duration-100 hover:text-yellow-300",
                                { "bg-blue-700 border-b-2 border-yellow-400": pathname === "/" }
                            )}
                        >
                            Főoldal
                        </Link>
                    </li>

                    {token ? (
                        <>
                            <li>
                                <Link
                                    href="/packages"
                                    className={clsx(
                                        "relative flex items-center h-full px-4 text-white transition-colors duration-100 hover:text-yellow-300",
                                        { "bg-blue-700 border-b-2 border-yellow-400": pathname === "/packages" }
                                    )}
                                >
                                    Szócsomagok
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/profil"
                                    className={clsx(
                                        "relative flex items-center h-full px-4 text-white transition-colors duration-100 hover:text-yellow-300",
                                        { "bg-blue-700 border-b-2 border-yellow-400": pathname === "/profil" }
                                    )}
                                >
                                    <IoSettings className="text-2xl" />
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={signOut}
                                    className="relative flex items-center h-full px-4 text-white transition-colors duration-100 hover:text-yellow-300"
                                >
                                    <IoIosExit className="text-4xl" />
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link
                                href="/login"
                                className={clsx(
                                    "relative flex items-center h-full px-4 text-white transition-colors duration-100 hover:text-yellow-300",
                                    { "bg-blue-700 border-b-2 border-yellow-400": pathname === "/login" }
                                )}
                            >
                                Belépés
                            </Link>
                        </li>
                    )}


                </ul>


                {/* Mobile hamburger */}
                <button onClick={() => setOpen(!open)} className="md:hidden text-3xl text-white cursor:pointer">
                    {open ? <HiX className='cursor-pointer' /> : <HiMenu className='cursor-pointer' />}
                </button>

            </div>


            {/* Mobile menu */}
            {open && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-blue-700 shadow-lg">
                    <ul className="flex flex-col text-lg">
                        <li>
                            <Link
                                href="/"
                                onClick={() => setOpen(false)}
                                className="block px-6 py-3 text-white hover:bg-blue-600"
                            >
                                Főoldal
                            </Link>
                        </li>
                        {token ? (
                            <>
                                <li>
                                    <Link
                                        href="/packages"
                                        onClick={() => setOpen(false)}
                                        className="block px-6 py-3 text-white hover:bg-blue-600"
                                    >
                                        Szócsomagok
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/profil"
                                        onClick={() => setOpen(false)}
                                        className="block px-6 py-3 text-white hover:bg-blue-600"
                                    >
                                        Beállítások
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setOpen(false);
                                        }}
                                        className="block w-full text-left px-6 py-3 text-white hover:bg-blue-600"
                                    >
                                        Kilépés
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                    className="block px-6 py-3 text-white hover:bg-blue-600"
                                >
                                    Belépés
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            )}

        </nav>
    );
}

export default Navbar;
