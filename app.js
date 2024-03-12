// const express = require('express');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const jwt = require('jsonwebtoken');
// const cors = require('cors'); // Import the cors middleware

// const app = express();
// const PORT = 5201;

// // Connect to MongoDB (replace with your MongoDB connection string)
// mongoose.connect('mongodb://127.0.0.1:27017/Authentication2', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// const userSchema = new mongoose.Schema({
//     username: String,
//     password: String,
// });

// const User = mongoose.model('users', userSchema);

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({ origin: 'http://localhost:3003', credentials: true })); // Configure CORS

// app.post('/register', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         // Check if the username is already taken
//         const existingUser = await User.findOne({ username });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Username is already taken' });
//         }

//         // Create a new user
//         const newUser = new User({ username, password });
//         await newUser.save();

//         // Respond with success
//         res.json({ message: 'User registered successfully' });
//     } catch (error) {
//         console.error('Error registering user:', error.message);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });


// // User login
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const user = await User.findOne({ username, password });

//         if (!user) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         const userId = user._id;
//         const accessToken = jwt.sign({ userId }, 'your-secret-key', { expiresIn: '15m' });
//         const refreshToken = jwt.sign({ userId }, 'your-refresh-secret-key');

//         res.cookie('accessToken', accessToken, { httpOnly: true });
//         res.json({ accessToken });
//     } catch (error) {
//         console.error('Error logging in:', error.message);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

// // User logout
// app.post('/logout', (req, res) => {
//     res.clearCookie('accessToken');
//     res.json({ message: 'Logout successful' });
// });

// // Protect routes with middleware to validate the access token
// const authenticateToken = async (req, res, next) => {
//     const accessToken = req.cookies.accessToken;

//     if (!accessToken) {
//         return res.sendStatus(401);
//     }

//     try {
//         const decoded = jwt.verify(accessToken, 'your-secret-key');
//         req.user = decoded;
//         next();
//     } catch (error) {
//         console.error('Error verifying access token:', error.message);
//         res.sendStatus(403);
//     }
// };

// // Example protected route
// app.get('/protected-route', authenticateToken, (req, res) => {
//     res.json({ message: 'This is a protected route' });
// });

// app.get('/check-login', authenticateToken, (req, res) => {
//     res.json({ isLoggedIn: true });
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });



// ###############################################################################################################







// const express = require('express');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const cors = require('cors');

// const app = express();
// const PORT = 5201;

// mongoose.connect('mongodb://127.0.0.1:27017/Authentication2', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// const userSchema = new mongoose.Schema({
//     username: String,
//     password: String,
//     refreshToken: String, // Store refresh token in the database
// });

// const User = mongoose.model('users', userSchema);

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({ origin: 'http://localhost:3003', credentials: true }));


// const authenticateToken = async (req, res, next) => {
//     const accessToken = req.cookies.accessToken;

//     if (!accessToken) {
//         return res.sendStatus(401);
//     }

//     try {
//         const decoded = jwt.verify(accessToken, 'your-secret-key');
//         req.user = decoded;
//         next();
//     } catch (error) {
//         console.error('Error verifying access token:', error.message);
//         res.sendStatus(403);
//     }
// };

// app.post('/register', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const existingUser = await User.findOne({ username });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Username is already taken' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ username, password: hashedPassword });
//         await newUser.save();

//         res.json({ message: 'User registered successfully' });
//     } catch (error) {
//         console.error('Error registering user:', error.message);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const user = await User.findOne({ username });

//         if (!user || !await bcrypt.compare(password, user.password)) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         // Invalidate existing tokens
//         await User.updateOne({ username }, { $set: { refreshToken: null } });

//         const userId = user._id;
//         const accessToken = jwt.sign({ userId }, 'your-secret-key', { expiresIn: '15m' });
//         const refreshToken = jwt.sign({ userId }, 'your-refresh-secret-key');

//         // Store the new refresh token in the database
//         await User.updateOne({ username }, { $set: { refreshToken } });

//         res.cookie('accessToken', accessToken, { httpOnly: true });
//         res.json({ accessToken });
//     } catch (error) {
//         console.error('Error logging in:', error.message);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

// app.post('/logout', authenticateToken, async (req, res) => {
//     const username = req.body.username;

//     // Invalidate refresh token on logout
//     await User.updateOne({ username }, { $set: { refreshToken: null } });

//     res.clearCookie('accessToken');
//     res.json({ message: 'Logout successful' });
// });

// const getUsernameFromRequest = (req) => {
//     return req.body.username;
// };

