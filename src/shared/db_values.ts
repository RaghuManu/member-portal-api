import { Branch } from "../model/branch_db";
import { Designation } from "../model/designation_db";
import { Sem } from "../model/sem_db";

const branchInitialize = async () => {
  console.log("branch initialize method");
  const branchExists = await Branch.find({});

  if (branchExists.length == 0) {
    let branchObj;
    let branch_obj_result;
    const branch = [
      {
        id: "al_ml",
        name: "Artificial Intelligence And Machine Learning Engineering",
      },
      { id: "cse", name: "Computer Science And Engineering" },
      { id: "ece", name: "Electronics And Communication Engineering" },
      { id: "me", name: "Mechanical Engineering" },
      { id: "tce", name: "Electronics and TeleCommunication Engineering" },
      { id: "sh", name: "Science And Humanities" },
    ];

    for (const element of branch) {
      branchObj = {
        name: element["name"],
      };
      branch_obj_result = await new Branch(branchObj);
      await branch_obj_result.save();
    }
  }
};

const designationInitialize = async () => {
  console.log("designation initialize method");

  const designationExists = await Designation.find({});

  if (designationExists.length == 0) {
    let designationObj;
    let designation_obj_result;
    const designation = [
      { id: "hod", name: "Head of the Department" },
      { id: "professor", name: "PROFESSOR" },
      { id: "asscprofessor", name: "ASSOCIATE PROFESSOR" },
      { id: "asstprofessor", name: "ASSISTANT PROFESSOR" },
      { id: "asstforeman", name: "ASSISTANT FOREMAN" },
      { id: "asstinstructor", name: "ASSISTANT INSTRUCTOR" },
      { id: "instructor", name: "INSTRUCTOR" },
      { id: "attendar", name: "ATTENDAR" },
      { id: "student", name: "STUDENT" },
      {id: "admin", name: "ADMIN"}
    ];

    for (const element of designation) {
      designationObj = {
        name: element["name"],
      };
      designation_obj_result = await new Designation(designationObj);
      await designation_obj_result.save();
    }
  }
};

const semInitialize = async () => {
  console.log("sem initialize method");
  const semExists = await Sem.find({});

  if (semExists.length == 0) {
    let semObj;
    let sem_obj_result;
    const sem = [
      { name: 1 },
      { name: 2 },
      { name: 3 },
      { name: 4 },
      { name: 5 },
      { name: 6 },
      { name: 7 },
      { name: 8 },
    ];

    for (const element of sem) {
      semObj = {
        name: element["name"],
      };
      sem_obj_result = await new Sem(semObj);
      await sem_obj_result.save();
    }
  }
};

export const dbValueInitializer = {
  branchInitialize: branchInitialize,
  designationInitialize: designationInitialize,
  semInitialize: semInitialize,
};
