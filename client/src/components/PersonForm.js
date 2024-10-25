import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Input, Button } from 'antd';
import './componentsCSS/PersonForm.css';

const ADD_PERSON = gql`
  mutation AddPerson($firstName: String!, $lastName: String!) {
    addPerson(firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

const PersonForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [addPerson] = useMutation(ADD_PERSON, {
    update(cache, { data: { addPerson } }) {
      cache.modify({
        fields: {
          people(existingPeople = []) {
            const newPersonRef = cache.writeFragment({
              data: addPerson,
              fragment: gql`
                fragment NewPerson on Person {
                  id
                  firstName
                  lastName
                }
              `
            });
            return [...existingPeople, newPersonRef];
          }
        }
      });
    }
  });

  const handleSubmit = () => {
    addPerson({ variables: { firstName, lastName } });
    setFirstName('');
    setLastName('');
  };

  return (
    <div className="form-wrapper">
      <div className="title-container">
        <hr className="line" />
        <h2 className="centered-title">Add Person</h2>
        <hr className="line" />
      </div>
      <div className="form-container">
        <div className="form-item">
          <label className="required">First Name:</label>
          <Input
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder="First Name"
          />
        </div>
        <div className="form-item">
          <label className="required">Last Name:</label>
          <Input
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!firstName || !lastName}
        >
          Add Person
        </Button>
      </div>
    </div>
  );
};

export default PersonForm;
