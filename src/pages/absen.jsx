import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';

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
  const db = getFirestore();

  useEffect(() => {
    const fetchPeople = async () => {
      const querySnapshot = await getDocs(collection(db, 'anggota'));
      const peopleData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPeople(peopleData);
    };

    fetchPeople();
  }, [db]);

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

    try {
      const personRef = doc(db, 'anggota', selectedPerson);
      const personDoc = await getDoc(personRef);

      if (personDoc.exists()) {
        const personData = personDoc.data();
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const jamMasukDate = personData.jamMasuk ? personData.jamMasuk.toDate() : null;
        const jamMasukDay = jamMasukDate ? jamMasukDate.toISOString().split('T')[0] : null;

        if (jamMasukDay === today) {
          // Jika sudah ada jamMasuk untuk hari ini, perbarui jamKeluar
          await updateDoc(personRef, {
            jamKeluar: serverTimestamp(),
          });
          setModalMessage("Terimakasih sudah berkunjung ke Mabes!");
          setModalType("success");
        } else {
          // Jika belum ada jamMasuk untuk hari ini, perbarui jamMasuk
          await updateDoc(personRef, {
            jamMasuk: serverTimestamp(),
            jamKeluar: null,
          });
          setModalMessage("Jaga kebersihan di dalam mabes ya!");
          setModalType("success");
        }
      } else {
        console.log("No such document!");
        setModalMessage("No such document!");
        setModalType("error");
      }
    } catch (error) {
      console.error("Error updating document: ", error);
      setModalMessage("Error updating document");
      setModalType("error");
    }
    setModalOpen(true); // Buka modal setelah operasi selesai
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-20 w-auto"
          src="logo.png"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Warta Ubaya
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {modalOpen && (
          <Modal message={modalMessage} type={modalType} onClose={handleCloseModal} />
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nama" className="block text-sm font-medium leading-6 text-gray-900">
              Nama 
            </label>
            <div className="mt-2">
              <select
                id="nama"
                name="nama"
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="" disabled>Select a person</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>{person.nama}</option>
                ))}
              </select>
            </div>
          </div>

          <legend className="text-sm font-semibold leading-6 text-gray-900">Divisi</legend>
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-x-3">
              <input
                id="redz"
                name="divisi"
                type="radio"
                value="Redaktur"
                onChange={(e) => setDivisi(e.target.value)}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label htmlFor="redz" className="block text-sm font-medium leading-6 text-gray-900">
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
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label htmlFor="dl" className="block text-sm font-medium leading-6 text-gray-900">
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
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label htmlFor="re" className="block text-sm font-medium leading-6 text-gray-900">
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
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label htmlFor="sv" className="block text-sm font-medium leading-6 text-gray-900">
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
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label htmlFor="fg" className="block text-sm font-medium leading-6 text-gray-900">
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
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label htmlFor="ms" className="block text-sm font-medium leading-6 text-gray-900">
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
    </div>
  );
}
