import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddContactButton = ({ onContactAdded }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [userData, setUserData] = useState(null);
  const contactSchema = Yup.object().shape({
    email: Yup.string().email('Email invalide').required('Champ requis'),
    phoneNumber: Yup.string().required('Champ requis'),
    lastName: Yup.string().required('Champ requis'),
    firstName: Yup.string().required('Champ requis'),
  });

  const handleCreateContact = (values, setSubmitting, closeModal) => {
    const { firstName, lastName, phoneNumber, email } = values;
    if (userData) {
      axios
        .post(`http://${process.env.REACT_APP_API_URL}/contacts`, {
          userId: userData.id,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          email: email,
        })
        .then((response) => {
          console.log('Contact créé avec succès !', response.data);
          closeModal();
          onContactAdded(response.data);
        })
        .catch((error) => {
          console.log(error);
          console.log('Erreur lors de la création du contact', error.response);
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
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
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={openModal}
      >
        Ajouter un contact
      </button>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white w-1/2 p-4 rounded h-screen overflow-auto border-4 border-black">
            <h2 className="text-xl font-bold mb-4">Ajouter un contact</h2>
            <Formik
              initialValues={{
                email: '',
                phoneNumber: '',
                lastName: '',
                firstName: '',
              }}
              validationSchema={contactSchema}
              onSubmit={(values, { setSubmitting }) => {
                handleCreateContact(values, setSubmitting, closeModal);
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="flex flex-col">
                    <label htmlFor="email">Email</label>
                    <Field type="email" name="email" className="w-full border p-2 mb-2" />
                    <ErrorMessage name="email" component="div" className="text-red-500" />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="phoneNumber">Numéro de téléphone</label>
                    <Field type="text" name="phoneNumber" className="w-full border p-2 mb-2" />
                    <ErrorMessage name="phoneNumber" component="div" className="text-red-500" />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="lastName">Nom</label>
                    <Field type="text" name="lastName" className="w-full border p-2 mb-2" />
                    <ErrorMessage name="lastName" component="div" className="text-red-500" />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="firstName">Prénom</label>
                    <Field type="text" name="firstName" className="w-full border p-2 mb-2" />
                    <ErrorMessage name="firstName" component="div" className="text-red-500" />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      disabled={isSubmitting}
                    >
                      Ajouter
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Annuler
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddContactButton;
