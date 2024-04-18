

/**
 * Represents a student.
 * @export class
 */
export class Student {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

/**
 * Represents a note for a student's grade.
 * @export class
 */
export class Note {
    constructor(student_id, grade, date) {
        this.student_id = student_id;
        this.grade = grade;
        this.date = new Date(date);
    }
}

/**
 * Represents a period of time with a start date, end date, and weight.
 * @export class
 */
export class Period {
    constructor(dateA, dateB, weight) {
        this.dateA = new Date(dateA);
        this.dateB = new Date(dateB);
        this.weight = weight;
    }
}

export const students_db = [
    new Student(17072, "Paula Polisinlinker"),
    new Student(17075, "Daniel Cardenas"),
    new Student(17078, "Nico Herbas"),
    new Student(17081, "Galo Hernandez"),
    new Student(17290, "Poli Linker"),
];


export const notes_db = [
    new Note(17072, 5, '2024-01-15'),
    new Note(17072, 5, '2024-02-20'),
    new Note(17072, 4, '2024-03-05'),
    new Note(17072, 2, '2024-04-10'),
    new Note(17072, 4, '2024-05-15'),
    new Note(17072, 6, '2024-06-20'),
    new Note(17072, 1, '2024-07-05'),
    new Note(17072, 2, '2024-08-10'),
    new Note(17072, 4, '2024-09-15'),
    new Note(17072, 3, '2024-10-20'),
    new Note(17072, 2, '2024-11-05'),
    new Note(17072, 10, '2024-12-10'),

    new Note(17075, 5, '2024-01-05'),
    new Note(17075, 6, '2024-02-10'),
    new Note(17075, 9, '2024-03-15'),
    new Note(17075, 7, '2024-04-20'),
    new Note(17075, 8, '2024-05-05'),
    new Note(17075, 1, '2024-06-10'),
    new Note(17075, 9, '2024-07-15'),
    new Note(17075, 8, '2024-08-20'),
    new Note(17075, 9, '2024-09-05'),
    new Note(17075, 6, '2024-10-10'),
    new Note(17075, 8, '2024-11-15'),
    new Note(17075, 9, '2024-12-20'),

    new Note(17078, 7, '2024-01-15'),
    new Note(17078, 4, '2024-02-20'),
    new Note(17078, 5, '2024-03-25'),
    new Note(17078, 6, '2024-04-05'),
    new Note(17078, 5, '2023-05-10'),
    new Note(17078, 7, '2024-06-15'),
    new Note(17078, 4, '2024-07-20'),
    new Note(17078, 1, '2024-08-25'),
    new Note(17078, 4, '2024-09-05'),
    new Note(17078, 5, '2024-10-10'),
    new Note(17078, 5, '2024-11-15'),
    new Note(17078, 4, '2024-12-20'),

    new Note(17081, 9, '2024-01-05'),
    new Note(17081, 1, '2024-02-10'),
    new Note(17081, 7, '2024-03-15'),
    new Note(17081, 9, '2024-04-20'),
    new Note(17081, 5, '2024-05-25'),
    new Note(17081, 7, '2024-06-05'),
    new Note(17081, 6, '2024-07-10'),
    new Note(17081, 5, '2024-08-15'),
    new Note(17081, 7, '2024-09-20'),
    new Note(17081, 9, '2024-10-25'),
    new Note(17081, 5, '2024-11-05'),
    new Note(17081, 10, '2024-12-10'),

    new Note(17290, 10, '2024-01-15'),
    new Note(17290, 10, '2024-02-20'),
    new Note(17290, 10, '2024-03-25'),
    new Note(17290, 10, '2024-04-05'),
    new Note(17290, 10, '2024-05-10'),
    new Note(17290, 10, '2024-06-15'),
    new Note(17290, 10, '2024-07-20'),
    new Note(17290, 10, '2024-08-25'),
    new Note(17290, 10, '2024-09-05'),
    new Note(17290, 10, '2024-10-10'),
    new Note(17290, 10, '2024-11-15'),
    new Note(17290, 10, '2024-12-20'),
];