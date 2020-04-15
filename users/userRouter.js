const express = require('express');
const users = require("./userDb");

const router = express.Router();

router.post('/', validateUser(), (req, res) => {
  users.insert(req.body)
    .then((user) =>{
      res.status(201).json(user)
    })
    .catch((error) => {
      next(error)
    })
});

router.post('/:id/posts', validateUserId(),validatePost(), (req, res) => {
  res.status(200).json(req.user)
});

router.get('/', (req, res) => {
  const options = {
    sortBy: req.query.sortBy,
    limit: req.query.limit
  }
  users.get(options)
    .then((users) => {
      res.status(200).json(users)
    })
    .catch((error) =>{
      console.log(error)
      next(error)
    })
});

router.get('/:id', validateUserId(), (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId(), validatePost(), (req, res) => {
  res.status(200).json(req.user)
});

router.delete('/:id', validateUserId(), (req, res) => {
  users.remove(req.params.id)
    .then((count) => {
      res.status(200).json(count)
    })
    .catch((error) => {
      next(error)
    })
});

router.put('/:id', validateUserId(), (req, res) => {
 users.update(req.params.id, req.body)
  .then((user) => {
    res.status(200).json(user)
  })
  .catch((error) => {
    next(error)
  })
});

//custom middleware

function validateUserId() {
  return(req, res, next) => {
    users.getById(req.params.id)
    .then((user) => {
      if(user){
        req.user= user
        next()
      } else {
        res.status(400).json({
            message: "invalid user id"
        })
      }
    })
    .catch((error) => {
      next(error)
    })
  }  
}

function validateUser() {
  return (req, res, next)=> {
    if(!req.body.name){
      return res.status(400).json({
        message: "missing required name field"
      })
    }
    users.insert(!req.body)
      .then((user) => {
        res.status(201).json(user)
      })
      .catch((error) => {
        console.log(error)
        res.status(400).json({
          message: "missing user data"
        })
      })
    next();

  }
}

function validatePost() {
  return (req, res, next) => {
    if(!req.body.text){
      return res.status(400).json({
        message: "missing required text field"
      })
    }
    users.getUserPosts(req.params.id)
      .then((post) => {
        res.status(200).json(post)
      })
      .catch((error) => {
        console.log(error)
        res.status(400).json({
          message:"missing post data"
        })
      })
    next();
  } 
}

module.exports = router;
