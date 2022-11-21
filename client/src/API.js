const URL = 'http://localhost:3001/api/'

async function getAllCourses() {
    // call  /api/courses
    const response = await fetch(URL+'courses');
    const coursesJson = await response.json();
    if (response.ok) {
        return coursesJson.map((f) => ({id: f.id, name: f.name, credits: f.credits, num_students: f.num_students, max_num_students: f.max_num_students, prerequisite: f.prerequisite, course_incompatible: f.course_incompatible }) )
    } else {
        throw coursesJson;
    }
}

async function getPlanStudent() {
    // call  /api/plan
    const response = await fetch(URL + 'plan', {credentials: 'include'});

    const planJson = await response.json();
    if (response.ok) {
        return planJson.map((f) => ({ id: f.id, name: f.name, credits: f.credits, prerequisite: f.prerequisite, credit: f.credit}))
    } else {
        throw planJson;
    }
}

async function getNumberOfStudent() {
    // call  /api/getNumberOfStudent
    const response = await fetch(URL + 'getNumberOfStudent', {credentials: 'include'});

    const numberJson = await response.json();
    if (response.ok) {
        return numberJson.map((f) => ({ id: f.id, num_student: f.num_students}))
    } else {
        throw numberJson;
    }
}

async function getConstraintsCourse(code) {
    // call  /api/constraint
    const response = await fetch(URL + 'constraint/'+ code, {credentials: 'include'});

    const constraintJson = await response.json();
    if (response.ok) {
        return constraintJson.map((t) => ({ id_course: t.id_course, course_incompatible: t.course_incompatible, prerequisite: t.prerequisite }))
    } else {
        throw constraintJson;
    }
}

async function getTypePlanStudent() {
    // call  /api/constraint
    const response = await fetch(URL + 'getTypePlanStudent', {credentials: 'include'});

    const t = await response.json();
    if (response.ok) {
        return { type: t.type }
    } else {
        throw t;
    }
}

async function addPlan(plan) {
    // call  /api/plan
    return new Promise((resolve, reject) => {
        fetch(URL + 'plan', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({plan})
        }).then((response) => {
            if (response.ok)
                resolve(null)
            else {
                response.json()
                    .then((message) => {
                        reject(message);
                    }) // error message in the response body
                    .catch(() => {
                        reject({ error: "Cannot parse server response." })
                    }); // something else
            }
        }).catch(() => {
            reject({ error: "Cannot communicate with the server." })
        })
    })
}

async function addTypePlan(typePlan,id) {
    // call  /api/plan
    return new Promise((resolve, reject) => {
        fetch(URL + 'typePlan', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({typePlan: typePlan,id:id})
        }).then((response) => {
            if (response.ok)
                resolve(null)
            else {
                response.json()
                    .then((message) => {
                        reject(message);
                    }) // error message in the response body
                    .catch(() => {
                        reject({ error: "Cannot parse server response." })
                    }); // something else
            }
        }).catch(() => {
            reject({ error: "Cannot communicate with the server." })
        })
    })
}

async function deleteCoursesStudent() {
    // call  /api/deleteCourses
    return new Promise((resolve,reject) => {
        fetch(URL + 'deleteCourses', {
            method: 'DELETE',
            credentials : 'include'
        }).then((res) => resolve(res))
            .catch(function (error) {
            reject(error);
        });
    })
}

async function deletePlanStudent() {
    // call  /api/deleteCourses
    return new Promise((resolve,reject) => {
        fetch(URL + 'deletePlan', {
            method: 'DELETE',
            credentials : 'include'
        }).then((res) => resolve(res))
            .catch(function (error) {
                reject(error);
            });
    })
}

async function logIn(credentials) {
    let response = await fetch(URL + 'sessions', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function logOut() {
    await fetch(URL + 'sessions/current', { method: 'DELETE', credentials: 'include' });
}

async function getStudentInfo() {
    const response = await fetch(URL + 'sessions/current', {credentials: 'include'});
    const studentInfo = await response.json();
    if (response.ok) {
        return studentInfo;
    } else {
        throw studentInfo;  // an object with the error coming from the server
    }
}

const API = {getAllCourses, logIn, logOut, getPlanStudent,getStudentInfo,getConstraintsCourse,addPlan,deleteCoursesStudent,deletePlanStudent,addTypePlan,getTypePlanStudent,getNumberOfStudent}
export default API