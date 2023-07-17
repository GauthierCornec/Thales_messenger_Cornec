import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import profile from '../assets/profile.png';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AddContactButton = ({ updateContact, onContactAdded }) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newContactData, setNewContactData] = useState({
        email: '',
        phoneNumber: '',
        lastName: '',
        firstName: '',
      });

      useEffect(() => {
        const fetchUserData = async () => {
          try {
            const value = await AsyncStorage.getItem('token');
            const response = await axios.get(`http://${process.env.REACT_APP_API_URL}/users/me`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + value,
              },
            });
            setUserData(response.data);
          } catch (error) {
            console.log('Erreur =>', error.response);
          }
        };
      
        fetchUserData();
      }, []);

      const handleCreateContact = (firstName, lastName, phoneNumber, email) => {
        setLoading(true);
        AsyncStorage.getItem('token').then((value) => {
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + value,
            },
          };
      
          const data = {
            userId: userData.id,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email,
          };
      
          axios
            .post(
              `http://${process.env.REACT_APP_API_URL}/contacts`,
              data,
              config
            )
            .then((response) => {
              console.log('Contact créé avec succès !', response.data);
              setLoading(false);
              closeModal();
              onContactAdded(response.data); // Pass the API response data to the callback
            })
            .catch((error) => {
              console.log(error);
              console.log('Erreur lors de la création du contact', error.response);
              setLoading(false);
            });
        });
      };
      

      const openModal = () => {
        setModalOpen(true);
        document.body.classList.add('overflow-hidden');
      };
    
      const closeModal = () => {
        setModalOpen(false);
        document.body.classList.remove('overflow-hidden');
      };

      const handleInputChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        setNewContactData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

    return (
<div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={openModal}
      >
        Ajouter un contact
      </button>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white w-1/2 p-4 rounded h-screen overflow-auto border-4 border-black">
            <h2 className="text-xl font-bold mb-4">Ajouter un contact</h2>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={newContactData.email}
              onChange={handleInputChange}
              className="w-full border p-2 mb-2"
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Numéro de téléphone"
              value={newContactData.phoneNumber}
              onChange={handleInputChange}
              className="w-full border p-2 mb-2"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Nom"
              value={newContactData.lastName}
              onChange={handleInputChange}
              className="w-full border p-2 mb-2"
            />
            <input
              type="text"
              name="firstName"
              placeholder="Prénom"
              value={newContactData.firstName}
              onChange={handleInputChange}
              className="w-full border p-2 mb-2"
            />
            <div className="flex justify-end">
              <button
                onClick={handleCreateContact}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Ajouter
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
        )
}

export default AddContactButton;