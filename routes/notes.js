const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Note = require("../models/Notes");
const fetchUser = require("../middleware/fetchUser");

// ROUTE 1 : fetching all noetes using get /api/notes/FetchAllNotes . Login required
router.get("/FetchAllNotes", fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
});

// ROUTE 2 : adding a new note using post /api/notes/addNote . Login required
router.post("/addNote", fetchUser, [
    // setting all the validations 
    body('title', "You can't set title as empty").isLength({ min: 5 }),
    body('description', "Write Somthing To The Description & Description must be atlist 10 charecters").isLength({ min: 10 })
], async (req, res) => {

    try {
        // getting data from the requested queary
        const { title, description, tag } = req.body;

        // coppied from the express-validation documentation // if there are any errors return bad request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // creating a new note
        const note = new Note({
            title, description, tag, user: req.user.id
        })

        // saving the created note
        const savedNote = await note.save();

        // sending the saved note as responce
        res.json(savedNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }

});

// ROUTE 3 : update an exhisting note using put /api/notes/updateNote . Login required \ no validation require
// updating the particular note using note id => "/updateNote/:id" => (req.params.id)
router.put("/updateNote/:id", fetchUser, async (req, res) => {
    try {
        // getting data from the requested queary
        const { title, description, tag } = req.body;
        //   creating a new note 
        const nweNote = {};

        // if title, description, tag changes throuth the request of the user then adding the new title or description or tag into the newNote object 
        if (title) { nweNote.title = title };
        if (description) { nweNote.description = description };
        if (tag) { nweNote.tag = tag };

        // find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        // if requested note is not there in the database then send error
        if (!note) { return res.status(404).send("Note Is Not Found !") };
        // verifying the user who is updating the note from fetchUser middleware (if the user id of note module is not match to the authenticated person's id then throuth an Error)
        if (note.user.toString() !== req.user.id) {
            // status(401) => un authorised error code 
            return res.status(401).send("Not Allowed");
        }

        // all ok now and update and save the note to the exhisting note by finding the note id
        note = await Note.findByIdAndUpdate(req.params.id, { $set: nweNote }, { new: true });

        res.json(note);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
});

// ROUTE 4 : delete an exhisting note using delete /api/notes/deleteNote . Login required \ no validation require
router.delete("/deleteNote/:id", fetchUser, async (req, res) => {
    try {
        // find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);

        // if requested note is not there in the database then send error
        if (!note) { return res.status(404).send("Note Is Not Found !") };

        // verifying the user who is deleting the note from fetchUser middleware (if the user id of note module is not match to the authenticated person's id then throuth an Error)
        if (note.user.toString() !== req.user.id) {
            // status(401) => un authorised error code 
            return res.status(401).send("Not Allowed");
        }

        // all ok now and update and save the note to the exhisting note by finding the note id
        note = await Note.findByIdAndDelete(req.params.id);

        res.json({"Success":`The Note of ID ${req.params.id} Have Been Deleted !` ,  note : note});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
});

// ROUTE 5: search api
router.post("/search", fetchUser , async (req, res) => {
 try {
    const {title}=req.body;

     // coppied from the express-validation documentation // if there are any errors return bad request.
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
     }

    const search_note=await Note.find({title : title});
    const json_str=JSON.stringify(search_note);
    const data=JSON.parse(json_str);

    if(!data) res.status(400).send("No Note Found");
    else res.json(data);

 } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
 }
});

module.exports = router;