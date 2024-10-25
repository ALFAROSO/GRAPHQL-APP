import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

const GET_PERSON_WITH_CARS = gql`
  query GetPersonWithCars($id: ID!) {
    personWithCars(id: $id) {
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

const PersonShow = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { personWithCars } = data;

  return (
    <div>
      <h1>{personWithCars.firstName} {personWithCars.lastName}</h1>
      <h2>Cars:</h2>
      {personWithCars.cars.map(car => (
        <div key={car.id} className="car-details">
          <p>MAKE: {car.make} - MODEL: {car.model} - YEAR: {car.year} - PRICE: ${car.price}</p>
        </div>
      ))}
      <Link to="/">Go Back Home</Link>
    </div>
  );
};

export default PersonShow;
