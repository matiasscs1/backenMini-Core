import express from 'express';
import bodyParser from 'body-parser';
import { Period, students_db, notes_db } from '../Model/estudiante_modelo.js';

function getStudent(student_id) {
    return students_db.find(student => student.id === student_id);
}

function computeGrades(periods) {
    if (periods.some(p => p.dateA > p.dateB)) {
        throw new Error("Invalid date range");
    }

    if (periods.reduce((acc, p) => acc + p.weight, 0) >= 1) {
        throw new Error("Invalid weights");
    }

    let finalGrades = {};

    periods.forEach(period => {
        notes_db.forEach(note => {
            if (note.date >= period.dateA && note.date <= period.dateB) {
                if (!finalGrades[note.student_id]) {
                    finalGrades[note.student_id] = { total: 0, count: 0, total1: 0, count1: 0, total2: 0, count2: 0 };
                }

                finalGrades[note.student_id].total += note.grade * period.weight;
                finalGrades[note.student_id].count += period.weight;

                // Calcula p1 (hasta dateB del primer período)
                if (periods[0] && note.date <= periods[0].dateB) {
                    finalGrades[note.student_id].total1 += note.grade;
                    finalGrades[note.student_id].count1 += 1;
                }

                // Calcula p2 (hasta dateB del segundo período)
                if (periods[1] && note.date <= periods[1].dateB) {
                    finalGrades[note.student_id].total2 += note.grade;
                    finalGrades[note.student_id].count2 += 1;
                }
            }
        });
    });

    for (let studentId in finalGrades) {
        let student = getStudent(parseInt(studentId));
        let gradeData = finalGrades[studentId];
        let average = gradeData.total / gradeData.count;

        // Calcula la media de p1 y p2
        let p1 = gradeData.count1 > 0 ? gradeData.total1 / gradeData.count1 : 0;
        let p2 = gradeData.count2 > 0 ? gradeData.total2 / gradeData.count2 : 0;


        finalGrades[studentId] = {
            name: student.name,
            grade: average,
            needed: average < 6 ? 6 - average : 0,
            p1: p1,
            p2: p2
        };
    }

    return finalGrades;
}



  


export const postCompute = async (req, res) => {

    try {
        const periods = req.body.periods.map(p => new Period(p.dateA, p.dateB, p.weight));
        console.log(periods )
        const result = computeGrades(periods);
        res.json(result); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const getStudents = async (req, res) => {
    try {
        res.json(students_db);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

