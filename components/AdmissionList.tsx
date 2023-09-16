import React, { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { List } from './StudentDetails';

const AdmissionList: React.FC = () => {
  const [selectedRow, setSelectedRow] = useState(0);
  const [list, setList] = useState<List[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredItems, setFilteredItems] = useState<List[]>([]);

  const router = useRouter()
  const handleRowClick = (rowId:number) => {
    setSelectedRow(rowId);
    router.push("/details/"+rowId)
  };

  // Function to handle search input changes
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }, []);

  // Update the filtered list based on the search input
  useEffect(() => {
    const filtered = list.filter((item) => {
      const searchText = searchInput.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchText) ||
        item.jambNo.toLowerCase().includes(searchText) ||
        item.email.toLowerCase().includes(searchText) ||
        item.phone.toLowerCase().includes(searchText)
      );
    });
    setFilteredItems(filtered);
  }, [searchInput, list]);

  useEffect(() => {
    // Fetch data from the server-side API route
    fetch('/api/listJson')
      .then((response) => response.json())
      .then((res) => {
        setList(res);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name, Jamb Number, Email or Phone Number"
          value={searchInput}
          onChange={handleSearchInputChange}
          className="border-2 px-2 py-1 rounded-lg w-full border-main-light"
        />
      </div>

      <table className="min-w-full table-auto rounded-xl overflow-clip">
        <thead>
          <tr className='bg-main-dark bg-opacity-20'>
            <th className="px-4 py-2 text-left"></th>
            <th className="px-4 py-2 text-left hidden md:table-cell">Name</th>
            <th className="px-4 py-2 text-left hidden md:table-cell">JAMB Number</th>
            <th className="px-4 py-2 text-left hidden md:table-cell">Course Applied</th>
            <th className="px-4 py-2 text-left hidden md:table-cell">Phone Number</th>
            <th className="px-4 py-2 text-left hidden md:table-cell">Email</th>
            <th className="px-4 py-2 text-left hidden md:table-cell">Gender</th>
            <th className="px-4 py-2 text-left md:hidden"></th>
            <th className="px-4 py-2 text-left md:hidden"></th>
          </tr>
        </thead>
        <tbody>
          {
            filteredItems.map((item:List)=>{
              return (
                <tr key={item.id} onClick={() => handleRowClick(item.id)}
                className={`cursor-pointer transition duration-200 first:rounded-s-xl ${
                  selectedRow === item.id ? 'bg-main-dark odd:bg-main-dark odd:bg-opacity-100 text-white' : 'odd:bg-main-light odd:bg-opacity-10'
                }`}>
                  <td className="border-b w-20 px-4 py-4">
                    <div className='h-12 w-12'>
                      <img
                        className="h-full w-full rounded-full object-contain"
                        src={item.photo}
                        alt="Your Company"
                      />
                    </div>
                  </td>
                  <td className="border-b px-4 py-2 hidden md:table-cell">{item.name}</td>
                  <td className="border-b px-4 py-2 hidden md:table-cell">{item.jambNo}</td>
                  <td className="border-b px-4 py-2 hidden md:table-cell">{item.course}</td>
                  <td className="border-b px-4 py-2 hidden md:table-cell">{item.phone}</td>
                  <td className="border-b px-4 py-2 hidden md:table-cell">{item.email}</td>
                  <td className="border-b px-4 py-2 hidden md:table-cell">{item.gender === 1 ? "Male" : "Female"}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs md:hidden">
                    <div className='border-b'><b>{item.name}</b></div>
                    <div className='border-b'>{item.jambNo}</div>
                    <div>{item.course}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs md:hidden">
                    <div className='border-b'>{item.phone}</div>
                    <div className='border-b'>{item.email}</div>
                    <div>{item.gender === 1 ? "Male" : "Female"}</div>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
};

export default AdmissionList;