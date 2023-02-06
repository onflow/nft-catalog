import { AiOutlineClose } from 'react-icons/ai';

type HamburgerProps = {
    onClick: () => void,
    isOpen: boolean
}

export function Hamburger({ onClick, isOpen }: HamburgerProps) {
    return <div className="mt-1 flex flex-1 justify-end lg:hidden p-2">
        <button className="flex items-center px-3 py-2 text-lg border rounded text-primary-black hover:opacity-75" onClick={onClick}>
            {!isOpen ?
                (
                    <svg className="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                )
                :
                (
                    <AiOutlineClose />
                )
            }
        </button>
    </div>
}