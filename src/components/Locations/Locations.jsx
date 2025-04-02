import React, { useState } from 'react';
import { useFormik } from 'formik';

export default function Locations() {
  const [locations, setLocations] = useState(
    JSON.parse(localStorage.getItem('data')) || []
  );
  const [isSorted, setIsSorted] = useState(false);
  const x={}

  const formik = useFormik({
    initialValues: {
      location: '',
      name: '',
    },
    onSubmit: (values) => {
      const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
      const match = values.location.match(regex);
      if (match) {
        const latitude = parseFloat(match[1]);
        const longitude = parseFloat(match[2]);
        values.location = { lat: latitude, lon: longitude };
        const updatedData = [...locations, values];
        localStorage.setItem('data', JSON.stringify(updatedData));
        setLocations(updatedData);
        formik.setFieldValue('name', '');  
        formik.setFieldValue('location', '');
      }
    },
  });

  function sortLocations() {
    let storedData = JSON.parse(localStorage.getItem('data')) || [];
    if (storedData.length < 2) return;
    const reference = storedData[0].location;
    storedData = storedData.slice(1).sort((a, b) =>
      getDistance(reference.lat, reference.lon, a.location.lat, a.location.lon) -
      getDistance(reference.lat, reference.lon, b.location.lat, b.location.lon)
    );
    storedData.unshift({ name: storedData[0].name, location: reference });
    setLocations([...storedData]);
    localStorage.setItem('data', JSON.stringify(storedData));

    setIsSorted(true);
  }

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function clear(){
    localStorage.clear();
    setLocations(null)

  }

  return  <>
  <form onSubmit={formik.handleSubmit} className=' bg-slate-600 p-6 rounded-lg'>
  <div className="mb-4">
    <label htmlFor='name' className="block text-white font-semibold mb-2">Name</label>
    <input
      type='text'
      onChange={formik.handleChange}
      value={formik.values.name}
      name='name'
      id='name'
      className='w-full p-3 rounded-md bg-white text-gray-700'
    />
  </div>

  <div className="mb-4">
    <label htmlFor='location' className="block text-white font-semibold mb-2">Location</label>
    <input
      type='text'
      onChange={formik.handleChange}
      value={formik.values.location}
      name='location'
      id='location'
      className='w-full p-3 rounded-md  text-gray-700'
    />
  </div>

  <button type='submit' className='w-full bg-green-500 hover:bg-green-700 p-3 rounded-md text-white font-bold'>
    Add Location
  </button>
</form>

<button
  className='mt-6 w-full bg-blue-600 rounded-lg p-3 text-white font-semibold hover:bg-blue-700 transition'
  onClick={sortLocations}
>
  ترتيب حسب الأقرب
</button>

{isSorted && <>
  <button onClick={clear} className="flex ml-auto relative group">
  <i className="fa fa-trash text-red-700 text-2xl p-3"></i>
  <span className="absolute right-0 top-full mt-0 hidden group-hover:block text-sm bg-gray-700 text-white px-1 py-1 rounded">
    حذف
  </span>
</button>

  <ul className="mt-6 bg-gray-100 p-4 rounded-lg">
    {locations?.map((loc, index) => (
      <li key={index} className='py-2 px-4 border-b border-gray-300'>{loc.name}</li>
    ))}
  </ul>
</>}

  </>
}
