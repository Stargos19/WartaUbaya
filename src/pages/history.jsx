import { useState, useEffect } from 'react';
import { getDatabase, ref, get, update, child } from 'firebase/database';

export default function History() {
  const db = getDatabase();
  const [people, setPeople] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(db, 'anggota');
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const peopleData = [];
        snapshot.forEach(childSnapshot => {
          peopleData.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        setPeople(peopleData);
        
      } else {
        console.log("No data available");
      }
    };

    fetchData();
  }, []);

  const resetAllTimes = async () => {
    const updates = {};
    people.forEach(person => {
      const path = `anggota/${person.id}`;
      updates[`${path}/jamMasuk`] = null;
      updates[`${path}/jamKeluar`] = null;
    });

    await update(ref(db), updates);
    console.log('All times have been reset.');
    setShowModal(false); // Close modal after reset
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-stone-900 min-h-screen flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <button onClick={handleOpenModal} className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Reset semua jam
      </button>
      {showModal && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <h2>Konfirmasi Reset</h2>
            <p>Apakah anda yakin ingin mereset semua jam anak - anak?</p>
            <button onClick={resetAllTimes} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">
              Saya yakin
            </button>
            <button onClick={handleCloseModal} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}
      <ul role="list" className="divide-y divide-gray-100">
        {people.map((person) => (
          <li key={person.id} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-white">{person.nama}</p>
                {person.jamMasuk ? (
                  person.jamKeluar ? (
                    <p className="mt-1 text-xs leading-5 text-white">
                      Terakhir datang <time dateTime={person.jamKeluar.toDate().toISOString()}>{person.jamKeluar.toDate().toLocaleString('en-ID', { dateStyle: 'medium', timeStyle: 'long' })}</time>
                      <><br />{getMessage(person.jamMasuk.toDate(), person.jamKeluar.toDate())}</>
                    </p>
                  ) : (
                    <div className="mt-1 flex items-center gap-x-1.5">
                      <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-xs leading-5 text-gray-500">Sedang di Mabes</p>
                    </div>
                  )
                ) : (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-red-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    </div>
                    <p className="text-xs leading-5 text-gray-500">Belum ke Mabes</p>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-between">
              <p className="text-sm leading-6 text-gray-900">{person.jabatan}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
