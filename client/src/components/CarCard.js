import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Card, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './componentsCSS/CarCard.css';

const UPDATE_CAR = gql`
  mutation UpdateCar($id: ID!, $year: String!, $make: String!, $model: String!, $price: String!) {
    updateCar(id: $id, year: $year, make: $make, model: $model, price: $price) {
      id
      year
      make
      model
      price
    }
  }
`;

const DELETE_CAR = gql`
  mutation DeleteCar($id: ID!) {
    deleteCar(id: $id) {
      id
    }
  }
`;

const CarCard = ({ car }) => {
  const [editMode, setEditMode] = useState(false);
  const [year, setYear] = useState(car.year);
  const [make, setMake] = useState(car.make);
  const [model, setModel] = useState(car.model);
  const [price, setPrice] = useState(car.price);

  const [updateCar] = useMutation(UPDATE_CAR, {
    optimisticResponse: {
      updateCar: {
        __typename: 'Car',
        id: car.id,
        year: year,
        make: make,
        model: model,
        price: price,
      },
    },
  });

  const [deleteCar] = useMutation(DELETE_CAR, {
    update(cache) {
      cache.modify({
        fields: {
          cars(existingCars = [], { readField }) {
            return existingCars.filter(
              carRef => readField('id', carRef) !== car.id
            );
          },
        },
      });
    },
    optimisticResponse: {
      deleteCar: {
        __typename: 'Car',
        id: car.id,
      },
    },
  });

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    updateCar({ variables: { id: car.id, year, make, model, price } })
      .then(() => {
        setEditMode(false);
      })
      .catch(error => {
        console.error('Error updating car:', error);
      });
  };

  const handleCancel = () => {
    setYear(car.year);
    setMake(car.make);
    setModel(car.model);
    setPrice(car.price);
    setEditMode(false);
  };

  const handleDelete = () => {
    deleteCar({ variables: { id: car.id } })
      .then(() => {
        console.log('Car deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting car:', error);
      });
  };

  return (
    <Card type="inner" title={`${year} ${make} ${model} -> ${price}`}>
      {editMode ? (
        <div>
          <label>Year:</label>
          <input
            type="number"
            value={year}
            onChange={e => setYear(e.target.value)}
          />
          <br />
          <label>Make:</label>
          <input
            type="text"
            value={make}
            onChange={e => setMake(e.target.value)}
          />
          <br />
          <label>Model:</label>
          <input
            type="text"
            value={model}
            onChange={e => setModel(e.target.value)}
          />
          <br />
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
          <br />
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </div>
      ) : (
        <div className="icon-container">
          <div className="icon-item">
            <Tooltip title="Edit Car">
              <EditOutlined onClick={handleEdit} style={{ fontSize: '14px', cursor: 'pointer' }} />
            </Tooltip>
          </div>
          <div className="icon-item">
            <Tooltip title="Delete Car">
              <DeleteOutlined onClick={handleDelete} style={{ fontSize: '14px', cursor: 'pointer', color: 'red' }} />
            </Tooltip>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CarCard;
