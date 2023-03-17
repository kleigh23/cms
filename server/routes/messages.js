var express = require('express');
var router = express.Router();
module.exports = router; 
const sequenceGenerator = require('./sequenceGenerator');
const Messaged = require('../models/message');

router.get('/', (req, res, next) => {
    Messaged.find((error, data) =>{
        console.log(data);
        if (error) {
            return res.status(500).json({
                message: 'An error occured: ',
                error: error
            });
        } else {
            res.status(200).json(data);
        }
    });
 });

// router.get('/', (req, res, next) => {
//     Message.find()
//       .then(messages => {
//         res.status(200).json({
//             message: 'Messages fetched successfully!',
//             messages: messages
//           });
//       })
//       .catch(error => {
//         res.status(500).json({
//           message: 'An error occurred',
//           error: error
//         });
//       });
//   });

  router.post('/', (req, res, next) => {
    const maxMessageId = sequenceGenerator.nextId("messages");
  
    const messaged = new Messaged({
      id: maxMessageId,
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender: req.body.sender
    });
  
    messaged.save()
      .then(createdMessage => {
        res.status(201).json({
          message: 'Message added successfully',
          messaged: createdMessage
        });
      })
      .catch(error => {
         res.status(500).json({
            message: 'An error occurred',
            error: error
          });
      });
  });

  //   router.put('/:id', (req, res, next) => {
  //   Messaged.findOne({ id: req.params.id })
  //     .then(messaged => {
  //       messaged.subject = req.body.subject;
  //       messaged.msgText = req.body.msgText;
  //       messaged.sender = req.body.sender;
  
  //       Messaged.updateOne({ id: req.params.id }, messaged)
  //         .then(result => {
  //           res.status(204).json({
  //             message: 'Document updated successfully'
  //           })
  //         })
  //         .catch(error => {
  //            res.status(500).json({
  //            message: 'An error occurred',
  //            error: error
  //          });
  //         });
  //     })
  //     .catch(error => {
  //       res.status(500).json({
  //         message: 'Message not found.',
  //         error: { messaged: 'Message not found'}
  //       });
  //     });
  // });

  //   router.delete("/:id", (req, res, next) => {
  //   Messaged.findOne({ id: req.params.id })
  //     .then(messaged => {
  //       Messaged.deleteOne({ id: req.params.id })
  //         .then(result => {
  //           res.status(204).json({
  //             message: "Message deleted successfully"
  //           });
  //         })
  //         .catch(error => {
  //            res.status(500).json({
  //            message: 'An error occurred',
  //            error: error
  //          });
  //         })
  //     })
  //     .catch(error => {
  //       res.status(500).json({
  //         message: 'Message not found.',
  //         error: { messaged: 'Message not found'}
  //       });
  //     });
  // });