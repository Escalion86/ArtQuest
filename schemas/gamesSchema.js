import mongoose from 'mongoose'

// var Levels = new mongoose.Schema({
//   type: Map,
// });

const gamesSchema = {
  name: {
    type: String,
    required: [true, 'Введите название игры'],
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  dateStart: {
    type: Date,
    default: null,
  },
  dateEnd: {
    type: Date,
    default: null,
  },
  tasks: [
    {
      title: {
        type: String,
        required: [true, 'Введите название уровня'],
        default: '',
      },
      task: {
        type: String,
        default: '',
      },
      clues: [
        {
          clue: {
            type: String,
            default: '',
          },
          images: {
            type: [String],
            default: [],
          },
        },
      ],
      images: {
        type: [String],
        default: [],
      },
    },
  ],
  // {
  //     type: [Levels],
  //   }
  status: {
    type: String,
    default: 'active',
  },
}

export default gamesSchema
