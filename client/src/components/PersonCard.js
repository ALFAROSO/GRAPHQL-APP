import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Card, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CarCard from './CarCard';
import { Link } from 'react-router-dom';
import './componentsCSS/PersonCard.css';

const UPDATE_PERSON = gql`
  mutation UpdatePerson($id: ID!, $firstName: String!, $lastName: String!) {
    updatePerson(id: $id, firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

const DELETE_PERSON = gql`
  mutation DeletePerson($id: ID!) {
    deletePerson(id: $id) {
      id
    }
  }
`;

const PersonCard = ({ person }) => {
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(person.firstName);
  const [lastName, setLastName] = useState(person.lastName);

  const [updatePerson] = useMutation(UPDATE_PERSON, {
    optimisticResponse: {
      updatePerson: {
        __typename: 'Person',
        id: person.id,
        firstName: firstName,
        lastName: lastName,
      },
    },
  });

  const [deletePerson] = useMutation(DELETE_PERSON, {
    update(cache) {
      cache.modify({
        fields: {
          people(existingPeople = [], { readField }) {
            return existingPeople.filter(
              personRef => readField('id', personRef) !== person.id
            );
          },
        },
      });
    },
    optimisticResponse: {
      deletePerson: {
        __typename: 'Person',
        id: person.id,
      },
    },
  });

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    updatePerson({ variables: { id: person.id, firstName, lastName } })
      .then(() => {
        setEditMode(false);
      })
      .catch(error => {
        console.error('Error updating person:', error);
      });
  };

  const handleCancel = () => {
    setFirstName(person.firstName);
    setLastName(person.lastName);
    setEditMode(false);
  };

  const handleDelete = () => {
    deletePerson({ variables: { id: person.id } })
      .then(() => {
        console.log('Person deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting person:', error);
      });
  };

  return (
    <div>
      <Card title={`${person.firstName} ${person.lastName}`}>
        {editMode ? (
          <div>
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
            <br />
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
            <br />
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        ) : (
          <div>
            {person.cars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
            <Link to={`/people/${person.id}`}>Learn More</Link>
            <br />
            <div className="icon-container">
              <div className="icon-item">
                <Tooltip title="Edit Person">
                  <EditOutlined onClick={handleEdit} style={{ fontSize: '14px', cursor: 'pointer' }} />
                </Tooltip>
              </div>
              <div className="icon-item">
                <Tooltip title="Delete Person">
                  <DeleteOutlined onClick={handleDelete} style={{ fontSize: '14px', cursor: 'pointer', color: 'red' }} />
                </Tooltip>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PersonCard;
