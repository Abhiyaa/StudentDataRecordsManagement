import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AngularFireDatabase, AngularFireList, AngularFireAction  } from 'angularfire2/database';
import * as _ from 'lodash';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {  

  constructor(private firebase: AngularFireDatabase) {  }
  studentList: AngularFireList<any>;

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl(''),
    studentId: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', [Validators.maxLength(10), Validators.minLength(10)]),
    status: new FormControl(0, Validators.required),
  });

  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      firstName: '',
      lastName: '',
      studentId: '',
      phoneNumber: '',
      status: 0
    });
  }
  //retrieve inserted data inside students table
  getStudents(){
    this.studentList = this.firebase.list('students');
    return this.studentList.snapshotChanges();
    
  }
  
  // insert student inside students table
  insertStudent(student){
      this.studentList.push({
      firstName: student.firstName,
      lastName: student.lastName,
      studentId: student.studentId,
      phoneNumber: student.phoneNumber,
      status: student.status
    });
  } 
 
  //get active status
  getActiveStatus(){
    var delinquentRef= this.firebase.database.ref("/students");
    var activeData = [];
    delinquentRef.orderByChild("status").equalTo("1").on("child_added", function(data) {
      //console.log("Equal to filter: " + data.val().firstName);
      activeData.push({
        data: data.val().firstName
      });
   });  
   return activeData;
  }


  //get delinquent status
  getDelinquentStatus(){
    var delinquentRef= this.firebase.database.ref("/students");
    var delinquentData = [];
    delinquentRef.orderByChild("status").equalTo("2").on("child_added", function(data) {
      console.log("Equal to filter: " + data.val().firstName);
      delinquentData.push({
        data: data.val().firstName
      });
   });  
   return delinquentData;
  }


  //get dropped status
  getDroppedStatus(){
    var droppedRef= this.firebase.database.ref("/students");
    var droppedData = [];
    droppedRef.orderByChild("status").equalTo("3").on("child_added", function(data) {
      //console.log("Equal to filter: " + data.val().firstName);
      droppedData.push({
        data: data.val().firstName
      });
   }); 
   return droppedData;
  
  }


  //to update student record
  updateStudent(student){
    this.studentList.update(student.$key,{
      firstName: student.firstName,
      lastName: student.lastName,
      studentId: student.studentId,
      phoneNumber: student.phoneNumber,
      status: student.status
    });
  } 
  
  //to delete student record
  deleteStudent($key: string){
    this.studentList.remove($key);
  }

  
 
   
  populateForm(student) {
    this.form.setValue(_.omit(student,'statusName'));
  }

}
