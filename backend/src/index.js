const { ApolloServer, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')
require('dotenv').config()

const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let books = await Book.find({}).populate('author')
      console.log('about to return books', books)
      if (args.author)
        books = books.filter((b) => b.author.name === args.author)
      if (args.genre)
        books = books.filter((b) => b.genres.some((g) => g === args.genre))
      return books
    },

    allAuthors: async () => {
      return Author.find({})
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      console.log('Adding book!', args)
      let author = await Author.findOne({ name: args.author })
      console.log('author from db', author)
      if (!author) {
        author = new Author({ name: args.author })
        console.log('new author', author)
        await author.save()
      }
      const book = new Book({ ...args, author })
      console.log('New book', book)

      return book.save()
    },
    editAuthor: async (root, args) => {
      await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo }
      )
      return await Author.findOne({ name: args.name })
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
