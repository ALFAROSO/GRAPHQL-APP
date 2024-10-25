import React from 'react';
import PersonForm from '../components/PersonForm';
import CarForm from '../components/CarForm';
import PersonCard from '../components/PersonCard';
import { useQuery, gql } from '@apollo/client';

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

const Home = () => {
  const { loading, error, data } = useQuery(GET_PEOPLE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>PEOPLE AND THEIR CARS</h1>
      <hr style={{ width: '90%', margin: '0 auto', borderColor: '#f2f0f0', borderWidth: '1px' }} />
      <br />
      <br />
      <PersonForm />
      <br />
      <br />

      {data.people.length > 0 && <CarForm people={data.people} />}
      <br />
      <br />
      <div className="title-container">
        <hr className="line" />
        <h2 className="centered-title">Records</h2>
        <hr className="line" />
      </div>
      <br />
      <br />
      {data.people.map(person => (

        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  );
};

export default Home;
