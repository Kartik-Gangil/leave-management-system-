const express = require('express');
const cors = require('cors');
const UserRouter = require('./Routes/UserRoute.js')
const LeaveRouter = require('./Routes/LeaveRoute.js')


const app = express()
const PORT = 8000;
app.use(express.json())
app.use(cors())

app.use('/api', UserRouter);
app.use('/api', LeaveRouter);




app.listen(PORT, () => console.log(`server is listen on ${PORT}`))