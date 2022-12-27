import { Storage } from '@ionic/storage-angular';
import { Injectable } from '@angular/core';
import { Exam } from '../models/exam.model';


const EXAM_KEY = 'my-exams';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private Storage: Storage) {
    this.Storage.create();
  }

  // Create new Exam in database
  addExam(exam: Exam): Promise<any> {

    return this.Storage.get(EXAM_KEY).then((examsList: Exam[]) => {
      if (examsList) {
        examsList.push(exam);
        return this.Storage.set(EXAM_KEY, examsList);
      } else {
        return this.Storage.set(EXAM_KEY, [exam]);
      }
    })
  }

  // Update Exam in database
  updateExam(exam: Exam) {
    return this.Storage.get(EXAM_KEY).then((examsList: Exam[]) => {

      if (!examsList || examsList.length === 0) {
        return null;
      }

      let newExams: Exam[] = [];

      for (let e of examsList) {
        if (e.id === exam.id) {
          newExams.push(exam);
        } else {
          newExams.push(e);
        }
      }
      return this.Storage.set(EXAM_KEY, newExams);
    });
  }

  // Delete Exam of database
  deleteExam(index: number): Promise<Exam> {
    return this.Storage.get(EXAM_KEY).then((examsList: Exam[]) => {

      if (!examsList || examsList.length === 0) {
        return null;
      }

      let toKeepExams: Exam[] = [];

      for (let e of examsList) {
        if (e.id !== index) {
          toKeepExams.push(e);
        }
      }
      return this.Storage.set(EXAM_KEY, toKeepExams);
    });
  }

  // List of exam
  getExams(): Promise<Exam[]> {
    return this.Storage.get(EXAM_KEY);
  }
}
