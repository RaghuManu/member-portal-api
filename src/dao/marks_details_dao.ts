import { marksDetail } from "../model/marks_details_db";
import { User } from "../model/user_db";
import { Branch } from "../model/branch_db";
import { academicConfig } from "../model/academic_config_db";
import { Sem } from "../model/sem_db";
import { responseStatus } from "../shared/response_status";
import { options } from "../shared/const_values";
import { Subject } from "../model/subjects_db";
export class MarksDetailsDAO {
  public async addAcademicDetails(studentAcademicObj: any): Promise<any> {
    try {
      let student_id = studentAcademicObj.student_id;
      let semister = studentAcademicObj.sem;

      //check student id present in db
      let studentAcademicDetails: any = await marksDetail.findOne({
        student_id: student_id,
      });
      // if present then update only academic details array in DB
      if (studentAcademicDetails) {
        //checking semister is exist or not
        let academicDetails: any[] = studentAcademicDetails.academic_details;
        let isSemisterExist = academicDetails.findIndex((data) => {
          return data.sem == semister;
        });

        //if isSemisterExist is greater than 0 then the same semister is already present in DB
        if (isSemisterExist >= 0) {
          academicDetails.forEach((academicObj) => {
            // if semister exist then update the academic obj for that semister
            if (academicObj.sem == semister) {
              academicObj.marks = studentAcademicObj.marks;
              return academicObj;
            }
          });
          academicDetails = this.calculateTotalMarksOfSubject(academicDetails)
          let updatedAcademicObj = await marksDetail.findOneAndUpdate(
            { student_id: student_id },
            { academic_details: academicDetails },
            { new: true }
          );
          return { result: updatedAcademicObj };
        }
        //if semister is not exist then add this semister obj details in db on academic details array
        else {
          academicDetails.push({
            sem: semister,
            marks: studentAcademicObj.marks,
          });
          academicDetails= this.calculateTotalMarksOfSubject(academicDetails)
          let updatedAcademicObj = await marksDetail.findOneAndUpdate(
            { student_id: student_id },
            { academic_details: academicDetails },
            { new: true }
          );
          return { result: updatedAcademicObj };
        }
      }
      //if student id is not present then create student object in marksdb along with academic detaiils
      else {
        let newStudentAcademicObj = {
          student_id: student_id,
          academic_details: [
            {
              sem: semister,
              marks: studentAcademicObj.marks,
            },
          ],
        };
        newStudentAcademicObj.academic_details =this.calculateTotalMarksOfSubject(newStudentAcademicObj.academic_details)
        let newMarksDetail = new marksDetail(newStudentAcademicObj);
        let studentAcademicObjInDB = await newMarksDetail.save();
        return { result: studentAcademicObjInDB };
      }
    } catch (err) {
      throw err;
    }
  }

  public async studentMarks(studentObj: any): Promise<any> {
    try {
      //check student id present in db
      const student_exist = await User.findOne({
        login_id: studentObj.student_id,
      });
      if (student_exist) {
        let studentAcademicDetails: any = await marksDetail.findOne({
          student_id: studentObj.student_id,
        });
        
        if (studentAcademicDetails) {
          //checking semister is exist or not
          let academicDetails: any[] = studentAcademicDetails.academic_details;
          let isSemisterExist = academicDetails.findIndex((data) => {
            return data.sem == studentObj.sem;
          });
          let semMarks: any;
          //if isSemisterExist is greater than 0 then the same semister is already present in DB
          if (isSemisterExist >= 0) {
            for (const academicObj of academicDetails) {
              // if semister exist then update the academic obj for that semister
              if (academicObj.sem == studentObj.sem) {
                let subject_not_exist_in_academicObj =  await this.getInitialSubjects(student_exist,studentObj.sem,academicObj)
                 if(subject_not_exist_in_academicObj.length > 0){
                academicObj['marks'] = [...academicObj['marks'],...subject_not_exist_in_academicObj]
                 }
                semMarks = academicObj['marks'];
               }
            }
            return { result: semMarks };
          } else {
            const initialResponse = await this.getInitialMarksResponse(student_exist,studentObj.sem )
            return { result: initialResponse };
          }
        } else {
          
          const initialResponse = await this.getInitialMarksResponse(student_exist,studentObj.sem )
          return { result: initialResponse };
        }
      } else {
        
        return { error: responseStatus.student_not_exist };
      }
    } catch (err) {
      throw err;
    }
  }

