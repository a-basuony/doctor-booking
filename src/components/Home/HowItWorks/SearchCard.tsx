import { FiSearch } from 'react-icons/fi';
import { MdOutlineStarOutline , MdStar} from "react-icons/md";


type Props = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  placeholder: string;
};

export default function SearchCard({
  searchQuery,
  setSearchQuery,
  placeholder,
}: Props) {
  return (
    <div className="border border-gray-400 rounded-3xl shadow-sm m-5 overflow-hidden bg-white"> 
      <div className="h-64 relative flex items-center justify-center ">
        <div className="absolute inset-0 pointer-events-none grid grid-cols-8 gap-6 p-6 opacity-40">
  {[...Array(48)].map((_, i) => (
    <div key={i} className="flex items-center  text-blue-500">
      <MdStar />
      <MdOutlineStarOutline />
    </div>
  ))}
</div>

        <div className="relative z-10 w-full max-w-xs">
          <div className="bg-white border border-blue-400 rounded-2xl px-5 py-3 flex items-center gap-3 shadow">
            <FiSearch />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search by ${placeholder}`}
              className="w-full outline-none"
            />
          </div>
        </div>
      </div>

      <div className="px-7 py-6 shadow-[0_-4px_10px_rgba(0,0,0,0.12)]">
        <h3 className="text-xl font-serif mb-2">Search for a Doctor</h3>
        <p className="text-sm text-gray-600">
          Easily browse by specialty, location, or doctor name.
        </p>
      </div>
    </div>
  );
}
