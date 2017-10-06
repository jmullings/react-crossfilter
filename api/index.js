import express from 'express';
import mongoose from 'mongoose';



const db = mongoose.createConnection("mongodb://heroku_0jpgzn0v:eadlhi99ret0po2ok619fn9iu5@ds127173.mlab.com:27173/heroku_0jpgzn0v");
const projects = db.model('', {}, 'projects');
const router = express.Router();

router.get('/data', (req, res) => {

    projects.find({}, {'_id': 0, 
    					'school_state': 1, 
    					'resource_type': 1, 
    					'poverty_level': 1, 
    					'date_posted': 1, 
    					'total_donations': 1, 
    					'funding_status': 1, 
    					'grade_level': 1}, (err, projectDetails) => {
		if (err) res.send(err);
		res.json(projectDetails);
	});

});

export default router;