const path = require('path')
const express = require('express')
const cors = require('cors')

const ___dirname = path.resolve();

require('dotenv').config()

const authRouter = require('./routes/auth.routes')
const oauthRouter = require('./routes/oauth.routes')
const mailRouter = require('./routes/mail.routes')
const userRouter = require('./routes/user.routes')
const videosRouter = require('./routes/videos.routes')
const connectionsRouter = require('./routes/connections.routes')
const followsRouter = require('./routes/follows.routes')
const { verrifyGoogleTokens } = require('./middlewares/google-oauth.middleware')
const { authentication, authenticatedOnly } = require('./middlewares/auth.middleware')

const app = express()
const port = process.env.PORT || 8080


const corsMiddleware = cors({
    origin: '*',
    allowedHeaders: ['Content-Type','contenttype', 'Authorization', 'Authentication'],
})

app.set('emailsViews', path.resolve(__dirname, 'EmailTemplates'))
app.enable('trust proxy')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ msg: 'something wrong' })
})

app.use(corsMiddleware)
app.options('*', corsMiddleware)

// Authentication Checker
app.use(authentication)

// app.get('/', (req, res) => {
//     res.json({ message: 'genius-park-api' })
// })

app.use('/oauth/', oauthRouter)
app.use('/api/auth', authRouter)
app.use('/api/mail', mailRouter)
app.use('/api/videos', authenticatedOnly, verrifyGoogleTokens, videosRouter)
app.use('/api/user', authentication,authenticatedOnly, verrifyGoogleTokens, userRouter)
app.use('/api/connections', authenticatedOnly, connectionsRouter)
app.use('/api/follows', authenticatedOnly, followsRouter)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(___dirname, "/front-end/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(___dirname, "front-end", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
