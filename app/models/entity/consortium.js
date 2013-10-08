/**
 * Consourtium Schema
 */

var EntityGroupSchema = new Schema({
  type : String, // just consortium for now
  members : [entities.id]
})