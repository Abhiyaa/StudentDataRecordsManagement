import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../shared/student.service'; 
import { StatusService } from '../../shared/status.service';  
import { NotificationService } from '../../shared/notification.service'; 
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  constructor(private service: StudentService,
    private statusService: StatusService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<StudentComponent>) { }
 
  ngOnInit() {
    this.service.getStudents();
    this.service.getActiveStatus();
    this.service.getDelinquentStatus();
    this.service.getDroppedStatus();
  }
  onClear() {
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.notificationService.success(':: Submitted successfully');
  }
  onClose(){
    this.service.form.reset();
    this.service.initializeFormGroup();    
    this.dialogRef.close();
  }

  onSubmit(){
  
 if(this.service.form.valid){
  if (!this.service.form.get('$key').value){
   this.service.insertStudent(this.service.form.value);
   this.onClose(); 
  }
else{
   this.service.updateStudent(this.service.form.value);
   this.service.form.reset();
   this.service.initializeFormGroup();  
   this.notificationService.success('Submitted Successfully!!');
   this.onClose(); 
}
    }
  }

  
}
