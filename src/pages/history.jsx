import { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

export default function History() {
  const db = getFirestore();
  const anggotaWarta = collection(db, 'anggota');
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(anggotaWarta);
      const peopleData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPeople(peopleData);
    };

    fetchData();
  }, [anggotaWarta]);

  const calculateTimeDifference = (jamMasuk, jamKeluar) => {
    const timeDifference = jamKeluar - jamMasuk;
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    return hoursDifference;
  };

  const getMessage = (jamMasuk, jamKeluar) => {
    const hoursDifference = calculateTimeDifference(jamMasuk, jamKeluar);
    if (hoursDifference >= 2) {
      return "Sudah 2 jam di mabes";
    } else {
      const remainingHours = 2 - hoursDifference;
      return `Kurang ${remainingHours.toFixed(2)} jam di mabes`;
    }
  };

  return (
    <div className="bg-stone-900 min-h-screen flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <ul role="list" className="divide-y divide-gray-100">
        {people.map((person) => (
          <li key={person.email} className="flex justify-between gap-x-6 py-5">
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
