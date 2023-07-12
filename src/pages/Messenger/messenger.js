import { useEffect, useState } from 'react';
import profile from '../../assets/profile.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

const Messenger = () => {
    const [userData, setUserData] = useState(null);


    useEffect(() => {
        AsyncStorage.getItem('token').then((value) => {
            axios.get(`http://${process.env.REACT_APP_API_URL}/users/me`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + value,
                }
            }).then(r => {
                console.log(r.data)
                setUserData(r.data)
            }).catch(e => {
                console.log('Erreur =>', e.response)
            })
        });
    }, []);

    return (
        <div className='flex'>
            <div className="flex flex-col bg-slate-100 max-w-sm h-screen px-2">
                <p className='font-sans text-2xl my-2'>Discutions</p>
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
                <div className="flex- overflow-auto rounded-lg place-items-center">
                    {userData.contacts
                    .filter(contact => contact.messages && contact.messages.length > 0) // Filter contacts with messages
                    .map(contact => (
                        <div className='flex flex-row shadow-inner p-2' key={contact.id}>
                        <img className='h-1/6 w-1/6' src={profile} alt="Profile" />
                        <div className='ml-8 flex flex-col'>
                            <div className='flex flex-row'>
                            <p>{contact.firstName}&nbsp;</p>
                            <p>{contact.lastName}</p>
                            </div>
                            <div className='truncate' style={{ width: '200px' }}>
                            {contact.messages.map(message => (
                                <p
                                key={message.id}
                                style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                                >
                                {message.data}
                                </p>
                            ))}
                            </div>
                        </div>
                        </div>
                    ))}
                </div>
                )}
            </div>

            <div className="flex flex-col w-3/4 relative mx-4 bg-slate-100">
                {userData &&
                
                    <div className='flex h-20'>
                    <img className='h-full w-auto' src={profile} alt="Profile" />
                    <div className='flex flex-col justify-between'>
                        <p>{userData.firstName}</p>
                        <p>{userData.lastName}</p>
                        <p>En ligne</p>
                    </div>
                    </div>
                }
                
                <div className="absolute bottom-0 left-0 flex flex-row w-full space-between">
                    <div className='w-full'>
                        <input
                        type="text"
                        placeholder="Entrez votre message"
                        className='w-fit'
                        />
                    </div>
                    <div>
                        <button className="px-4 py-2 bg-blue-500 text-white">Envoyer</button>
                    </div>
                </div>
            </div>
            

        </div>
    )
}

export default Messenger;

