// Branded Types
export type Brand<K, T> = K & { readonly __brand: T }

export type StudentId = Brand<string, "StudentId">
export type CourseCode = Brand<string, "CourseCode">
export type Email = Brand<string, "Email">
export type Credits = Brand<number, "Credits">
export type Semester = Brand<string, "Semester">
export type EnrollmentId = Brand<string, "EnrollmentId">


// Smart Constructors
const studentIdPattern = /^STU\d{6}$/
export function createStudentId(value: string): StudentId | Error {
    if (!studentIdPattern.test(value)) return new Error("Invalid StudentId")
    return value as StudentId
}

const courseCodePattern = /^[A-Za-z]{2,4}\d{3}$/
export function createCourseCode(value: string): CourseCode | Error {
    if (!courseCodePattern.test(value)) return new Error("Invalid CourseCode")
    return value as CourseCode
}


const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export function createEmail(value: string): Email | Error {
    if (!emailPattern.test(value)) return new Error("Invalid Email")
    return value as Email
}

const allowedCredits = new Set([1, 2, 3, 4, 6])
export function createCredits(value: number): Credits | Error {
    if (!allowedCredits.has(value)) return new Error("Invalid Credits")
    return value as Credits
}

const semesterPattern = /^(Fall|Spring|Summer)\d{4}$/
export function createSemester(value: string): Semester | Error {
    if (!semesterPattern.test(value)) return new Error("Invalid Semester")
    return value as Semester
}

export function createEnrollmentId(value: string): EnrollmentId | Error {
    if (!value.startsWith("ENR") || value.length <= 3) return new Error("Invalid EnrollmentId")
    return value as EnrollmentId
}

export function unwrap<T>(result: T | Error): T {
    if (result instanceof Error) throw result
    return result
}

// export * from "./entities"