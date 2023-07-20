import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.REACT_APP_API_URL;

// Fonction pour obtenir les informations de l'utilisateur connecté
export const getUserData = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Erreur =>', error.response);
    throw error;
  }
};

// Fonction pour créer une nouvelle conversation
export const createConversation = async (userData, contactId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
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
      const response = await axios.post(`${API_URL}/conversations`, data, config);
      console.log('Conversation créée avec succès !', response.data);
      return response.data;
    } else {
      throw new Error('Contact not found');
    }
  } catch (error) {
    console.log('Erreur lors de la création de la conversation', error.response);
    throw error;
  }
};
