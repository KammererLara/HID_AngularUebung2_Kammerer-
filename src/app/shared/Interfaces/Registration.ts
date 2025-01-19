import { Course } from "./Course";

export interface Registration {
    id: string;
    name: string;
    birthdate: string;
    course: Course;
    courseId: number;
    newsletter: boolean;
    email: string;
    registrationTimestamp: string;
  }
