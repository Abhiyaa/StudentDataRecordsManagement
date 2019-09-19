import {StudentComponent} from './../student/student.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from '../../shared/student.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { StatusService } from '../../shared/status.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  items = ['Zero', 'One', 'Two', 'Three'];
  activies =[];
  delinquents = [];
  droppers = [] ;
  constructor(private service: StudentService,
  private statusService: StatusService,
  private notificationService: NotificationService,
  private dialog: MatDialog) { }
  public isCollapsed:boolean = true;
  listData: MatTableDataSource<any>;
  activeData: MatTableDataSource<any>;
  delinquentData: MatTableDataSource<any>;
  droppedData: MatTableDataSource<any>;
  displayedColumns: string[] = ['firstName','lastName','studentId','phoneNumber','statusName','actions'];
 @ViewChild(MatSort, {static: true}) sort: MatSort;
 @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  searchKey: string;
 //finalActive =[];
  ngOnInit() {
    this.service.getStudents().subscribe(
      list => {
        let array = list.map(item => {
          let statusName = this.statusService.getStatusName(item.payload.val()['status']);
          return {
            $key: item.key,
            statusName,
            ...item.payload.val()
          };
        }); 
        this.listData = new MatTableDataSource(array);
       this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
      });
  }

  myClickFunction(){
    this.isCollapsed = !this.isCollapsed;
    this.activies = [] = this.service.getActiveStatus();
    this.delinquents = [] = this.service.getDelinquentStatus();
    this.droppers = [] = this.service.getDroppedStatus();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    console.log(event.container.data);
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  onCreate() {
    this.service.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(StudentComponent,dialogConfig);
    this.isCollapsed = true;
  }

  onEdit(row){
    this.service.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(StudentComponent,dialogConfig);
    this.isCollapsed = true;
  }
    
  onDelete($key){
    this.isCollapsed = true;
    if(confirm('Are you sure to delete this record ?')){
    this.service.deleteStudent($key);
    this.notificationService.warn('! Deleted successfully');
    }
  }
}
