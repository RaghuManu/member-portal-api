import { academicConfig } from "../model/academic_config_db";
import { responseStatus } from "../shared/response_status";
import { Branch } from "../model/branch_db";
import { Designation } from "../model/designation_db";
import { Sem } from "../model/sem_db";
export class AcademicConfigDAO {
  public async addAcademicConfig(configObj: any): Promise<any> {
    try {
      let schemeExist = await academicConfig.findOne({
        scheme: configObj.scheme,
      });
      if (schemeExist) {
        return { error: responseStatus.scheme_exist };
      } else {
        let academicConfigObj = new academicConfig(configObj);
        let newConfigObj = await academicConfigObj.save();
        return { result: newConfigObj };
      }
    } catch (err) {
      throw err;
    }
  }

  public async getAcademicConfig(studentSchemeObj: any): Promise<any> {
    try {
      let scheme = await academicConfig.findOne({
        scheme: studentSchemeObj.scheme,
      });
      if (scheme) {
        return { result: scheme };
      } else {
        return { error: responseStatus.scheme_not_exist };
      }
    } catch (err) {
      throw err;
    }
  }

  public async getAllAcademicConfig(skip: number, limit: number): Promise<any> {
    try {
      let scheme = await academicConfig.find().skip(skip)
      .limit(limit);

      if (scheme) {
        const academicCount = await this.getAcademicsConfigCount();
        return { result: {schemes:scheme,total_count:academicCount }};
      } else {
        return { result: {} };
      }
    } catch (err) {
      throw err;
    }
  }
  public async getAcademicsConfigCount(): Promise<any> {
    try {
      const academicCount = await academicConfig.countDocuments()
      return academicCount;
    } catch (err) {
      throw err;
    }
  }
  public async updateAcademicScheme(configObj: any): Promise<any> {
    try {
      let schemeExist = await academicConfig.findOne({
        scheme: configObj.scheme,
      });
      if (schemeExist) {
        let updatedAcademicSceme = await academicConfig.findOneAndUpdate(
          { scheme: configObj.scheme },
          configObj,
          { new: true }
        );
        return { result: updatedAcademicSceme };
      } else {
        return { error: responseStatus.scheme_not_exist };
      }
    } catch (err) {
      throw err;
    }
  }

  public async deleteAcademicScheme(scheme: any): Promise<any> {
    try {
      let schemeExist = await academicConfig.findOne({
        scheme: scheme,
      });
      if (schemeExist) {
        let academicSchemeObj = await academicConfig.findOneAndDelete({
          scheme: scheme,
        });

        return { result: academicSchemeObj };
      } else {
        return { error: responseStatus.scheme_not_exist };
      }
    } catch (err) {
      throw err;
    }
  }

  public async getAcademicSchemes(): Promise<any> {
    try {
      const schemes = await academicConfig.find({}, "scheme");

      if (schemes.length > 0) {
        return { result: schemes };
      } else {
        return { error: responseStatus.scheme_not_exist };
      }
    } catch (err) {
      throw err;
    }
  }

  public async getBranchSchemes(): Promise<any> {
    try {
      const branch = await Branch.find({});

      if (branch.length > 0) {
        return { result: branch };
      } else {
        return { error: responseStatus.branch_not_exist };
      }
    } catch (err) {
      throw err;
    }
  }

  public async getDesignationSchemes(): Promise<any> {
    try {
      const designation = await Designation.find({});

      if (designation.length > 0) {
        return { result: designation };
      } else {
        return { error: responseStatus.designation_not_exist };
      }
    } catch (err) {
      throw err;
    }
  }

  public async getSemSchemes(): Promise<any> {
    try {
      const sem = await Sem.find({});

      if (sem.length > 0) {
        return { result: sem };
      } else {
        return { error: responseStatus.sem_not_exist };
      }
    } catch (err) {
      throw err;
    }
  }
}
