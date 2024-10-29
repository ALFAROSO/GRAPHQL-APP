import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Input, Button, Select, message } from 'antd';
import './componentsCSS/CarFormCSS.css';

const ADD_CAR = gql`
  mutation AddCar($year: String!, $make: String!, $model: String!, $price: String!, $personId: ID!) {
    addCar(year: $year, make: $make, model: $model, price: $price, personId: $personId) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

const GET_PEOPLE = gql`
  query GetPeople {
    people {
      id
      firstName
      lastName
      cars {
        id
        year
        make
        model
        price
      }
    }
  }
`;

const CarForm = ({ people }) => {
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [personId, setPersonId] = useState('');
  const [addCar] = useMutation(ADD_CAR, {
    onError: (error) => {
      message.error(`Error: ${error.message}`);
    },
    onCompleted: () => {
      message.success('Car added successfully');
    },
    optimisticResponse: {
      addCar: {
        __typename: "Car",
        id: Math.floor(Math.random() * 10000).toString(), // Temporary ID
        // year: parseInt(year),
        year,
        make,
        model,
        // price: parseFloat(price),
        price,
        personId,
      },
    },
    update: (cache, { data: { addCar } }) => {
      const { people } = cache.readQuery({ query: GET_PEOPLE });
      const updatedPeople = people.map(person => {
        if (person.id === addCar.personId) {
          return {
            ...person,
            cars: [...person.cars, addCar],
          };
        }
        return person;
      });
      cache.writeQuery({
        query: GET_PEOPLE,
        data: { people: updatedPeople },
      });
    },
  });

  const handleSubmit = () => {
    addCar({ variables: { year, make, model, price, personId } });
    setYear('');
    setMake('');
    setModel('');
    setPrice('');
    setPersonId('');
  };

  return (
    <div className="form-wrapper">
      <div className="title-container">
        <hr className="line" />
        <h2 className="centered-title">Add Car</h2>
        <hr className="line" />
      </div>
      <div className="form-container">
        <div className="form-item">
          <label>Year:</label>
          <Input
            value={year}
            onChange={e => setYear(e.target.value)}
            placeholder="Year"
          />
        </div>
        <div className="form-item">
          <label>Make:</label>
          <Input
            value={make}
            onChange={e => setMake(e.target.value)}
            placeholder="Make"
          />
        </div>
        <div className="form-item">
          <label>Model:</label>
          <Input
            value={model}
            onChange={e => setModel(e.target.value)}
            placeholder="Model"
          />
        </div>
        <div className="form-item">
          <label>Price:</label>
          <Input
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Price"
          />
        </div>
        <div className="form-item">
          <label>Person:</label>
          <Select
            value={personId}
            onChange={value => setPersonId(value)}
            placeholder="Select Person"
            style={{ width: 200 }}
          >
            {people.map(person => (
              <Select.Option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </Select.Option>
            ))}
          </Select>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={!year || !make || !model || !price || !personId}
        >
          Add Car
        </Button>
      </div>
    </div>
  );
};

export default CarForm;