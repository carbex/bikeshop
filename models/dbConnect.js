const mongoose = require('mongoose');
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
mongoose.connect(`mongodb+srv://mongodb+srv://${dbUser}:${dbPass}@cluster0.yxvzo.mongodb.net/bikeshop?retryWrites=true&w=majority`,
  { connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

