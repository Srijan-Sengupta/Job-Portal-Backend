const express = require("express");
const Applicant = require("../models/applicant");
const Recruiter = require("../models/recruiter");

router = express.Router();

router.post("/register-applicant", async (req, res) => {
	const applicant = req.body;

	const takenUsername = Applicant.findOne({ username: applicant.username });
	const takenEmail = Applicant.findOne({ email: applicant.email });

	if (takenUsername) {
		res.json({ message: "This username has already been taken" });
	} else if (takenEmail) {
		res.json({ message: "This email is already in use." });
	} else {
		applicant.password = await bcrypt.hash(req.body.password, 10);

		const dbApplicant = new Applicant({
			username: applicant.username,
			password: applicant.password,
			email: applicant.email,
		});
		dbApplicant.save();
		res.json({ message: "Success" });
	}
});

router.post("/register-recruiter", async (req, res) =>{
	const recruiter = req.body;

	const takenUsername = Recruiter.findOne({username: recruiter.username});
	const takenEmail = Recruiter.findOne({email: recruiter.email});

	if(takenEmail){
		res.json({ message: "This email is already in use."})
	}else if(takenUsername){
		res.json({message: "This username has already been taken."})
	}else{
		recruiter.password = bcrypt.hash(recruiter.password, 10);

		const dbRecruiter = new Recruiter({
			username: recruiter.username,
			password: recruiter.password,
			email: recruiter.email,
			companyName: recruiter.companyName
		})
		 dbRecruiter.save();
		res.json({message: "Success"})
	}
})

router.post("/applicant-login", async (req, res) => {
	const applicantLoggingIn = req.body;

	Applicant.findOne({ username: applicantLoggingIn.username }).then((dbUser) => {
		if(!dbUser){
			return res.json({message: "Invalid Username or Password"})
		}
		bcrypt.compare(applicantLoggingIn.password, dbUser.password).then(isCorrect => {
			if(isCorrect){
				const payload = {
					id: dbUser._id,
					username: dbUser.username,
				}
				jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 86400}, (err, token) => {
					if (err) return res.json({message: err})
					return res.json({message: "Success", token: "Bearer " + token})
				})
			}else{
				return res.json({message: "Invalid username or password"})
			}
		})
	});
});

router.post("/recruiter-login", async (req, res) => {
	const recruiterLoggingIn = req.body;

	Recruiter.findOne({ username: recruiterLoggingIn }).then((dbUser) => {
		if(!dbUser){
			return res.json({message: "Invalid Username or Password"})
		}
		bcrypt.compare(recruiterLoggingIn.password, dbUser.password).then(isCorrect => {
			if(isCorrect){
				const payload = {
					id: dbUser._id,
					username: dbUser.username,
				}
				jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 86400}, (err, token) => {
					if (err) return res.json({message: err})
					return res.json({message: "Success", token: "Bearer " + token})
				})
			}else{
				return res.json({message: "Invalid username or password"})
			}
		})
	});
});

module.exports = router;
