import { Injectable } from '@angular/core';
import { Exam } from '../models/exam.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  examsList: Exam[] = [
    {
      id : 1,
      course: "IA",
      score: 4,
      semester: 1
    },
    {
      id : 2,
      course: "English",
      score: 14,
      semester: 1
    },
    {
      id : 3,
      course: "JAVA EE",
      score: 20,
      semester: 2
    }
  ]; // all of the exam results
  totalMark: number = 0;
  average: number = 0;

  constructor() { }
  calculateAverages(): void {
    this.average = this.totalMark / this.examsList.length;
    // this.examsList['score'].
  }

  addExam(exam: Exam): void {
    this.examsList.unshift({ ...exam });

  }
  updateExam(index: number, exam: Exam): void {
    this.examsList[index] = exam;
  }

  deleteExam(index: number): void {
    this.examsList.splice(index, 1);

  }

  getExams(): Exam[] {

    return [...this.examsList];
  }
}
