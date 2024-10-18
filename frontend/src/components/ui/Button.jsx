export function Button({ onClick, children }) {
    return (
      <button
        className="bg-[#86B250] hover:bg-[#739A43] text-white 
        font-bold px-4 py-1 rounded-md mt-4 transition duration-300"
        onClick={onClick}
      >
        {children}
      </button>
    );
  }