import { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import DataWartaUbayaGen40 from '../data/DataWartaUbayaGen40.json';
import { Link } from 'react-router-dom';

// Komponen Modal
function Modal({ message, type, onClose }) {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className={`sm:flex sm:items-start ${type === 'success' ? 'border-green-400' : 'border-red-400'} border-b border-solid rounded-t sm:rounded-t-none sm:rounded-l`}>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className={`text-lg font-semibold leading-6 ${type === 'success' ? 'text-green-900' : 'text-red-900'}`} id="modal-title">
                  {type === 'success' ? 'Sukses Absen!' : 'Error!'}
                </h3>
                <div className={`mt-2 ${type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                  <p>{message}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              onClick={onClose} 
              type="button" 
              className={`w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 bg-${type === 'success' ? 'green' : 'red'}-600 text-red hover:bg-${type === 'success' ? 'green' : 'red'}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type === 'success' ? 'green' : 'red'}-500 sm:ml-3 sm:w-auto sm:text-sm`}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Absen() {
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [divisi, setDivisi] = useState('');
  const [modalOpen, setModalOpen] = useState(false); // State untuk kontrol modal
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State untuk mengelola status login
  const auth = getAuth();

  useEffect(() => {
    const fetchData = () => {
      const loadedPeople = DataWartaUbayaGen40.map((item, index) => ({
        id: index,
        ...item
      }));
      setPeople(loadedPeople);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPerson || !divisi) {
      setModalMessage("Nama or Divisi is missing");
      setModalType("error");
      setModalOpen(true); // Buka modal
      return;
    }
    const now = new Date();
    const updatedPeople = people.map((person) => {
      if (person.nama === selectedPerson) {
        return {
          ...person,
          jamMasuk: now.toISOString(), // Tambahkan waktu masuk
          jamKeluar: null, // Set jam keluar awalnya ke null
        };
      }
      return person;
    });
    setPeople(updatedPeople);
    localStorage.setItem('DataWartaUbayaGen40', JSON.stringify(updatedPeople));

    setModalMessage("Data updated successfully with jamMasuk and jamKeluar");
    setModalType("success");
    setModalOpen(true); // Buka modal
    };

    const handleLogout = async () => {
      try {
        await signOut(auth);
        setIsLoggedIn(false);
      } catch (error) {
        console.error("Error logging out: ", error);
      }
  };

  return (
    <div className="bg-stone-900 min-h-screen flex flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-20 w-auto"
          src="logo.png"
          alt="Warta Ubaya"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Warta Ubaya
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {modalOpen && (
          <Modal message={modalMessage} type={modalType} onClose={handleCloseModal} />
        )}
        
          <div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nama" className="block text-sm font-medium leading-6 text-white">
                  Nama 
                </label>
                <div className="mt-2">
                  <select
                    id="nama"
                    name="nama"
                    value={selectedPerson}
                    onChange={(e) => setSelectedPerson(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="" disabled>Select a person</option>
                    {people.map((person) => (
                      <option key={person.nama} value={person.nama}>{person.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              <legend className="text-sm font-semibold leading-6 text-white">Divisi</legend>
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-x-3">
                  <input
                    id="redz"
                    name="divisi"
                    type="radio"
                    value="Redaktur"
                    onChange={(e) => setDivisi(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-white focus:ring-stone-600"
                  />
                  <label htmlFor="redz" className="block text-sm font-medium leading-6 text-white">
                    Redaktur
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="dl"
                    name="divisi"
                    type="radio"
                    value="Design and Layouter"
                    onChange={(e) => setDivisi(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-white focus:ring-stone-600"
                  />
                  <label htmlFor="dl" className="block text-sm font-medium leading-6 text-white">
                    Design and Layouter
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="re"
                    name="divisi"
                    type="radio"
                    value="Reporter"
                    onChange={(e) => setDivisi(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-white focus:ring-stone-600"
                  />
                  <label htmlFor="re" className="block text-sm font-medium leading-6 text-white">
                    Reporter
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="sv"
                    name="divisi"
                    type="radio"
                    value="Surveyor"
                    onChange={(e) => setDivisi(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-white focus:ring-stone-600"
                  />
                  <label htmlFor="sv" className="block text-sm font-medium leading-6 text-white">
                    Surveyor
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="fg"
                    name="divisi"
                    type="radio"
                    value="Fotografer"
                    onChange={(e) => setDivisi(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-white focus:ring-stone-600"
                  />
                  <label htmlFor="fg" className="block text-sm font-medium leading-6 text-white">
                    Fotografer
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="ms"
                    name="divisi"
                    type="radio"
                    value="Marketer"
                    onChange={(e) => setDivisi(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-white focus:ring-stone-600"
                  />
                  <label htmlFor="ms" className="block text-sm font-medium leading-6 text-white">
                    Marketer
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Absen
                </button>
              </div>
            </form>
          </div>
          {isLoggedIn ? (
            <div className="mt-4">
              <button 
                onClick={handleLogout} 
                className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500"
              >
                Logout
              </button>
              <Link to="/history" className="mt-2 flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500">
                Lihat History
              </Link>
            </div>
        ) : (
          <p className="mt-10 text-center text-sm text-gray-500">
            Anda adalah Admin?{' '}
            <a href="SignIn" className="font-semibold leading-6 text-white hover:text-indigo-500">
              Klik Di sini
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

