import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import profile from '../assets/profile.png';

const CreateConversationButton = ({ updateConversations }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateConversation = (contactId) => {
    setLoading(true);
    AsyncStorage.getItem('token').then((value) => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + value,
        },
      };

      const data = {
        name: 'Nom de la conversation',
        userId: userData.id,
        contactId: contactId,
      };

      const otherParticipant = userData.contacts.find(
        (contact) => contact.id === contactId
      );
      if (otherParticipant) {
        axios
          .post(
            `http://${process.env.REACT_APP_API_URL}/conversations`,
            data,
            config
          )
          .then((response) => {
            console.log('Conversation créée avec succès !', response.data);
            // Effectuez les actions souhaitées après la création de la conversation
            setLoading(false);
            closeModal();
            // Mettre à jour les conversations dans Messenger
            updateConversations(response.data);
          })
          .catch((error) => {
            console.log(
              'Erreur lors de la création de la conversation',
              error.response
            );
            // Gérez les erreurs lors de la création de la conversation
            setLoading(false);
          });
      } else {
        // Gérez le cas où le contact sélectionné n'est pas trouvé dans la liste des contacts de l'utilisateur
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    AsyncStorage.getItem('token').then((value) => {
      axios
        .get(`http://${process.env.REACT_APP_API_URL}/users/me`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + value,
          },
        })
        .then((response) => {
          console.log(response.data);
          setUserData(response.data);
        })
        .catch((error) => {
          console.log('Erreur =>', error.response);
        });
    });
  }, []);

  const openModal = () => {
    setModalOpen(true);
    document.body.classList.add('overflow-hidden');
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.classList.remove('overflow-hidden');
  };


  return (
    <div>
      <button
        onClick={openModal}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? 'Chargement...' : '+'}
      </button>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white w-1/2 p-4 rounded">
            <h2 className="text-xl font-bold mb-4">
              Commencer une discussion avec
            </h2>
            {userData && (
              <div>
                {userData.contacts.map((contact) => (
                  <div
                    className="border-2 border-black m-4 flex-overflow-auto rounded-lg place-items-center"
                    key={contact.id}
                  >
                    <img className="h-20 w-20" src={profile} alt="Profile" />
                    <p>{contact.firstName}</p>
                    <p>{contact.lastName}</p>
                    <button
                      onClick={() => handleCreateConversation(contact.id)}
                      disabled={loading}
                    >
                      Créer une conversation
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={closeModal}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateConversationButton;
