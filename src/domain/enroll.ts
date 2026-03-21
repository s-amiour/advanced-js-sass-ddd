import { v4 as uuidv4 } from "uuid"
import { Semester, unwrap, createEnrollmentId } from "./types"
import { Student, Course, Enrollment } from "./entities"
import { domainEvents } from "../infra/event"

export function enroll(student: Student, course: Course, semester: Semester, existing: Enrollment[]): Enrollment | Error {
    const duplicate = existing.find(e =>
        e.studentId === student.id &&
        e.courseCode === course.code &&
        e.semester === semester &&
        e.isActive
    )

    if (!student.canEnroll(semester, course.credits)) {
        return new Error(
            `Student would exceed 18 credits for ${semester} ` +
            `(currently ${student.getCreditsForSemester(semester)}, course adds ${course.credits})`
        )
    }
    if (!course.canEnroll()) return new Error("Course full")
    if (duplicate) return new Error("Student already enrolled in this semester course!")

    const enrollmentId = unwrap(createEnrollmentId("ENROLL" + uuidv4()))
    const enrollment = Enrollment.create(enrollmentId, student.id, course.code, semester)

    course.addStudent()
    student.addCredits(semester, course.credits)

    domainEvents.dispatch("StudentEnrolled", {
        id: student.id,
        courseCode: course.code,
        semester,
        enrollmentId
    })

    if (course.isFull) {
        domainEvents.dispatch("CourseFull", {
            courseCode: course.code,
            semester,
            capacity: course.capacity,
            enrolledCount: course.enrolledCount
        })
    } else if (course.isNearCapacity) {
        domainEvents.dispatch("CourseCapacityDone", {
            code: course.code,
            semester,
            capacity: course.capacity,
            enrolledCount: course.enrolledCount
        })
    }

    return enrollment
}

export function cancelEnrollment(enrollment: Enrollment, student: Student, course: Course): void | Error {
    if (!enrollment.isActive) return new Error("Enrollment must be active to be cancelled!")

    enrollment.cancel()
    course.removeStudent()
    student.removeCredits(enrollment.semester, course.credits)

    domainEvents.dispatch("EnrollmentCancelled", {
        id: enrollment.id,
        studentId: enrollment.studentId,
        courseCode: enrollment.courseCode,
        semester: enrollment.semester
    })
}

// Test purposes
export function handleEnroll(
    enrollments: Enrollment[],
    student: Student,
    course: Course,
    semester: Semester
) {
    const result = enroll(student, course, semester, enrollments)
    if (result instanceof Error) {
        console.log("Enroll failed:", result.message)
        return
    }
    enrollments.push(result)
}
