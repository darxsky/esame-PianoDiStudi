'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('study_plan.db', (err) => {
    if(err) throw err;
});

// get all courses
exports.listCourses = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT course.id,course.name,course.credits,course.num_students,course.max_num_students,course.prerequisite,i.course_incompatible FROM course LEFT JOIN incompatibility i on course.id = i.id_course ORDER BY course.name ASC';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const courses = rows.map((e) => ({ id: e.id, name: e.name, credits: e.credits, num_students: e.num_students, max_num_students: e.max_num_students, prerequisite: e.prerequisite, course_incompatible : e.course_incompatible }));
            let array=[];
            courses.forEach(i => {
                if(array.find( (a) => a.id === i.id ) === undefined){
                    let temp = courses.filter((course) => course.id === i.id );
                    if(temp.length === 1){
                        array.push(temp[0]);
                    }else{
                        let incompatibili = [];
                        temp.map((t) => {incompatibili.push(t.course_incompatible) ;return t})
                        array.push({id: temp[0].id, name: temp[0].name, credits: temp[0].credits, num_students: temp[0].num_students, max_num_students: temp[0].max_num_students, prerequisite: temp[0].prerequisite, course_incompatible: incompatibili  })
                    }
                }
            });
            resolve(array);
        });
    });
};

// get plan by id student
exports.getPlanStudent = (student_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT course.id, course.name,course.credits,course.prerequisite,SUM(credits) over (partition by id_student) as credit\n' +
            'FROM course\n' +
            'INNER JOIN course_has_student ON course_has_student.id_course = course.id\n' +
            'INNER JOIN students ON students.id = course_has_student.id_student\n' +
            'WHERE id_student = ?';
        db.all(sql, [student_id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const plan = rows.map((f) => ({ id: f.id, name: f.name, credits: f.credits, prerequisite: f.prerequisite, credit:f.credit }));
            resolve(plan);
        });
    });
};

// get plan by id student
exports.getNumberOfChoiceByStudent = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT course.id,COUNT(id_course) as num_students ' +
            'FROM course LEFT JOIN course_has_student ON course_has_student.id_course = course.id ' +
            'LEFT JOIN students ON students.id = course_has_student.id_student ' +
            'GROUP BY course.id';
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const number = rows.map((f) => ({ id: f.id, num_students: f.num_students  }));
            resolve(number);
        });
    });
};

exports.updateNumberStudent = (numStudent,id) => {
    return new Promise((resolve, reject) => {
        let query = "UPDATE course SET num_students= ? WHERE id = ?";

        db.run(query, [numStudent,id], function (err) {
            if (err)
                reject(err);
            else {
                if (this.changes > 0)
                    resolve();
                else {
                    reject(new Error("Aggiornamento non riuscito"));
                }

            }

        });
    });
}

// get credit by id student
exports.getCredit = (student_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT SUM(credits) as credit ' +
            'FROM course ' +
            'INNER JOIN course_has_student ON course_has_student.id_course = course.id ' +
            'INNER JOIN students ON students.id = course_has_student.id_student ' +
            'WHERE id_student = ? ';
        db.get(sql, [student_id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const credits = { credit:rows.credit };
            resolve(credits);
        });
    });
};


// get plan by id student
exports.getTypePlanStudent = (student_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT type FROM plan INNER JOIN students s on s.id = plan.id_student WHERE id_student = ?';
        db.get(sql, [student_id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }else if(rows === 0){
                const type1 = { type: '' };
                resolve(type1);
            }else{
                const type = { type:rows.type };
                resolve(type);
            }

        });
    });
};

// get incompatible and prerequisite for specific course
exports.getConstraintsCourse = (course_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT course_incompatible,prerequisite FROM course INNER JOIN incompatibility on course.id = incompatibility.id_course WHERE id_course = ?';
        db.all(sql,[course_id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const plan = rows.map((f) => ({  course_incompatible: f.course_incompatible, prerequisite: f.prerequisite}));
            resolve(plan);
        });
    });
};

// add plan
exports.addPlan = (id,typePlan,user_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO plan(id_plan,type,id_student) VALUES(?,?,?)';

        db.run(sql, [id,typePlan,  user_id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

// add courses to student
exports.addCoursesToStudent = (plan,user_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO course_has_student(id_course, id_student) VALUES(?,?)';

        db.run(sql, [plan.id,  user_id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

// delete all courses associated to specific student
exports.deleteCoursesStudent = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM course_has_student WHERE id_student = ?';
        db.run(sql, [userId], (err) => {
            if (err) {
                reject(err);
                return;
            } else
                resolve(null);
        });
    });
}

// delete the plan associated to specific student
exports.deletePlanStudent = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM plan WHERE id_student = ?';
        db.run(sql, [userId], (err) => {
            if (err) {
                reject(err);
                return;
            } else
                resolve(null);
        });
    });
}
