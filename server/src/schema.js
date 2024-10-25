import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';



let people = [
    {
      id: '1',
      firstName: 'Bill',
      lastName: 'Gates'
    },
    {
      id: '2',
      firstName: 'Steve',
      lastName: 'Jobs'
    },
    {
      id: '3',
      firstName: 'Linux',
      lastName: 'Torvalds'
    }
]
  
let cars = [
    {
      id: '1',
      year: '2019',
      make: 'Toyota',
      model: 'Corolla',
      price: '40000',
      personId: '1'
    },
    {
      id: '2',
      year: '2018',
      make: 'Lexus',
      model: 'LX 600',
      price: '13000',
      personId: '1'
    },
    {
      id: '3',
      year: '2017',
      make: 'Honda',
      model: 'Civic',
      price: '20000',
      personId: '1'
    },
    {
      id: '4',
      year: '2019',
      make: 'Acura ',
      model: 'MDX',
      price: '60000',
      personId: '2'
    },
    {
      id: '5',
      year: '2018',
      make: 'Ford',
      model: 'Focus',
      price: '35000',
      personId: '2'
    },
    {
      id: '6',
      year: '2017',
      make: 'Honda',
      model: 'Pilot',
      price: '45000',
      personId: '2'
    },
    {
      id: '7',
      year: '2019',
      make: 'Volkswagen',
      model: 'Golf',
      price: '40000',
      personId: '3'
    },
    {
      id: '8',
      year: '2018',
      make: 'Kia',
      model: 'Sorento',
      price: '45000',
      personId: '3'
    },
    {
      id: '9',
      year: '2017',
      make: 'Volvo',
      model: 'XC40',
      price: '55000',
      personId: '3'
    }
]


const typeDefs = gql`
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    cars: [Car]
  }

  type Car {
    id: ID!
    year: String!
    make: String!
    model: String!
    price: String!
    personId: ID!
  }

  type Query {
    people: [Person]
    cars: [Car]
    person(id: ID!): Person
    car(id: ID!): Car
    personWithCars(id: ID!): Person
  }

  type Mutation {
    addPerson(firstName: String!, lastName: String!): Person
    updatePerson(id: ID!, firstName: String, lastName: String): Person
    deletePerson(id: ID!): Person
    addCar(year: String!, make: String!, model: String!, price: String!, personId: ID!): Car
    updateCar(id: ID!, year: String, make: String, model: String, price: String, personId: ID): Car
    deleteCar(id: ID!): Car
}`


const resolvers = {
  Query: {
    people: () => people,
    cars: () => cars,
    person: (_, { id }) => people.find(person => person.id === id),
    car: (_, { id }) => cars.find(car => car.id === id),
    personWithCars: (_, { id }) => {
      const person = people.find(person => person.id === id);
      if (person) {
        person.cars = cars.filter(car => car.personId === person.id);
      }
      return person;
    }
  },

  Mutation: {
    addPerson: (_, { firstName, lastName }) => {
      const newPerson = { id: `${people.length + 1}`, firstName, lastName, cars: [] };
      people.push(newPerson);
      return newPerson;
    },
    updatePerson: (_, { id, firstName, lastName }) => {
      const personIndex = people.findIndex(person => person.id === id);
      if (personIndex > -1) {
        const updatedPerson = { ...people[personIndex], firstName, lastName };
        people[personIndex] = updatedPerson;
        return updatedPerson;
      }
      return null;
    },
    deletePerson: (_, { id }) => {
      const personIndex = people.findIndex(person => person.id === id);
      if (personIndex > -1) {
        const [deletedPerson] = people.splice(personIndex, 1);
        cars = cars.filter(car => car.personId !== id);
        return deletedPerson;
      }
      return null;
    },
    addCar: (_, { year, make, model, price, personId }) => {
      const newCar = { id: `${cars.length + 1}`, year, make, model, price, personId };
      cars.push(newCar);
      return newCar;
    },
    updateCar: (_, { id, year, make, model, price, personId }) => {
      const carIndex = cars.findIndex(car => car.id === id);
      if (carIndex > -1) {
        const updatedCar = { ...cars[carIndex], year, make, model, price, personId };
        cars[carIndex] = updatedCar;
        return updatedCar;
      }
      return null;
    },
    deleteCar: (_, { id }) => {
      const carIndex = cars.findIndex(car => car.id === id);
      if (carIndex > -1) {
        return cars.splice(carIndex, 1)[0];
      }
      return null;
    }
  },

  Person: {
    cars: (person) => cars.filter(car => car.personId === person.id)
  }
};

export { typeDefs, resolvers };