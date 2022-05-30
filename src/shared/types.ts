
export type memberObj = {
    member_id: String
}

export type projectObjType = {
    _id: String;
    project_photo_path:Array<String>
    project_title: String;
    project_guide: String;
    project_members: Array<String>;
    project_cost: Number;
    project_duration: String;
    project_semister: String;
    project_description: String
};

export type exam_list_type = {
    name: String;
    max_marks: Number;
    total_test: Number;
};
export type branchType = {
    id: String;
    name: String;
};

export type designationType = {
    id: String;
    name: String;
};

export type semType = {
    id: String;
    name: String;
};
export type basicInfoType = {
    branch: branchType[];
    scheme: [];
    sem: semType[];
    designation: designationType[];
};

export type ProjectType = {
    project_photo_path:Array<String>
    project_title:String,
    project_guide:String,
    project_members:Array<memberObj>,
    project_cost:String,
    project_duration:String,
    project_semister:String,
    project_description:String
}
export type updatedProjectType = {
    _id: String;
    project_photo_path:Array<String>
    project_title:String,
    project_guide:String,
    project_members:Array<memberObj>,
    project_cost:String,
    project_duration:String,
    project_semister:String,
    project_description:String
}
export type AddProjectType = {
    student_id:String,
    projects:ProjectType
}