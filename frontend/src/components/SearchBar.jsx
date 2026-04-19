import { BiSearch } from "react-icons/bi";

function SearchBar({
  searchText,
  setSearchText,
  placeholder = "Search...",
}) {
  return (
    <div className="w-full relative">
      <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" />

      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          pl-10 pr-4
          py-2.5 md:py-3
          text-sm md:text-base
          rounded-full
          border border-borderLight dark:border-borderDark
          bg-cardLight dark:bg-cardDark
          text-textLight dark:text-textDark
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition
        "
      />
    </div>
  );
}

export default SearchBar;
