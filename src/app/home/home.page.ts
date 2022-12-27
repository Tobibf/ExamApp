import { Component, ViewChild } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Exam } from '../models/exam.model';
import { FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../services/storage.service';


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

  exams: Exam[] = [];


  averageCheck: boolean = false;
  numberCourses: number = 0;
  totalMark: number = 0;
  average: number = 0;
  average1: number = 0;
  average2: number = 0;

  examForm = this.fb.group({
    score: [0, [Validators.required, Validators.min(0), Validators.max(20)]],
    course: ['', [Validators.required]],
    semester: [0, [Validators.required, Validators.pattern("[1-2]")]],
  })

  selectedSemester = 0;

  constructor(
    private storageService: StorageService,
    private platform: Platform,
    private fb: FormBuilder,
    private toastController: ToastController,
  ) {
    this.platform.ready().then(() => {
      this.loadExams();
    });
  }

  ngOnInit() { }

  // Functions

  // Calculate Averages
  calculateAverages(): void {
    this.averageCheck = true;
    this.average = 0;
    if (this.exams.length > 0) {
      let totalMark = 0;
      let totalMark1 = 0;
      let count1 = 0;
      let totalMark2 = 0;
      let count2 = 0;
      for (let exam of this.exams) {
        totalMark += exam.score;
        if (exam.semester == 1) {
          totalMark1 += exam.score;
          count1++;
        } else if (exam.semester == 2) {
          totalMark2 += exam.score;
          count2++;
        }
      }
      this.average = (totalMark / this.exams.length);
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
  addExamStorage(): void {
    if (this.examForm.valid) {
      const score = this.examForm.get('score')?.value;
      const course = this.examForm.get('course')?.value;
      const semester = this.selectedSemester;

      if (score && semester && course) {

        // New Exam
        const newExam = {
          id: Date.now(),
          score: score,
          course: course,
          semester: semester,
          updated_at: new Date()
        }

        //  Add to Storage list
        this.storageService.addExam(newExam).then(() => {
          this.presentToast('Exam added');
          this.loadExams();
        })

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
  updateExam(exam: Exam): void {
    this.editable = true;
    this.addable = false;

    this.activeExam = exam;
    this.selectedSemester = exam.semester;
    this.indexed = exam.id;

    this.examForm.patchValue({ course: exam.course, score: exam.score });

  }

  // Update Exam of List
  updateExamStorage(id: number): void {
    if (this.examForm.valid) {

      const score = this.examForm.get('score')?.value;
      const course = this.examForm.get('course')?.value;
      const semester = this.examForm.get('semester')?.value;
      const updated_at = new Date();

      if (score && semester && course) {

        // New Exam
        const newExam = {
          id: id,
          score: score,
          course: course,
          semester: semester,
          updated_at: updated_at
        }
        //  Update to storage list
        this.storageService.updateExam(newExam).then(() => {
          this.presentToast('Exam updated successfully');
          this.loadExams();
        });


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
  deleteExamStorage(id: number): void {
    this.storageService.deleteExam(id).then(() => {
      this.presentToast('Exam deleted successfully');
      this.loadExams();
    })
    this.cancel();
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
      duration: 2000
    });

    toast.present();
  }


  // Get list of Exam
  loadExams(): void {
    this.storageService.getExams().then(exams => {
      this.exams = exams;
    });
  }






}
