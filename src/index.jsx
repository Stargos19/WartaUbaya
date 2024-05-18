import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App'
import '../public/tailwind.css'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
)

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.autoSetJamKeluar = functions.pubsub.schedule('0 21 * * *').timeZone('Asia/Jakarta').onRun(async (context) => {
  const db = admin.firestore();
  const anggotaSnapshot = await db.collection('anggota').get();
  
  const updates = [];
  
  anggotaSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.jamMasuk && !data.jamKeluar) {
      const jamKeluar = new admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(21, 0, 0, 0)));
      updates.push(doc.ref.update({ jamKeluar }));
    }
  });

  await Promise.all(updates);
  console.log('Successfully updated jamKeluar for all relevant documents.');
  return null;
});
