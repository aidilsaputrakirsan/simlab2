interface ModalProps {
    isOpen: boolean;
    onClose: () => void,
    title: string,
    children: React.ReactNode,
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
}) => {
    return (
        <div className={`fixed inset-0 z-[99] flex items-center justify-center transition-all bg-black/50 outline-none focus:outline-none ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-300`}>
            <div className={`relative w-full max-w-xl mx-auto my-6 px-5 md:px-0`}>
                <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                    {/* Header */}
                    <div className="flex items-start justify-between p-5 border-b border-gray-200 border-solid rounded-t">
                        <h3 className="text-lg font-semibold">
                            {title}
                        </h3>
                        <button
                            className="float-right p-1 ml-auto text-2xl font-semibold leading-none text-gray-400 bg-transparent border-0 outline-none hover:text-gray-600 focus:outline-none"
                            onClick={onClose}
                        >
                            <span className="block w-6 h-6 text-xl text-gray-500 bg-transparent outline-none focus:outline-none">
                                ×
                            </span>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="relative flex-auto p-6 max-h-[80vh] overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
