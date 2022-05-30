import { Scholarship } from "../model/scholarship_db";
import { responseStatus } from "../shared/response_status";
export class ScholarshipDAO {
  public async addScholarship(scholarshipObj: any): Promise<any> {
    try {
      const student_id = scholarshipObj.student_id;
      const scholarship = scholarshipObj.scholarship;
      let student_scholarship_obj: any = await Scholarship.findOne({
        student_id: student_id,
      });
      if (student_scholarship_obj) {
        let scholarshipObjInDB: any[] = student_scholarship_obj.scholarship;

        let isScholarshipExist = scholarshipObjInDB.findIndex(
          (scholarshipElement) => {
            return (
              scholarshipElement.application_no === scholarship.application_no
            );
          }
        );
        if (isScholarshipExist >= 0) {
          return { error: responseStatus.application_no };
        } else {
          scholarshipObjInDB.push(scholarship);
          const updatedScholarshipObjInDB = await Scholarship.findOneAndUpdate(
            { student_id: student_id },
            { $set: { scholarship: scholarshipObjInDB } },
            { new: true }
          );
          return { result: updatedScholarshipObjInDB };
        }
      } else {
        const studentScholarshipObj = {
          student_id: student_id,
          scholarship: [scholarship],
        };
        const newstudentcholarshipObj = await new Scholarship(
          studentScholarshipObj
        ).save();
        return { result: newstudentcholarshipObj };
      }
    } catch (err) {
      throw err;
    }
  }

  public async updateScholarship(
    student_id: String,
    scholarship: any
  ): Promise<any> {
    try {
      let scholarshipId = scholarship._id;
      delete scholarship._id;
      let student_scholarship_obj: any = await Scholarship.findOne({
        student_id: student_id,
      });
      if (student_scholarship_obj) {
        let scholarshipObjInDB: any[] = student_scholarship_obj.scholarship;

        let isScholarshipExist = this.checkOtherSimilarScholarShipExist(
          scholarship,
          scholarshipObjInDB
        );
        if (isScholarshipExist >= 1) {
          return { error: responseStatus.scholarship_exist };
        } else {
          const updatedScholarship = await Scholarship.findOneAndUpdate(
            { "scholarship._id": scholarshipId },
            {
              $set: {
                "scholarship.$.sanctioned_date": scholarship.sanctioned_date,
                "scholarship.$.application_no": scholarship.application_no,
               /*  "scholarship.$.sanctioned_year": scholarship.sanctioned_year,
                "scholarship.$.resource_file_path":
                  scholarship.resource_file_path, */
                "scholarship.$.particulars": scholarship.particulars,
                "scholarship.$.sanctioned_amount":
                  scholarship.sanctioned_amount,
                "scholarship.$.certification_file_path":
                  scholarship.certification_file_path,
              },
            },
            { new: true }
          );
          return { result: updatedScholarship };
        }
      } else {
        return { error: responseStatus.student_not_exist };
      }
    } catch (err) {
      throw err;
    }
  }

  public async deleteScholarship(scholarshipId: any): Promise<any> {
    let ObjectId = require("mongoose").Types.ObjectId;
    try {
      const deleteScholarShip = await Scholarship.update(
        {},
        {
          $pull: {
            scholarship: { _id: new ObjectId(scholarshipId) },
          },
        },
        {
          multi: true,
        }
      );

      const isDeletedDataExist = await Scholarship.findOne({
        "scholarship._id": scholarshipId,
      });
      if (isDeletedDataExist) {
        return { error: responseStatus.scholarship_delete_failure };
      } else {
        return { result: responseStatus.scholarship_delete_success };
      }
    } catch (err) {
      throw err;
    }
  }

  public async getScholarship(scholarshipId: any): Promise<any> {
    try {
      let ObjectId = require("mongoose").Types.ObjectId;
      const scholarship: any = await Scholarship.findOne({
        "scholarship._id": new ObjectId(scholarshipId),
      });
      if (scholarship) {
        return { result: scholarship.scholarship };
      } else {
        return { error: responseStatus.no_scholarShip };
      }
    } catch (err) {
      throw err;
    }
  }

  public async getAllScholarship(student_id: String): Promise<any> {
    try {
      let studentScholarships = await Scholarship.findOne({
        student_id: student_id,
      });
      if (studentScholarships) {
        return { result: studentScholarships };
      } else {
        return { result: {} };
      }
    } catch (err) {
      throw err;
    }
  }

  private checkOtherSimilarScholarShipExist(
    newScholarShip: any,
    dbScholarShip: any[]
  ): any {
    let count = 0;

    for (let dbscholarship of dbScholarShip) {
      /*  let isSanctionedDateAdded =
                dbscholarship.sanctioned_date ===
                    newScholarShip.sanctioned_date
                    ? true
                    : false;
            */

      let isApplicationNoAdded =
        dbscholarship.application_no.toUpperCase() ===
        newScholarShip.application_no.toUpperCase()
          ? true
          : false;
    /*   let isSanctionedYearAdded =
        dbscholarship.sanctioned_year.toUpperCase() ===
        newScholarShip.sanctioned_year.toUpperCase()
          ? true
          : false;
      let isResourceFilePathAdded =
        dbscholarship.resource_file_path.toUpperCase() ===
        newScholarShip.resource_file_path.toUpperCase()
          ? true
          : false; */
      let isParticularsAdded =
        dbscholarship.particulars.toUpperCase() ===
        newScholarShip.particulars.toUpperCase()
          ? true
          : false;
      let isSanctionedAmountAdded =
        dbscholarship.sanctioned_amount.toUpperCase() ===
        newScholarShip.sanctioned_amount.toUpperCase()
          ? true
          : false;
      let iscertificationFilePathAdded =
        dbscholarship.certification_file_path.toUpperCase() ===
        newScholarShip.certification_file_path.toUpperCase()
          ? true
          : false;
      if (
        isApplicationNoAdded &&
        isParticularsAdded &&
       /*  isResourceFilePathAdded &&
        isSanctionedYearAdded && */
        isSanctionedAmountAdded &&
        iscertificationFilePathAdded
        /*  && isSanctionedDateAdded */
      ) {
        count++;
      }
    }
    return count;
  }
}