// app.get('/check-login', authenticateToken, (req, res) => {
//     res.json({ isLoggedIn: true });
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


// ##############################################################


// const express = require('express');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const cors = require('cors');
// const http = require('http');
// const socketIO = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// // const io = socketIO(server); // Attach Socket.IO to the HTTP server
// const io = socketIO(server, {
//     cors: {
//         origin: "http://localhost:3003",  // Allow connections only from this origin
//         methods: ["GET", "POST"]
//     }
// });

// const PORT = 5201;

// mongoose.connect('mongodb://127.0.0.1:27017/Authentication2', {
//     useNewUrlParser: true,
//     // useUnifiedTopology: true,
// });

// const userSchema = new mongoose.Schema({
//     username: String,
//     password: String,
//     refreshToken: String,
//     socketId: String,
// });

// const User = mongoose.model('users', userSchema);

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//     origin: 'http://localhost:3003',
//     credentials: true,
// }));

// // Middleware to authenticate user based on token
// const authenticateToken = async (req, res, next) => {
//     const accessToken = req.cookies.accessToken;

//     if (!accessToken) {
//         return res.sendStatus(401);
//     }

//     try {
//         const decoded = jwt.verify(accessToken, 'your-secret-key');
//         req.user = decoded;
//         next();
//     } catch (error) {
//         console.error('Error verifying access token:', error.message);
//         res.sendStatus(403);
//     }
// };

// // Socket.io connection handling
// io.on('connection', (socket) => {
//     console.log(`User connected with socket ID: ${socket.id}`);

//     // Attach the io object to the request
//     app.set('io', io);


//     // Handle login event
//     socket.on('login', async (data) => {
//         const { username } = data;

//         // Find user by username
//         const user = await User.findOne({ username });

//         // If the user is found, update the socketId
//         if (user) {
//             await User.updateOne({ username }, { $set: { socketId: socket.id } });
//         }
//     });

//     // Handle logout event
//     socket.on('logout', async (data) => {
//         const { username } = data;

//         // Find user by username and clear socketId
//         await User.updateOne({ username }, { $set: { socketId: null } });
//     });

//     // Handle disconnect event
//     socket.on('disconnect', async () => {
//         console.log(`User disconnected with socket ID: ${socket.id}`);

//         // Clear socketId for the user upon disconnection
//         try {
//             await User.updateOne({ socketId: socket.id }, { $set: { socketId: null } });
//         } catch (err) {
//             console.error('Error updating socketId on disconnect:', err);
//         }
//     });
// });

// // Route to check login status
// app.get('/check-login', authenticateToken, async (req, res) => {
//     const { username } = req.user;

//     // Check if the user is logged in on the current device
//     const user = await User.findOne({ username, socketId: req.socket.id });

//     if (user) {
//         res.json({ isLoggedIn: true });
//     } else {
//         res.json({ isLoggedIn: false });
//     }
// });

// // Route to handle user registration
// app.post('/register', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const existingUser = await User.findOne({ username });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Username is already taken' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ username, password: hashedPassword });
//         await newUser.save();

//         // Assuming you want to automatically log in the user after registration
//         const userId = newUser._id;
//         const accessToken = jwt.sign({ userId }, 'your-secret-key', { expiresIn: '15m' });
//         const refreshToken = jwt.sign({ userId }, 'your-refresh-secret-key');

//         // Store the refresh token in the database
//         await User.updateOne({ username }, { $set: { refreshToken } });

//         res.cookie('accessToken', accessToken, { httpOnly: true });
//         res.json({ message: 'User registered successfully', accessToken });
//     } catch (error) {
//         console.error('Error registering user:', error.message);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

// // Route to handle user login
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const user = await User.findOne({ username });

//         if (!user || !await bcrypt.compare(password, user.password)) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         // Invalidate existing tokens
//         await User.updateOne({ username }, { $set: { refreshToken: null } });

//         const userId = user._id;
//         const accessToken = jwt.sign({ userId }, 'your-secret-key', { expiresIn: '15m' });
//         const refreshToken = jwt.sign({ userId }, 'your-refresh-secret-key');

//         // Access the socket object from the request
//         const socket = req.io;

//         // Store the new refresh token in the database
//         await User.updateOne({ username }, { $set: { refreshToken, socketId: socket.id } });

//         // Notify other devices about the login
//         io.emit('login', { username });

//         res.cookie('accessToken', accessToken, { httpOnly: true });
//         res.json({ accessToken });
//     } catch (error) {
//         console.error('Error logging in:', error.message);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

