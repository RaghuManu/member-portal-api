import { Subject } from "../model/subjects_db";
import { responseStatus } from "../shared/response_status";
import { Sem } from "../model/sem_db";
import { Branch } from "../model/branch_db";
import { academicConfig } from "../model/academic_config_db";
type excelSubjectObj = {
  subject_code: String;
  subject_name: String;
  scheme: any;
  sem: String;
  branch: any;

};
export class SubjectDAO {
  public async createSubject(subjectObj: any): Promise<any> {
    try {
      let subject_exist = await Subject.findOne({
        subject_code: subjectObj.subject_code,
      });
      if (subject_exist) {
        return { error: responseStatus.subject_exist };
      }
      let subject = new Subject(subjectObj);

      let newSubject = await subject.save();
      return { result: newSubject };
    } catch (err) {
      throw err;
    }
  }

  public async getSubjects(skip: number, limit: number): Promise<any> {
    try {
      // if(!skip) skip=0;
      // if(!limit) limit=10;
      let subjects: any = await Subject.find({}).skip(skip).limit(limit);

      let responseObj = [];
      for (let element of subjects) {
        let schemeNames = [];
        let branchNames = [];
        let sem = {};
        let obj: any = {};

        if (element.scheme) {
          for (const schemeElement of element.scheme) {
            let scheme: any = await academicConfig.findById(schemeElement);
            if (scheme && scheme['scheme']) schemeNames.push({ id: schemeElement, name: scheme["scheme"] });
          }
        }
        if (element.branch) {
          for (const branchElement of element.branch) {
            let branch: any = await Branch.findById(branchElement);
            if (branch && branch['name']) branchNames.push({ id: branch["_id"], name: branch["name"] });
          }
        }
        if (element.sem) {
          let semDetails: any = await Sem.findById(element.sem);
          sem = semDetails && semDetails["name"] ? { id: element.sem, name: semDetails["name"] } : '';
        }

        obj.subject_code = element.subject_code;
        obj.subject_name = element.subject_name;
        obj.scheme = schemeNames.length > 0 ? schemeNames : '';
        obj.branch = branchNames.length > 0 ? branchNames : '';
        obj.sem = sem;
        responseObj.push(obj);
      }
      const subjectCount = await this.getSubjectsCount();
      return { subjects: responseObj,total_count:subjectCount };
    } catch (err) {
      throw err;
    }
  }
  public async getSubjectsCount(): Promise<any> {
    try {
      let subjectCount = await Subject.countDocuments()
      return subjectCount;
    } catch (err) {
      throw err;
    }
  }
  public async updateSubject(subjectObj: any): Promise<any> {
    try {
      let subjectExist = await Subject.findOne({
        subject_code: subjectObj.subject_code,
      });
      if (subjectExist) {
        let subjectDB = await Subject.findOneAndUpdate(
          { subject_code: subjectObj.subject_code },
          subjectObj
        );

        return { result: subjectDB };
      } else {
        return { error: responseStatus.subject_not_found };
      }
    } catch (err) {
      throw err;
    }
  }

  public async deleteSubject(subject_code: string): Promise<any> {
    try {
      let subjectExist = await Subject.findOne({ subject_code: subject_code });
      if (subjectExist) {
        let subjectDB = await Subject.findOneAndDelete({
          subject_code: subject_code,
        });

        return { result: subjectDB };
      } else {
        return { error: responseStatus.subject_not_found };
      }
    } catch (err) {
      throw err;
    }
  }

  public async checkExcelData(excelRowData: any): Promise<any> {
    try {
      let schemeArray: String[] = [];
      let branchArray: String[] = [];
      let errorObj: any[] = [];
      let obj: excelSubjectObj = {
        subject_code: excelRowData['subject code'],
        subject_name: excelRowData['subject name'],
        scheme: excelRowData['scheme'],
        sem: excelRowData['semister'],
        branch: excelRowData['branch'],
      };


      let scheme_exist: any = await academicConfig.findOne({ scheme: obj.scheme });
      let branch_exist: any = await Branch.findOne({ name: obj.branch });
      if (!scheme_exist || !branch_exist) {
        if (!scheme_exist)
          errorObj.push(responseStatus.scheme_not_exist);
        if (!branch_exist)
          errorObj.push(responseStatus.branch_not_exist);

      }

      else {
        let scheme_id = scheme_exist._id.toString();
        let branch_id = branch_exist._id.toString();
        let subject_exist: any = await Subject.findOne({
          subject_code: obj.subject_code,
        });
        if (subject_exist) {
          //check scheme is added in this subject
          let s_index = subject_exist.scheme.findIndex((scheme: any) => {
            scheme = scheme.toString()


            return (scheme == scheme_id)
          });
          //scheme is not added in this subject

          if (s_index == -1) {
            subject_exist.scheme.push(scheme_id);
            obj.scheme = subject_exist.scheme;
          } else {
            obj.scheme = subject_exist.scheme;
          }

          //check branch is added in this subject
          let b_index = subject_exist.branch.findIndex((branch: string) => branch.toString() == branch_id);
          //branch is not added in this subject
          if (b_index == -1) {
            subject_exist.branch.push(branch_id);
            obj.branch = subject_exist.branch;
          } else {
            obj.branch = subject_exist.branch;
          }
        } else {
          obj.branch = [branch_id];
          obj.scheme = [scheme_id];
        }
      }

      //get sem id

      let semObjInDB: any = await Sem.findOne({ name: obj.sem });
      if (!semObjInDB) {
        errorObj.push(responseStatus.sem_not_exist);
      } else {
        obj.sem = semObjInDB._id;
      }

      if (errorObj.length >= 1) {
        return { error: errorObj.toString() };
      }


      return obj;

    }
    catch (err) {
      throw err;
    };
  }
}