  public async studentGrades(student_id: String): Promise<any> {
    try {
      const student_exist = await User.findOne({ login_id: student_id });
      if (student_exist) {
        let studentAcademicDetails: any = await marksDetail.findOne({
          student_id: student_id,
        });

        if (studentAcademicDetails) {
          let totalMarksObj: any[] = [];
          let academicDetails: any[] = studentAcademicDetails.academic_details;
          type semMarksObj = {
            sem: Number;
            total_marks: Number;
          };
          for (const semElement of academicDetails) {
            let totalSemMarks = 0;
            let obj: semMarksObj = {
              sem: 0,
              total_marks: 0,
            };

            for (const marksElement of semElement.marks) {
              /*  let totalIntenalMarks = Number(marksElement.internals['internal']['avg_mark']) +
                                       Number(marksElement.internals['assignment']['avg_mark']) +
                                       Number(marksElement.internals['events']['avg_mark']) +
                                       Number(marksElement.internals['external_marks']) */

              totalSemMarks += Number(marksElement["total_marks"]);
            }
            obj.total_marks = totalSemMarks;
            obj.sem = semElement.sem;

            totalMarksObj.push(obj);
          }
          const maxValueOfSem = Math.max(...totalMarksObj.map((o) => o.sem), 0);
          if (maxValueOfSem != 0) {
            let semCount = maxValueOfSem;
            while (semCount < 8) {
              semCount++;
              totalMarksObj.push({ sem: semCount, total_marks: null });
            }
          }
          return { result: totalMarksObj };
        } else {
          return { result: options.student_initial_total_marks };
        }
      } else {
        return { error: responseStatus.student_not_exist };
      }
    } catch (err) {
      throw err;
    }
  }

  public async getInitialMarksResponse(studentObj: any, sem:string): Promise<any> {
      
    try{
     
      let sem_exist : any = await Sem.findOne({
        name: sem,
      });
     
    let markResponse = [];
      let subject_exist:any = await Subject.find({
        sem: sem_exist['_id'],
        scheme: { $in: [ studentObj.scheme ]},
        branch: { $in: [ studentObj.branch ]}
      });

    
      let schemeExist: any = await academicConfig.findOne({
        _id: studentObj.scheme,
      });
      
      for (const subjectElement of subject_exist) {
        let obj :any= {}
        obj.subject_code = subjectElement['subject_code']
        obj.subject_name = subjectElement['subject_name']
        obj.internals = {};
        obj.external_marks = 0;
        obj.total_marks = 0;
       
        for (const examElement of schemeExist.internal.exam_list) { 
          obj.internals[`${examElement['name'].toLowerCase()}`] = {}
          let count =  examElement['total_test']; 
            for (let index = 1; index <= count; index++) {
              let testName = examElement['name'].toLowerCase() + index;
              obj.internals[`${examElement['name'].toLowerCase()}`][`${testName}`] = 0;
              obj.internals[`${examElement['name'].toLowerCase()}`].avg_mark = 0;
            }   
        }
        
        markResponse.push(obj)
      }
      return markResponse;
    }catch (err) {
      throw err;
    }

  }

  public async getInitialSubjects(studentObj: any, sem:string, academicObj: any): Promise<any> {
   
    try{
      let sem_exist : any = await Sem.findOne({
        name: sem,
      });
    let markResponse = [];
      let subject_exist:any = await Subject.find({
        sem: sem_exist['_id'],
        scheme: { $in: [ studentObj.scheme ]},
        branch: { $in: [ studentObj.branch ]}
      });
    
      let schemeExist: any = await academicConfig.findOne({
        _id: studentObj.scheme,
      });
      
      for (const subjectElement of subject_exist) {
        let obj :any= {}        
        let subject_not_exist_in_academicObj = academicObj['marks'].findIndex((academic:any)=> academic['subject_code'] === subjectElement['subject_code'] )
     
        if(subject_not_exist_in_academicObj < 0) {
          obj.subject_code = subjectElement['subject_code']
          obj.subject_name = subjectElement['subject_name']
          obj.internals = {};
          obj.external_marks = 0;
          obj.total_marks = 0;
        for (const examElement of schemeExist.internal.exam_list) { 
          obj.internals[`${examElement['name'].toLowerCase()}`] = {}
          let count =  examElement['total_test']; 
            for (let index = 1; index <= count; index++) {
              let testName = examElement['name'].toLowerCase() + index;
              obj.internals[`${examElement['name'].toLowerCase()}`][`${testName}`] = 0;
              obj.internals[`${examElement['name'].toLowerCase()}`].avg_mark = 0;
            }   
        }
        markResponse.push(obj)
      }
    }

   
    return markResponse;

    }catch (err) {
      throw err;
    }
  }


  public  calculateTotalMarksOfSubject(academicDetails:any):any[]{
    for (const element of academicDetails) {
      const subjectMarks = element['marks'];
      for (const eachSubject of subjectMarks) {
        let total_internal_marks = 0;
        for (const iterator of Object.keys(eachSubject['internals'])) {
          total_internal_marks +=Number((eachSubject['internals'][iterator]['avg_mark']))?Number((eachSubject['internals'][iterator]['avg_mark'])):0
        }
        eachSubject['total_marks'] = Number((eachSubject['external_marks']))?Number((eachSubject['external_marks']))+total_internal_marks : total_internal_marks
      }   
    }
    return academicDetails;

  }
}


