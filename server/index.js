const express = require('express');
const { check, validationResult } = require('express-validator'); // validation middleware
const cors = require('cors');
const studentDao = require('./dao/studentDao.js'); // module for accessing the DB
const dao = require('./dao/dao.js'); // module for accessing the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions

const PORT = 3001;

app = new express();

app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions)); // NB: Usare solo per sviluppo e per l'esame! Altrimenti indicare dominio e porta corretti

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function (email, password, done) {
        studentDao.getStudent(email, password).then((student) => {
            if (!student)
                return done(null, false, { message: 'Email o password non corretti.' });

            return done(null, student);
        })
    }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((student, done) => {
    done(null, student.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    studentDao.getStudentById(id)
        .then(student => {
            done(null, student); // this will be available in req.user
        }).catch(err => {
        done(err, null);
    });
});

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated())
        return next();

    return res.status(401).json({ error: 'not authenticated'});
}


// set up the session
app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/*** APIs ***/

// POST /sessions
// login
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, student, info) => {
        if (err)
            return next(err);
        if (!student) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(student, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            // this is coming from studentDao.getUser()
            return res.json(req.user);
        });
    })(req, res, next);
});

//logout
app.delete('/api/sessions/current', isLoggedIn, (req, res) => {
    req.logout(() => { res.end(); });
});

//getUser
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else
        res.status(401).json({ error: 'Unauthenticated student!' });
});

// GET /api/courses
app.get('/api/courses', (req, res) => {
    dao.listCourses()
        .then(courses => {
            courses.map((row) => {
                if(row.course_incompatible !== null && !Array.isArray(row.course_incompatible))
                    row.course_incompatible = [row.course_incompatible];

                return row;
            })
            res.json(courses)
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({error: `Database error while retrieving courses`}).end()
        });
});

//GET /api/plan for specific student
app.get('/api/plan', isLoggedIn, (req, res) => {
    dao.getPlanStudent(req.user.id)
        .then(plan => {
            res.json(plan)
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({error: `Database error while retrieving courses`}).end()
        });
});

//GET /api/constraint for specific course
app.get('/api/constraint/:code', isLoggedIn, (req, res) => {
    dao.getConstraintsCourse(req.params.code)
        .then(plan => {
            res.json(plan)
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({error: `Database error while retrieving courses`}).end()
        });
});

//GET /api/getNumberOfStudent for specific student
app.get('/api/getNumberOfStudent',  async (req, res) => {
    await dao.getNumberOfChoiceByStudent()
        .then(number => {
            number.map(async e => {
                await dao.updateNumberStudent(e.num_students, e.id);
            })
            res.json(number)
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({error: `Database error while retrieving courses`}).end()
        });
});

//GET /api/getTypePlanStudent for specific course
app.get('/api/getTypePlanStudent', isLoggedIn, async (req, res) => {
    await dao.getTypePlanStudent(req.user.id)
        .then(type => {
            res.json(type)
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({error: `Database error while retrieving type plan`}).end()
        });
});

async function findIncompatibilityCourses(arrayStudyPlan) {
    let find_constraint = false;
    if(find_constraint !== true){
        arrayStudyPlan.map( (row) => {
            const courses = dao.getConstraintsCourse(row.id);
            if(JSON.parse(JSON.stringify(arrayStudyPlan)).find((row2) => row2.id === courses.course_incompatible) !== undefined){
                find_constraint = true;
            }
        })
    }
    return find_constraint;
}

function constraintNumStudentS(items) {
    let checkNumStudent = false;
    if(checkNumStudent !== true){
        if(items.max_num_student !== null && items.numStudent > items.max_num_student){
            checkNumStudent = true;
        }
    }
    return checkNumStudent;
}

// POST /api/plan
app.post('/api/plan', isLoggedIn, [
    check('plan').isArray(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    let arrayStudyPlan = req.body.plan;
    let initialValue = 0;
    let typeOfPlan = '';
    if(arrayStudyPlan.length !== 0){
        typeOfPlan = arrayStudyPlan[0].typePlan;

    }

    try {

        let sumCredits = arrayStudyPlan.reduce((previousValue,currentValue) => previousValue + currentValue.credits, initialValue);
        if((sumCredits < 20 || sumCredits > 40) && typeOfPlan === 'Part-Time'){
            return res.status(422).json({error: 'Numero di crediti massimo e minimo non rispettati per il tipo di piano Part Time'});
        }else if((sumCredits < 60 || sumCredits > 80) && typeOfPlan === 'Full-Time'){
            return res.status(422).json({error: 'Numero di crediti massimo e minimo non rispettati per il tipo di piano Full Time'});
        }

        let checkIncompatibility = findIncompatibilityCourses(arrayStudyPlan);
        if(checkIncompatibility === true){
            return res.status(422).json({error: 'Presenza di corsi incompatibili tra loro nel piano!'});
        }

        for(let items of arrayStudyPlan){
            let find_prerequisite = items.prerequisite;
            if(find_prerequisite !== null){
                if(arrayStudyPlan.find((row) => row.id === items.prerequisite) === undefined){
                    return res.status(422).json({error: 'Il corso '+items.id+' non può essere inserito! Inserire prima il suo corso propedeutico'});
                }
            }

            let checkNumStudents = constraintNumStudentS(items);
            if(checkNumStudents === true ){
                return res.status(422).json({error: 'Il corso '+items.id+' ha raggiunto il numero massimo di iscritti!'});
            }

        }

        req.body.plan.map(async e => {
            await dao.addCoursesToStudent(e,req.user.id);
            await dao.updateNumberStudent(e.num_students, e.id);
        })

        res.json();
        res.status(201).end();


    } catch(err) {
        console.log(err);
        res.status(500).end();
    }
});

// POST /api/plan
app.post('/api/typePlan', isLoggedIn, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    try {
        await dao.addPlan(req.body.id,req.body.typePlan,req.user.id);
        res.json();
        res.status(201).end();
    } catch(err) {
        console.log(err);
        res.status(503).json({error: `Database error during the add of type plan`});
    }
});

app.delete('/api/deleteCourses', isLoggedIn, async (req, res) => {
    try {
        await dao.deleteCoursesStudent(req.user.id);
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(503).json({ error: `Database error during the deletion of courses of ${req.user.id} student.` });
    }
});

app.delete('/api/deletePlan', isLoggedIn, async (req, res) => {
    try {
        await dao.deletePlanStudent(req.user.id);
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(503).json({ error: `Database error during the deletion of plan of ${req.user.id} student.` });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));