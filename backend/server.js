import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import { Category } from './models/Category.js';
import authRoutes from './routes/auth.js';
import habitsRoutes from './routes/Habits.js';
import categoryRoutes from './routes/categoryRoutes.js';
import passwordRoutes from './routes/password.js';
import interestRoutes from './routes/interestRoute.js';
import contactRoutes from './routes/contactFeedback.js';
import accountsettting from './routes/accountSetting.js';
import suggestions from './routes/suggestroute.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/account-setting', accountsettting);
app.use('/api/suggesthabit', suggestions);

const PORT = process.env.PORT || 5000;

const DEFAULT_CATEGORIES = [
  'Health & Fitness',
  'Productivity',
  'Hobbies',
  'Learning',
  'Mindfulness',
  'Finance',
  'Social',
  'Career',
];

const seedDefaultCategories = async () => {
  await Category.bulkWrite(
    DEFAULT_CATEGORIES.map((categoryName) => ({
      updateOne: {
        filter: { categoryName },
        update: { $setOnInsert: { categoryName } },
        upsert: true,
      },
    }))
  );
  console.log('Default categories are ready');
};

connectDB()
  .then(() => {
    return seedDefaultCategories();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

