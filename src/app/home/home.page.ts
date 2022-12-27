import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ExamService } from '../services/exam-service.service';
import { Exam } from '../models/exam.model';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // Variables
  addable: boolean = false;
  editable: boolean = false;
  activeExam: Exam | undefined;
  indexed: any;


  averageCheck: boolean = false;
  numberCourses: number = 0;
  totalMark: number = 0;
  average: number = 0;
  average1: number = 0;
  average2: number = 0;

  examForm = this.fb.group({
    score: [0, [Validators.required, Validators.min(0), Validators.max(20)]],
    course: ['', [Validators.required]],
    semester: [0, [Validators.required, Validators.pattern("[1-2]")]]
  })

  selectedSemester = 0;

  constructor(
    public examService: ExamService,
    private fb: FormBuilder,
    private toastController: ToastController,
  ) { }

  ngOnInit() { }

  // Functions

  // Calculate Averages
  calculateAverages(): void {
    this.averageCheck = true;
    this.average = 0;
    if (this.examService.getExams().length > 0) {
      let totalMark = 0;
      let totalMark1 = 0;
      let count1 = 0;
      let totalMark2 = 0;
      let count2 = 0;
      for (let exam of this.examService.getExams()) {
        totalMark += exam.score;
        if (exam.semester == 1) {
          totalMark1 += exam.score;
          count1++;
        } else if (exam.semester == 2) {
          totalMark2 += exam.score;
          count2++;
        }
      }
      this.average = (totalMark / this.examService.getExams().length);
      this.average1 = 0;
      this.average2 = 0;
      if (count1 > 0) {
        this.average1 = totalMark1 / count1;
      }
      if (count2 > 0) {
        this.average2 = totalMark2 / count2;
      }
    }

  }

  // Allow to create new Exam
  goToExam() {
    this.addable = true;
    this.editable = false;
    this.averageCheck = false;
    this.selectedSemester = 0;
  }

  // Save Exam of List
  saveExam(): void {
    if (this.examForm.valid) {
      const id = this.examService.getExams.length;
      const score = this.examForm.get('score')?.value;
      const course = this.examForm.get('course')?.value;
      const semester = this.selectedSemester;

      if (score && semester && course) {

        // New Exam
        const newExam = {
          id: id + 1,
          score: score,
          course: course,
          semester: semester,
        }
        //  Add to service list
        this.examService.addExam(newExam);

        // reset values
        this.examForm.reset();
        this.addable = false;
        this.averageCheck = false;
        this.editable = false;
        this.selectedSemester = 0;

      }
    }
    else {
      this.presentToast("Please fill in the form correctly");
    }
  }

  // Allow to update of List
  updateExam(index: number, exam: Exam): void {
    this.editable = true;
    this.addable = false;

    this.activeExam = exam;
    this.selectedSemester = exam.semester;
    this.indexed = index;

    this.examForm.patchValue({ course: exam.course, score: exam.score });

  }

  // Update Exam of List
  updatedExam(index: number): void {
    if (this.examForm.valid) {
      const id = this.examService.getExams.length;
      const score = this.examForm.get('score')?.value;
      const course = this.examForm.get('course')?.value;
      const semester = this.examForm.get('semester')?.value;

      if (score && semester && course) {

        // New Exam
        const newExam = {
          id: id + 1,
          score: score,
          course: course,
          semester: semester,
        }
        //  Update to service list
        this.examService.updateExam(index, newExam);


        // reset values
        this.examForm.reset();
        this.addable = false;
        this.editable = false;
        this.averageCheck = false;
      }
    }
    else {
      this.presentToast("Please fill in the form correctly");
    }
  }

  // Delete Exam of List
  deleteExam(index: number) {

    this.examService.deleteExam(index);
    this.addable = false;
    this.editable = false;
    this.averageCheck = false;
  }

  // Cancel Exam adding or updating
  cancel(): void {
    this.addable = false;
    this.editable = false;
    this.averageCheck = false;
  }

  // Select the right semester
  selectSemester(value: number) {
    this.selectedSemester = value;
    this.examForm.patchValue({ semester: value });
  }

  // Error Message
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      position: "bottom",
      duration: 3000
    });

    toast.present();
  }

}
