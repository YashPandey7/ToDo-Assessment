const express = require("express");
const router = express.Router();
const Task = require("../model/task.model");

router.post("/", async(req, res) => {
    try{
        const task = new Task(req.body);
        const result = await task.save();
        res.status(201).send(result);
    }catch(err){
        // console.log(err);
        res.status(500).json({ message: err.message });
    }
});

router.get("/", async(req, res) => {
    try{
        const data = await Task.find();
        res.status(200).send(data);
    }catch(err){
        // console.log(err);
        res.status(500).json({message : err.message});
    }
});

router.patch("/:id", async(req, res) => {
    try{
        const id = req.params.id;
        const task = await Task.findByIdAndUpdate(id, req.body, {new : true});
        res.status(200).send(task);
    }catch(err){
        res.status(500).json({message : err.message});
    }
});

router.delete("/:id", async(req, res) => {
    try{
        const id = req.params.id;
        const task = await Task.findByIdAndDelete(id);
        res.status(200).send(task);
    }catch(err){
        res.status(500).json({message : err.message});
    }
});

router.patch('/:id/note', async (req, res) => {
    const { text } = req.body;
  
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { $push: { notes: { text } } },
        { new: true }
      );
      res.json(updatedTask);
    } catch (err) {
      res.status(500).json({ error: 'Failed to add note' });
    }
  });

router.delete('/:taskId/note/:noteId', async (req, res) => {
    const { taskId, noteId } = req.params;
  
    try {
      const task = await Task.findByIdAndUpdate(
        taskId,
        { $pull: { notes: { _id: noteId } } },
        { new: true }
      );
  
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      res.json(task);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete note' });
    }
  });
  


module.exports = router;