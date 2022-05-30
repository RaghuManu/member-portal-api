import { ExtraActivities } from "../model/extra_activities_db";
import { responseStatus } from "../shared/response_status";
import { Sem } from "../model/sem_db";
export class ExtraActivitiesDAO {
  public async addExtraActivities(extraActivityObj: any): Promise<any> {
    try {
      const student_id = extraActivityObj.student_id;
      const activity = extraActivityObj.extra_activities;

      /* 
           check student id exist or not
           if exist add only activity in extraactivity array
           else create a new student id in exta_Activities DB
           */

      let student_extra_activity_obj: any = await ExtraActivities.findOne({
        student_id: student_id,
      });
      if (student_extra_activity_obj) {
        let extraActivityObjInDB: any[] =
          student_extra_activity_obj.extra_activities;

        let isEventExist = this.checkExtraActivityAlreadyAdded(
          activity,
          extraActivityObjInDB
        );
        if (isEventExist > 0) {
          return { error: responseStatus.event_already_exist };
        } else {
          extraActivityObjInDB.push(activity);
          const updatedExtraActivityObjInDB = await ExtraActivities.findOneAndUpdate(
            { student_id: student_id },
            { $set: { extra_activities: extraActivityObjInDB } },
            { new: true }
          );
          return { result: updatedExtraActivityObjInDB };
        }
      } else {
        const studentExtraActivityObj = {
          student_id: student_id,
          extra_activities: [activity],
        };

        const newstudentExtraActivityObj = await new ExtraActivities(
          studentExtraActivityObj
        ).save();
        return { result: newstudentExtraActivityObj };
      }
    } catch (err) {
      throw err;
    }
  }

  private checkExtraActivityAlreadyAdded(
    newActivity: any,
    dbActivity: any[]
  ): any {
    let count = 0;
    for (let dbactivity of dbActivity) {
      let isEventTypeAdded =
        dbactivity.event_type.toUpperCase() ===
        newActivity.event_type.toUpperCase()
          ? true
          : false;
      let isEventNameAdded =
        dbactivity.event_name.toUpperCase() ===
        newActivity.event_name.toUpperCase()
          ? true
          : false;
      let isEventVenueAdded =
        dbactivity.event_venue.toUpperCase() ===
        newActivity.event_venue.toUpperCase()
          ? true
          : false;

      if (isEventTypeAdded && isEventNameAdded && isEventVenueAdded) {
        count++;
      }
    }

    return count;
  }

  public async getExtraActivities(student_id: String): Promise<any> {
    try {
      let studentExtraActivities:any = await ExtraActivities.findOne({
        student_id: student_id,
      });
      let responseObj = {};
      let studentExtraActivitiesObj = [];
      if (studentExtraActivities) {
       
        for (let activity of studentExtraActivities['extra_activities']) {
          let activityObj: any = {};
          let semister={};
          if (activity['semister']) {
            let semDetails: any = await Sem.findById(activity['semister']);
            semister = semDetails && semDetails["name"] ? { id: activity['semister'], name: semDetails["name"] } : '';
            activityObj.semister = semister;
          }
          activityObj.certification_file_path = activity.certification_file_path;
          activityObj.event_date = activity.event_date;
          activityObj.event_name = activity.event_name;
          activityObj.event_result = activity.event_result;
          activityObj.event_type = activity.event_type;
          activityObj.event_venue = activity.event_venue;
          activityObj._id = activity._id; 
          studentExtraActivitiesObj.push(activityObj);
        }

        responseObj = {
          student_id: student_id,
          extra_activities: studentExtraActivitiesObj
        }
        return { result: responseObj };
      } else {
        return { result: {} };
      }
    } catch (err) {
      throw err;
    }
  }

  public async updateExtraActivity(
    student_id: String,
    activity: any
  ): Promise<any> {
    try {
      let activityId = activity._id;
      delete activity._id;
      let student_extra_activity_obj: any = await ExtraActivities.findOne({
        student_id: student_id,
      });

      if (student_extra_activity_obj) {
        let extraActivityObjInDB: any[] =
          student_extra_activity_obj.extra_activities;

        let isEventExist = this.checkExtraActivityAlreadyAdded(
          activity,
          extraActivityObjInDB
        );
        if (isEventExist > 1) {
          return { error: responseStatus.event_already_exist };
        } else {
          const updatedActivity = await ExtraActivities.findOneAndUpdate(
            { "extra_activities._id": activityId },
            {
              $set: {
                "extra_activities.$.event_type": activity.event_type,
                "extra_activities.$.event_name": activity.event_name,
                "extra_activities.$.event_date": activity.event_date,
                "extra_activities.$.event_venue": activity.event_venue,
                "extra_activities.$.event_result": activity.event_result,
                "extra_activities.$.semister": activity.semister,
                "extra_activities.$.certification_file_path":
                  activity.certification_file_path,
              },
            },
            { new: true }
          );
          return { result: updatedActivity };
        }
      } else {
        return { error: responseStatus.student_not_exist };
      }
    } catch (err) {
      throw err;
    }
  }

  public async deleteExtraActivity(activityId: any): Promise<any> {
    try {
      const deletedActivity = await ExtraActivities.update(
        {},
        {
          $pull: {
            extra_activities: { _id: activityId },
          },
        }
      );
      if (deletedActivity) {
        return { result: deletedActivity };
      } else {
        return { error: responseStatus.no_activity };
      }
    } catch (err) {
      throw err;
    }
  }
}
