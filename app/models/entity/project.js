/**
 * Project Schema
 */

var ProjectSchema = new Schema({
  parent: {project.id},
  children: [project.id],
  supervisor: {entity.id},
  executors: [entity.id],
  url: {
    homepage: String
  },
  profile: {type : String, default : '', trim : true},
  image: {
    cdnUri: String,
    files: []
  },
  influence: {
    economicActivities: [],
    cities: []
  },
  createdAt  : {type : Date, default : Date.now}
})