// // Route to handle user logout
// app.post('/logout', authenticateToken, async (req, res) => {
//     const { username } = req.user;

//     // Notify other devices about the logout
//     io.emit('logout', { username });

//     // Clear socketId and accessToken on the current device
//     await User.updateOne({ username, socketId: req.socket.id }, { $set: { socketId: null } });

//     res.clearCookie('accessToken');
//     res.json({ message: 'Logout successful' });
// });

// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


// ###################################################################################


const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "https://readme-iota-five.vercel.app",  // Replace with your frontend URL
        methods: ["GET", "POST"]
    }
});
const PORT = 5201;

mongoose.connect('mongodb+srv://krushilprolink:Z7IfvNBhWJSiPQVX@cluster0.ym1vfie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    socketId: String,
    // refreshToken: String,
});

const User = mongoose.model('users', userSchema);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'https://readme-iota-five.vercel.app',  // Replace with your frontend URL
    credentials: true,
}));

// Middleware to attach io to req
const attachIoMiddleware = (req, res, next) => {
    req.io = io;  // Attach io to the req object
    next();
};
app.use(attachIoMiddleware);

// Middleware to authenticate user based on token
const authenticateToken = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.sendStatus(401);
    }

    try {
        const decoded = jwt.verify(accessToken, 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verifying access token:', error.message);
        res.sendStatus(403);
    }
};

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log(`User connected with socket ID: ${socket.id}`);

    // // Attach the io object to the request
    // app.set('io', io);
    // socket.request.io = io;

    socket.on('login', async (data) => {
        const { username } = data;
        const user = await User.findOne({ username });

        if (user) {
            await User.updateOne({ username }, { $set: { socketId: socket.id } });
        }
    });

    socket.on('logout', async (data) => {
        const { username } = data;
        await User.updateOne({ username }, { $set: { socketId: null } });
    });

    socket.on('disconnect', async () => {
        console.log(`User disconnected with socket ID: ${socket.id}`);

        try {
            await User.updateOne({ socketId: socket.id }, { $set: { socketId: null } });
        } catch (err) {
            console.error('Error updating socketId on disconnect:', err);
        }
    });
});

app.get('/check-login', authenticateToken, async (req, res) => {
    console.log('Check-login called');
    const { username } = req.user;

    // Check if the user is logged in on the current device
    const user = await User.findOne({ username, socketId: req.socket.id });

    if (user) {
        res.json({ isLoggedIn: true });
    } else {
        res.json({ isLoggedIn: false });
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        // Assuming you want to automatically log in the user after registration
        const userId = newUser._id;
        const accessToken = jwt.sign({ userId }, 'your-secret-key', { expiresIn: '15m' });

        // Store the refresh token in the database
        // const refreshToken = jwt.sign({ userId }, 'your-refresh-secret-key');
        // await User.updateOne({ username }, { $set: { refreshToken } });

        res.cookie('accessToken', accessToken, { httpOnly: true });
        res.json({ message: 'User registered successfully', accessToken });

    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to handle user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the user is already logged in on another device
        if (user.socketId) {
            // Notify the other device (emit a custom event)
            io.to(user.socketId).emit('force-logout', { message: 'User logged in from another device' });
        }

        // Invalidate existing tokens
        await User.updateOne({ username }, { $set: { refreshToken: null } });

        const userId = user._id;
        const accessToken = jwt.sign({ userId }, 'your-secret-key', { expiresIn: '15m' });
        // const refreshToken = jwt.sign({ userId }, 'your-refresh-secret-key');

        // Access the socket object from the request
        const socket = req.io;
        console.log("socket ", socket.id);

        // Store the new refresh token in the database
        // await User.updateOne({ username }, { $set: { refreshToken, socketId: socket.id } });
        await User.updateOne({ username }, { $set: { socketId: socket.id } });

        // Notify other devices about the login
        io.emit('login', { username });

        res.cookie('accessToken', accessToken, { httpOnly: true });
        res.json({ accessToken });
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.post('/logout', async (req, res) => {
    const username = req.body?.username;

    // Notify other devices about the logout
    io.emit('logout', { username });

    // Clear socketId on the current device
    // await User.updateOne({ username, socketId: req.socket.id }, { $set: { socketId: null } });         // req.socket.id  req.io.id - undefined
    await User.updateOne({ username }, { $set: { socketId: null } });

    // res.clearCookie('accessToken');
    res.json({ message: 'Logout successful' });
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
