import { useEffect, useState } from 'react';
import profile from '../../assets/profile.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import CreateConversationButton from '../../component/createConversation';

const Messenger = () => {
    const [userData, setUserData] = useState(null);
    const [message, setMessage] = useState('');
    const [sortedConversations, setSortedConversations] = useState([]);
    const [messageContent, setMessageContent] = useState('');
    const [selectedContactInfo, setSelectedContactInfo] = useState(null);
    const [selectedConversationId, setSelectedConversationId] = useState(null); // Added state for selected conversation ID
    const [selectedContactMessages, setSelectedContactMessages] = useState([]); // Added state for selected contact's messages
  
    useEffect(() => {
      AsyncStorage.getItem('token').then((value) => {
        axios.get(`http://${process.env.REACT_APP_API_URL}/users/me`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + value,
          }
        }).then(r => {
          console.log(r.data);
          setUserData(r.data);
        }).catch(e => {
          console.log('Erreur =>', e.response);
        });
      });
    }, []);
  
    const updateConversations = (newConversation) => {
      setUserData((prevUserData) => {
        const updatedUserData = { ...prevUserData };
        const conversations = [...updatedUserData.conversations];
        const existingConversationIndex = conversations.findIndex((conversation) => conversation.id === newConversation.id);
        if (existingConversationIndex !== -1) {
          // Conversation exists, update it
          conversations[existingConversationIndex] = { ...newConversation, updatedAt: Date.now() };
          // Check if the updated conversation is for the selected contact
          if (selectedContactInfo && selectedContactInfo.conversations[0].id === newConversation.id) {
            setSelectedContactInfo((prevSelectedContactInfo) => ({
              ...prevSelectedContactInfo,
              conversations: [conversations[existingConversationIndex]] // Update selectedContactInfo with the updated conversation
            }));
          }
        } else {
          // New conversation, add it
          newConversation.updatedAt = Date.now();
          conversations.unshift(newConversation); // Add the new conversation at the beginning of the array
        }
        updatedUserData.conversations = conversations.sort((a, b) => b.updatedAt - a.updatedAt); // Sort conversations by updatedAt in descending order
        return updatedUserData;
      });
    };
  
    const sendMessage = () => {
      AsyncStorage.getItem('token').then((value) => {
        const payload = {
          userId: userData.id, // L'ID de l'utilisateur connecté
          data: messageContent, // Le contenu du message saisi par l'utilisateur
          conversationId: selectedConversationId // Use selected conversation ID
        };
  
        axios.post(`http://${process.env.REACT_APP_API_URL}/messages`, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + value,
          }
        })
          .then((response) => {
            // Traitement des données de réponse si nécessaire
            console.log('Message envoyé avec succès');
            // Réinitialiser le champ de saisie de texte
            setMessageContent('');
          })
          .catch((error) => {
            // Gérer les erreurs de requête si nécessaire
            console.error('Erreur lors de l envoi du message', error);
          });
      });
    };
  
    const setSelectedContact = (contact) => {
      setSelectedContactInfo(contact);
      const selectedConversation = userData.conversations.find(conversation => conversation.contactId === contact.id);
      if (selectedConversation) {
        setSelectedConversationId(selectedConversation.id);
        setSelectedContactMessages(selectedConversation.messages);
      } else {
        setSelectedConversationId(null);
        setSelectedContactMessages([]);
      }
    };
      
    return (
        <div className='flex'>
            <div className="flex flex-col bg-slate-100 max-w-sm h-screen px-2">
                <p className='font-sans text-2xl my-2'>Discutions</p>
                <CreateConversationButton updateConversations={updateConversations}/>
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" placeholder="Search..." required/>
                    <button type="submit" className="text-black absolute right-2.5 bottom-2.5 bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
                </div>
                {userData && (
                    <div className="flex- overflow-auto rounded-lg place-items-center h-full">
                        {userData.contacts
                        .filter(contact => {
                            // Vérifier si l'utilisateur a des conversations avec le contact
                            const conversations = userData.conversations || [];
                            return conversations.some(conversation => conversation.contactId === contact.id);
                        })
                        .sort((a, b) => b.updatedAt - a.updatedAt) // Sort conversations by updatedAt in descending order
                        .map(contact => {
                            // Récupérer les conversations de l'utilisateur avec le contact
                            const conversations = userData.conversations || [];
                            const contactConversations = conversations.filter(conversation => conversation.contactId === contact.id);
                            return (
                            <div className="flex flex-row shadow-inner p-2" key={contact.id}   onClick={() => setSelectedContact(contact)}
                            >
                                <img className="h-1/6 w-1/6" src={profile} alt="Profile" />
                                <div className="ml-8 flex flex-col">
                                <div className="flex flex-row">
                                    <p>{contact.firstName}&nbsp;</p>
                                    <p>{contact.lastName}</p>
                                </div>
                                <div className="truncate" style={{ width: '200px' }}>
                                    {contactConversations
                                    .reverse()
                                    .map(conversation => (
                                    <p
                                        key={conversation.id}
                                        style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                        }}
                                    >
                                     {conversation.message}
                                    </p>
                                    ))}
                                </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                    )}

            </div>

            <div className="flex flex-col w-3/4 relative mx-4 bg-slate-100">
                    <div className='flex h-20 border-4 border-black'>
                        {selectedContactInfo && (
                        <><img className='h-full w-auto' src={profile} alt="Profile" />
                        <div className='flex flex-row justify-between'>
                            <p>{selectedContactInfo.firstName}</p>
                            <p>{selectedContactInfo.lastName}</p>
                            {/* Autres informations du contact */}
                        </div></>
                        )}

                    </div>
                    {selectedContactInfo && selectedContactMessages.length > 0 && (
          <div className="flex-grow overflow-hidden border-4 border-yellow-500 h-fit">
            <div className="flex flex-col-reverse">
              {selectedContactMessages.map((message) => (
                <div
                  key={message.id}
                  className={`self-${message.senderId === userData.id ? 'end' : 'start'} bg-${message.senderId === userData.id ? 'blue-500' : 'gray-200'} text-white p-2 rounded-lg m-2`}
                >
                  {message.data}
                </div>
              ))}
            </div>
          </div>
        )}
                    

                                    
                    <div className="absolute bottom-0 left-0 flex flex-row w-full space-between border-4 border-green-500">
                    <input
                        type="text"
                        placeholder="Entrez votre message"
                        className="w-full h-full"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                    />
                    <div>
                    <button className="px-4 py-2 bg-blue-500 text-white" onClick={sendMessage}>
                        Envoyer
                    </button>
                    </div>
                </div>
            </div>
            

        </div>
    )
}

export default Messenger;

