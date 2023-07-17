import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import home from '../../assets/home.png'

const Home = () => {
    const [userData, setUserData] = useState(null);

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

    let sortedConversations = [];
    if (userData && userData.conversations) {
      sortedConversations = userData.conversations.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
    
    // Récupération de la conversation la plus récente
    const latestConversation = sortedConversations[0];

    return (
        <div className="flex-col justify-between space-y-1 lg:flex-col sm:flex-row place-content-center overflow-scroll bg-white h-screen ">
                <div className="border border-white radius-for-skewed p-2 m-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4 pt-12 ">
                        <div className="p-4 flex flex-col items-center justify-center w-full ">
                            <div className="w-full text-center lg:text-left">
                                <div className="max-w-sm mx-auto">
                                    <h2 className="flex mb-6 text-4xl lg:text-5xl font-bold font-heading ">
                                        <p className="text-black">Tableau de bord</p>
                                    </h2>
                                </div>
                                <div className="max-w-sm mx-auto ">
                                <p className="mb-6 leading-loose text-black">Retrouver l'intégralité de vos échanges</p>
                                    <div className='lg:flex flex-row'>
                                    {userData && (
                                    <div className='bg-gray-100 border-2 border-black rounded-lg p-4 m-8'>
                                         <a
                                            className="inline-block mb-3 lg:mb-0 lg:mr-3 w-full lg:w-auto py-2 px-6 leading-loose bg-grey-200  text-black font-semibold rounded-l-xl rounded-t-xl transition duration-200"
                                            href="/messenger"
                                            >
                                            Vos contacts 
                                            </a>
                                        {userData.contacts.map((contact) => (
                                        <div key={contact.id}>
                                           
                                            <p>{contact.firstName} {contact.lastName}</p>
                                        </div>
                                        ))}
                                    </div>
                                    )}

                                    {userData && (
                                    <div className='border-2 border-black rounded-lg p-4 m-8 bg-gray-100'>
                                         <a
                                            className=" inline-block mb-3 lg:mb-0 lg:mr-3 w-full lg:w-auto py-2 px-6 leading-loose bg-grey-200  text-black font-semibold rounded-l-xl rounded-t-xl transition duration-200"
                                            href="/messenger"
                                            >
                                            Votre dernière discution 
                                            </a>
                                        <p>{latestConversation.name}</p>
                                    </div>
                                    )}
                                    </div>
                                   
                                    
                                    <div>
                                        <a className="inline-block mb-3 lg:mb-0 lg:mr-3 w-full lg:w-auto py-2 px-6 leading-loose bg-green-600 hover:bg-green-700 text-white font-semibold rounded-l-xl rounded-t-xl transition duration-200" href="/messenger">Vos discutions</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 flex flex-col items-center justify-center w-full">
                        <img className="rounded-t-xl h-fit w-fit" src={home} alt="Profile" />

                        </div>

                    </div>
                </div>
            </div>
    )
}

export default Home;