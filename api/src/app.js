require(`babel-core/register`);

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import config from './config';
import User from './models/user';
import Gallery from './models/gallery';
import router from './router';
import socketIO from 'socket.io';
import { Server } from 'http';
import crypto from 'crypto';

let app = express();

let http = Server(app);
let io = socketIO(http);

let port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set(`superSecret`, config.secret);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan(`dev`));

app.post(`/signup`, (req, res) => {
  let { username, password } = req.body;

  if (username && password) {
    User.findOne({ username }, (err, user) => {
      if (err) throw err;
      if (user)
        res.json({
          success: false,
          message: `User with this username already exists.`,
        });
      else {
        const hash = crypto
          .createHmac('sha256', config.secret)
          .update(password)
          .digest('hex');

        let user = new User({ username, password: hash });

        if (username === `admin`) user.admin = true;

        user.save(err => {
          if (err) throw err;
          res.json({ success: true });
        });
      }
    });
  } else
    res.json({
      success: false,
      message: `Must provide username and password.`,
    });
});

io.on(`connection`, socket => {
  app.use('/api', router({ app, socket, io }));

  socket.on(`ui:newsignup`, ({ username }) => {
    io.emit(`api:newsignup`, username);
  });

  socket.on(`ui:setGalleryColor`, ({ color, _id }) => {
    Gallery.findOne({ _id }, (err, gallery) => {
      if (gallery) {
        gallery.color = `#${color.hex}`;

        gallery.save((err, gallery) => {
          io.emit(`api:updateGallery`, gallery);
        });
      }
    });
  });

  socket.on(`ui:togglePublic`, ({ _id }) => {
    Gallery.findOne({ _id }, (err, gallery) => {
      if (gallery) {
        gallery.public = !gallery.public;

        gallery.save((err, gallery) => {
          io.emit(`api:updateGallery`, gallery);
        });
      }
    });
  });
});

http.listen(port, () => {
  console.log(`☆ listening on localhost:${port}`);
});
